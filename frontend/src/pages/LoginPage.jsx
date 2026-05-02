import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { Mail, Lock, Eye, EyeOff, ShoppingCart, ArrowRight, Star, TrendingUp, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const { user } = await login(email.trim().toLowerCase(), password);
      toast.success(`Welcome back, ${user.firstName}! 👋`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      toast.error(msg);
      if (msg.toLowerCase().includes('password')) {
        setErrors({ password: 'Incorrect password' });
      } else if (msg.toLowerCase().includes('email') || msg.toLowerCase().includes('account')) {
        setErrors({ email: 'No account found with this email' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ── Left Panel ── */}
      <div className="auth-left">
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: '#fff', maxWidth: '480px' }}>
          {/* Logo */}
          <div style={{
            width: 72, height: 72,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px',
            border: '1px solid rgba(255,255,255,0.2)',
          }}>
            <ShoppingCart size={36} strokeWidth={1.8} />
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '42px', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px' }}>
            Compare Mart
          </h1>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: '48px' }}>
            The smartest way to compare products and find the best deals — all in one place.
          </p>

          {/* Feature pills */}
          {[
            { icon: <TrendingUp size={16} />, text: 'Real-time price tracking' },
            { icon: <Star size={16} />, text: 'Personalized recommendations' },
            { icon: <Shield size={16} />, text: 'Secure & privacy-first' },
          ].map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '14px 20px',
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(8px)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.12)',
              marginBottom: '12px',
              textAlign: 'left',
              animation: `slideInLeft 0.4s ease ${i * 0.1}s both`,
            }}>
              <div style={{ color: '#a5b4fc' }}>{f.icon}</div>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="auth-right">
        <div className="auth-form-container">
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '30px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Welcome back
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
              Don't have an account?{' '}
              <Link to="/register" id="goto-register" style={{ fontWeight: 600 }}>
                Sign up free
              </Link>
            </p>
          </div>

          {/* Google Login */}
          <GoogleLoginButton onLoading={setGoogleLoading} />

          {/* Divider */}
          <div className="divider">
            <span className="divider-text">or continue with email</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate id="login-form">
            {/* Email */}
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" htmlFor="login-email">Email</label>
              <div className="form-input-wrapper">
                <Mail size={17} className="input-icon" />
                <input
                  id="login-email"
                  type="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
                  autoComplete="email"
                  autoFocus
                />
              </div>
              {errors.email && <span className="form-error">⚠ {errors.email}</span>}
            </div>

            {/* Password */}
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="login-password">Password</label>
                <a href="#" id="forgot-password" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Forgot password?
                </a>
              </div>
              <div className="form-input-wrapper">
                <Lock size={17} className="input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })); }}
                  autoComplete="current-password"
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  className="input-action"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  id="toggle-password-visibility"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && <span className="form-error">⚠ {errors.password}</span>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={isLoading || googleLoading}
              id="login-submit-btn"
            >
              {isLoading ? (
                <><span className="spinner" /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          {/* Footer */}
          <p style={{ marginTop: '28px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.7 }}>
            By signing in, you agree to our{' '}
            <a href="#" style={{ color: 'var(--brand-primary)' }}>Terms of Service</a>
            {' '}and{' '}
            <a href="#" style={{ color: 'var(--brand-primary)' }}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
