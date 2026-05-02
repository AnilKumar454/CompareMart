const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { body } = require('express-validator');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { handleValidationErrors } = require('../middleware/validate');

// ── Load User model; use in-memory when DB is disconnected ───────────────────
let User = null;
try { User = require('../models/User'); } catch (_) {}

// Check if MongoDB is actually connected (readyState 1 = connected)
const isDBReady = () => mongoose.connection.readyState === 1;

// ── In-Memory Store (used when MongoDB is unavailable) ───────────────────────
const memUsers = new Map();   // email → user object
let memIdCounter = 1;

const createMemUser = (data) => {
  const id = String(memIdCounter++);
  const now = new Date().toISOString();
  const user = {
    _id: id, id,
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    email: (data.email || '').toLowerCase().trim(),
    password: data.password || null,      // already hashed
    googleId: data.googleId || null,
    avatar: data.avatar || '',
    phoneNumber: data.phoneNumber || '',
    preferences: data.preferences || { categories: [], notifications: true, theme: 'auto' },
    address: data.address || {},
    isProfileComplete: data.isProfileComplete ?? false,
    isGoogleUser: data.isGoogleUser ?? false,
    isActive: true,
    lastLogin: now,
    createdAt: now,
    updatedAt: now,
  };
  memUsers.set(user.email, user);
  return user;
};

const findMemUser = (email) => memUsers.get((email || '').toLowerCase().trim()) || null;
const findMemById = (id) => [...memUsers.values()].find((u) => u.id === id || u._id === id) || null;

const toSafeUser = (u) => {
  const { password, googleId, ...safe } = u;
  safe.fullName = u.lastName ? `${u.firstName} ${u.lastName}` : u.firstName;
  return safe;
};

// ────────────────────────────────────────────────────────────────────────────
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const sendTokenResponse = (user, statusCode, res, extra = {}) => {
  const token = generateToken(user._id || user.id);
  const safeUser = typeof user.toSafeObject === 'function' ? user.toSafeObject() : toSafeUser(user);
  res.status(statusCode).json({ success: true, token, user: safeUser, ...extra });
};

// ── Validation rules ─────────────────────────────────────────────────────────
const registerValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('email').trim().notEmpty().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().isLength({ min: 6 }).withMessage('Password min 6 chars')
    .matches(/\d/).withMessage('Password must contain a number'),
];

const loginValidation = [
  body('email').trim().notEmpty().isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

// ── Register ─────────────────────────────────────────────────────────────────
const register = [
  ...registerValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { firstName, lastName = '', email, password } = req.body;

      if (isDBReady()) {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ success: false, message: 'Email already registered.' });
        const user = await User.create({ firstName, lastName, email, password, isProfileComplete: false });
        return sendTokenResponse(user, 201, res);
      }

      // In-memory path
      if (findMemUser(email)) {
        return res.status(400).json({ success: false, message: 'Email already registered.' });
      }
      const salt = await bcrypt.genSalt(12);
      const hashed = await bcrypt.hash(password, salt);
      const user = createMemUser({ firstName, lastName, email, password: hashed });
      return sendTokenResponse(user, 201, res);
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
  },
];

// ── Login ────────────────────────────────────────────────────────────────────
const login = [
  ...loginValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      if (isDBReady()) {
        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        if (user.isGoogleUser && !user.password)
          return res.status(400).json({ success: false, message: 'Please use "Continue with Google".' });
        const ok = await user.comparePassword(password);
        if (!ok) return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        user.lastLogin = Date.now();
        await user.save({ validateBeforeSave: false });
        return sendTokenResponse(user, 200, res);
      }

      // In-memory path
      const user = findMemUser(email);
      if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      if (!user.password) return res.status(400).json({ success: false, message: 'Please use "Continue with Google".' });
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      user.lastLogin = new Date().toISOString();
      return sendTokenResponse(user, 200, res);
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ success: false, message: 'Server error during login.' });
    }
  },
];

// ── Google OAuth ──────────────────────────────────────────────────────────────
const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ success: false, message: 'Google credential required.' });

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { sub: googleId, email, given_name: firstName, family_name: lastName, picture: avatar } = ticket.getPayload();

    if (isDBReady()) {
      let user = await User.findOne({ $or: [{ email }, { googleId }] });
      let isNewUser = false;
      if (!user) {
        user = await User.create({ firstName, lastName: lastName || '', email, googleId, avatar, isGoogleUser: true, isProfileComplete: false });
        isNewUser = true;
      } else {
        if (!user.googleId) user.googleId = googleId;
        if (!user.avatar && avatar) user.avatar = avatar;
        user.lastLogin = Date.now();
        await user.save({ validateBeforeSave: false });
      }
      return sendTokenResponse(user, 200, res, { isNewUser });
    }

    // In-memory path
    let user = findMemUser(email);
    let isNewUser = false;
    if (!user) {
      user = createMemUser({ firstName, lastName: lastName || '', email, googleId, avatar, isGoogleUser: true, isProfileComplete: false });
      isNewUser = true;
    } else {
      user.lastLogin = new Date().toISOString();
    }
    return sendTokenResponse(user, 200, res, { isNewUser });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ success: false, message: 'Google authentication failed.' });
  }
};

// ── Get Me ────────────────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    if (isDBReady()) {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
      return res.json({ success: true, user: user.toSafeObject() });
    }
    const user = findMemById(req.user._id || req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user: toSafeUser(user) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── Complete Profile ──────────────────────────────────────────────────────────
const completeProfile = [
  body('phoneNumber').optional().matches(/^[+]?[\d\s\-().]{7,20}$/).withMessage('Invalid phone'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { phoneNumber, preferences, address } = req.body;
      const uid = req.user._id || req.user.id;

      if (isDBReady()) {
        const updateData = { isProfileComplete: true };
        if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
        if (preferences !== undefined) updateData.preferences = preferences;
        if (address !== undefined) updateData.address = address;
        const user = await User.findByIdAndUpdate(uid, { $set: updateData }, { new: true, runValidators: true });
        return res.json({ success: true, message: 'Profile saved!', user: user.toSafeObject() });
      }

      // In-memory path
      const user = findMemById(uid);
      if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
      user.isProfileComplete = true;
      if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
      if (preferences !== undefined) user.preferences = preferences;
      if (address !== undefined) user.address = address;
      user.updatedAt = new Date().toISOString();
      res.json({ success: true, message: 'Profile saved!', user: toSafeUser(user) });
    } catch (err) {
      console.error('Complete profile error:', err);
      res.status(500).json({ success: false, message: 'Error saving profile.' });
    }
  },
];

// ── Check Email ───────────────────────────────────────────────────────────────
const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email required.' });

    if (isDBReady()) {
      const user = await User.findOne({ email: email.toLowerCase().trim() });
      return res.json({ success: true, exists: !!user, isGoogleUser: user?.isGoogleUser ?? false });
    }
    const user = findMemUser(email);
    res.json({ success: true, exists: !!user, isGoogleUser: user?.isGoogleUser ?? false });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── Update Preferences ────────────────────────────────────────────────────────
const updatePreferences = async (req, res) => {
  try {
    const { preferences } = req.body;
    const uid = req.user._id || req.user.id;

    if (isDBReady()) {
      const user = await User.findByIdAndUpdate(uid, { $set: { preferences } }, { new: true });
      return res.json({ success: true, user: user.toSafeObject() });
    }
    const user = findMemById(uid);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    user.preferences = preferences;
    res.json({ success: true, user: toSafeUser(user) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { register, login, googleAuth, getMe, completeProfile, checkEmail, updatePreferences };


