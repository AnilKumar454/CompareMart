import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { Mail, Lock, Eye, EyeOff, User, ShoppingCart, ArrowRight, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const passwordStrength = (pw) => {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-5
};

const StrengthBar = ({ password }) => {
  const score = passwordStrength(password);
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
  const colors = ['', '#ef4444', '#f59e0b', '#eab308', '#22c55e', '#10b981'];
  if (!password) return null;
  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              flex: 1, height: '3px', borderRadius: '2px',
              background: i <= score ? colors[score] : 'var(--border-color)',
              transition: 'background 0.3s ease',
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: '11px', color: colors[score] || 'var(--text-muted)', fontWeight: 600 }}>
        {labels[score]}
      </span>
    </div>
  );
};

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    else if (!/\d/.test(form.password)) errs.password = 'Must contain at least one number';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await register(form.firstName.trim(), form.lastName.trim(), form.email.trim().toLowerCase(), form.password);
      toast.success('Account created! Let\'s set up your profile 🎉');
      navigate('/complete-profile', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      toast.error(msg);
      if (msg.toLowerCase().includes('email')) {
        setErrors({ email: 'This email is already registered' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    'Track prices across 100+ stores',
    'Get deal alerts on saved products',
    'Personalized recommendations',
    'Free forever — no credit card needed',
  ];

  return (
    <div className="auth-page">
      {/* ── Left Panel ── */}
      <div className="auth-left">
        <div style={{ position: 'relative', zIndex: 1, color: '#fff', maxWidth: '460px' }}>
          <div style={{
            width: 64, height: 64,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '24px',
            border: '1px solid rgba(255,255,255,0.2)',
          }}>
            <ShoppingCart size={30} strokeWidth={1.8} />
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '38px', fontWeight: 800, lineHeight: 1.1, marginBottom: '12px' }}>
            Join Compare Mart
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: '40px' }}>
            Create your free account and start saving on every purchase.
          </p>

          {benefits.map((b, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              marginBottom: '14px',
              animation: `slideInLeft 0.4s ease ${i * 0.1}s both`,
            }}>
              <CheckCircle size={18} style={{ color: '#86efac', flexShrink: 0 }} />
              <span style={{ fontSize: '15px' }}>{b}</span>
            </div>
          ))}

          {/* Stats */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '16px', marginTop: '40px',
          }}>
            {[['2M+', 'Products Tracked'], ['500K+', 'Happy Users'], ['₹50Cr+', 'Saved'], ['99.9%', 'Uptime']].map(([val, label]) => (
              <div key={label} style={{
                padding: '16px',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(8px)',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, marginBottom: '2px' }}>{val}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="auth-right" style={{ padding: '32px 48px' }}>
        <div className="auth-form-container">
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Create account
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <Link to="/login" id="goto-login" style={{ fontWeight: 600 }}>Sign in</Link>
            </p>
          </div>

          <GoogleLoginButton onLoading={setGoogleLoading} />

          <div className="divider">
            <span className="divider-text">or register with email</span>
          </div>

          <form onSubmit={handleSubmit} noValidate id="register-form">
            {/* Name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-firstname">First Name *</label>
                <div className="form-input-wrapper">
                  <User size={16} className="input-icon" />
                  <input
                    id="reg-firstname"
                    type="text"
                    className={`form-input ${errors.firstName ? 'error' : ''}`}
                    placeholder="John"
                    value={form.firstName}
                    onChange={set('firstName')}
                    autoComplete="given-name"
                    autoFocus
                  />
                </div>
                {errors.firstName && <span className="form-error">⚠ {errors.firstName}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-lastname">Last Name</label>
                <div className="form-input-wrapper">
                  <User size={16} className="input-icon" />
                  <input
                    id="reg-lastname"
                    type="text"
                    className="form-input"
                    placeholder="Doe"
                    value={form.lastName}
                    onChange={set('lastName')}
                    autoComplete="family-name"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" htmlFor="reg-email">Email *</label>
              <div className="form-input-wrapper">
                <Mail size={16} className="input-icon" />
                <input
                  id="reg-email"
                  type="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={set('email')}
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="form-error">⚠ {errors.email}</span>}
            </div>

            {/* Password */}
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" htmlFor="reg-password">Password *</label>
              <div className="form-input-wrapper">
                <Lock size={16} className="input-icon" />
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Min. 6 characters with a number"
                  value={form.password}
                  onChange={set('password')}
                  autoComplete="new-password"
                  style={{ paddingRight: '44px' }}
                />
                <button type="button" className="input-action" onClick={() => setShowPassword((s) => !s)} id="toggle-reg-password">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <StrengthBar password={form.password} />
              {errors.password && <span className="form-error">⚠ {errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="form-group" style={{ marginBottom: '22px' }}>
              <label className="form-label" htmlFor="reg-confirm-password">Confirm Password *</label>
              <div className="form-input-wrapper">
                <Lock size={16} className="input-icon" />
                <input
                  id="reg-confirm-password"
                  type={showConfirm ? 'text' : 'password'}
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={set('confirmPassword')}
                  autoComplete="new-password"
                  style={{ paddingRight: '44px' }}
                />
                <button type="button" className="input-action" onClick={() => setShowConfirm((s) => !s)} id="toggle-confirm-password">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <span className="form-error">⚠ {errors.confirmPassword}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={isLoading || googleLoading}
              id="register-submit-btn"
            >
              {isLoading ? (
                <><span className="spinner" /> Creating account...</>
              ) : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p style={{ marginTop: '20px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.7 }}>
            By creating an account you agree to our{' '}
            <a href="#" style={{ color: 'var(--brand-primary)' }}>Terms of Service</a>
            {' '}&amp;{' '}
            <a href="#" style={{ color: 'var(--brand-primary)' }}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
