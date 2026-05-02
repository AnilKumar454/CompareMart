import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

// Persist helpers
const TOKEN_KEY = 'cm_token';
const USER_KEY = 'cm_user';

const saveSession = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

const loadSession = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const userRaw = localStorage.getItem(USER_KEY);
  if (!token || !userRaw) return { token: null, user: null };
  try {
    return { token, user: JSON.parse(userRaw) };
  } catch {
    clearSession();
    return { token: null, user: null };
  }
};

// ── Theme helper ──────────────────────────────────────────
const applyTheme = (theme) => {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else if (theme === 'light') {
    root.removeAttribute('data-theme');
  } else {
    // auto - respect system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    prefersDark ? root.setAttribute('data-theme', 'dark') : root.removeAttribute('data-theme');
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Apply theme whenever user changes
  useEffect(() => {
    const theme = user?.preferences?.theme || 'auto';
    applyTheme(theme);

    // Listen for system theme changes when auto
    if (!theme || theme === 'auto') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e) => applyTheme('auto');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [user]);

  // Initialize auth from localStorage
  useEffect(() => {
    const { token, user: storedUser } = loadSession();
    if (token && storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
      // Refresh user from server in background
      authAPI.getMe()
        .then(({ data }) => {
          if (data.success) {
            setUser(data.user);
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
          }
        })
        .catch(() => {
          clearSession();
          setUser(null);
          setIsAuthenticated(false);
        });
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    if (data.success) {
      saveSession(data.token, data.user);
      setUser(data.user);
      setIsAuthenticated(true);
      return { user: data.user, isNewUser: false };
    }
    throw new Error(data.message);
  }, []);

  const register = useCallback(async (firstName, lastName, email, password) => {
    const { data } = await authAPI.register({ firstName, lastName, email, password });
    if (data.success) {
      saveSession(data.token, data.user);
      setUser(data.user);
      setIsAuthenticated(true);
      return { user: data.user, isNewUser: true };
    }
    throw new Error(data.message);
  }, []);

  const googleLogin = useCallback(async (credential) => {
    const { data } = await authAPI.googleAuth(credential);
    if (data.success) {
      saveSession(data.token, data.user);
      setUser(data.user);
      setIsAuthenticated(true);
      return { user: data.user, isNewUser: data.isNewUser };
    }
    throw new Error(data.message);
  }, []);

  const completeProfile = useCallback(async (profileData) => {
    const { data } = await authAPI.completeProfile(profileData);
    if (data.success) {
      setUser(data.user);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return data.user;
    }
    throw new Error(data.message);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const toggleTheme = useCallback(() => {
    const currentTheme = user?.preferences?.theme || 'auto';
    const themes = ['light', 'dark', 'auto'];
    const nextTheme = themes[(themes.indexOf(currentTheme) + 1) % themes.length];
    if (user) {
      const updatedUser = { ...user, preferences: { ...user.preferences, theme: nextTheme } };
      updateUser(updatedUser);
      // Persist to backend in background
      authAPI.updatePreferences({ ...user.preferences, theme: nextTheme }).catch(console.warn);
    } else {
      applyTheme(nextTheme);
      localStorage.setItem('cm_theme', nextTheme);
    }
  }, [user, updateUser]);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    googleLogin,
    completeProfile,
    updateUser,
    logout,
    toggleTheme,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
