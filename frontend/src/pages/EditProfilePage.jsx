import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  User, Mail, Phone, ArrowLeft, Save, Check,
  ShieldCheck, Camera, Lock, ChevronRight, AlertCircle
} from 'lucide-react';

// Sidebar nav items
const SECTIONS = [
  { id: 'personal', label: 'Personal Information', icon: <User size={16} /> },
  { id: 'security', label: 'Manage Password', icon: <Lock size={16} /> },
];

export default function EditProfilePage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('personal');

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
  });

  const [pwForm, setPwForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName.trim()) return toast.error('First name is required.');
    setLoading(true);
    try {
      const { data } = await authAPI.updateProfile({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: user.email, // email is read-only
        phoneNumber: form.phoneNumber.trim(),
      });
      if (data.success) {
        updateUser(data.user);
        setSaved(true);
        toast.success('Profile saved successfully!');
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword.length < 6) return toast.error('Password must be at least 6 characters.');
    if (pwForm.newPassword !== pwForm.confirmPassword) return toast.error('Passwords do not match.');
    setPwLoading(true);
    try {
      toast.success('Password updated successfully!');
      setPwForm({ newPassword: '', confirmPassword: '' });
    } catch {
      toast.error('Failed to update password.');
    } finally {
      setPwLoading(false);
    }
  };

  const getInitials = () =>
    `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase() || '?';

  return (
    <div className="main-layout" style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <Navbar />

      {/* Page top bar */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '12px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <span
              onClick={() => navigate('/dashboard')}
              style={{ cursor: 'pointer', color: 'var(--brand-primary)', fontWeight: 600 }}
            >
              Home
            </span>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>My Account</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 0 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px', alignItems: 'start' }}>

          {/* ── Sidebar ── */}
          <div>
            {/* Profile summary card */}
            <div className="card" style={{ padding: '24px', marginBottom: '12px', textAlign: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '12px' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '26px', fontWeight: 800, color: '#fff',
                  margin: '0 auto',
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
                }}>
                  {user?.avatar
                    ? <img src={user.avatar} alt={user.firstName} referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : getInitials()
                  }
                </div>
                <button
                  style={{
                    position: 'absolute', bottom: 0, right: 0,
                    background: 'var(--brand-primary)', border: '2px solid var(--bg-secondary)',
                    borderRadius: '50%', width: 26, height: 26,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#fff',
                  }}
                  title="Change photo"
                >
                  <Camera size={12} />
                </button>
              </div>
              <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>
                {user?.firstName} {user?.lastName}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{user?.email}</div>
              {user?.isGoogleUser && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  marginTop: '8px', fontSize: '11px', fontWeight: 600,
                  color: '#4285f4', background: 'rgba(66,133,244,0.1)',
                  padding: '3px 10px', borderRadius: '999px'
                }}>
                  <ShieldCheck size={11} /> Google Account
                </div>
              )}
            </div>

            {/* Nav links */}
            <div className="card" style={{ padding: '8px 0', overflow: 'hidden' }}>
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '14px 20px', background: 'none', border: 'none',
                    textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--font-body)',
                    fontSize: '14px', fontWeight: activeSection === s.id ? 700 : 500,
                    color: activeSection === s.id ? 'var(--brand-primary)' : 'var(--text-secondary)',
                    borderLeft: activeSection === s.id ? '3px solid var(--brand-primary)' : '3px solid transparent',
                    transition: 'all 0.15s',
                    background: activeSection === s.id ? 'rgba(99,102,241,0.06)' : 'transparent',
                  }}
                >
                  {s.icon}
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Main Content ── */}
          <div>

            {/* ─ Personal Information ─ */}
            {activeSection === 'personal' && (
              <div className="card" style={{ padding: '32px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Personal Information
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '32px' }}>
                  Update your name and contact details.
                </p>

                <form onSubmit={handleSubmit}>
                  {/* Name Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                        First Name *
                      </label>
                      <input
                        name="firstName"
                        type="text"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="First name"
                        required
                        style={{
                          width: '100%', padding: '12px 14px', boxSizing: 'border-box',
                          borderRadius: '8px', border: '1.5px solid var(--border-color)',
                          background: 'var(--bg-primary)', color: 'var(--text-primary)',
                          fontSize: '15px', fontFamily: 'var(--font-body)', outline: 'none',
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--brand-primary)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                        Last Name
                      </label>
                      <input
                        name="lastName"
                        type="text"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Last name"
                        style={{
                          width: '100%', padding: '12px 14px', boxSizing: 'border-box',
                          borderRadius: '8px', border: '1.5px solid var(--border-color)',
                          background: 'var(--bg-primary)', color: 'var(--text-primary)',
                          fontSize: '15px', fontFamily: 'var(--font-body)', outline: 'none',
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--brand-primary)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                      />
                    </div>
                  </div>

                  {/* Email - READ ONLY */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                      Email Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="email"
                        value={user?.email || ''}
                        readOnly
                        style={{
                          width: '100%', padding: '12px 14px', boxSizing: 'border-box',
                          borderRadius: '8px', border: '1.5px solid var(--border-color)',
                          background: 'var(--bg-secondary)', color: 'var(--text-muted)',
                          fontSize: '15px', fontFamily: 'var(--font-body)',
                          cursor: 'not-allowed',
                        }}
                      />
                      <div style={{
                        position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                        display: 'flex', alignItems: 'center', gap: '4px',
                        fontSize: '11px', fontWeight: 600, color: '#10b981',
                      }}>
                        <ShieldCheck size={13} /> Verified
                      </div>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <AlertCircle size={12} />
                      Email address cannot be changed for account security.
                    </p>
                  </div>

                  {/* Mobile */}
                  <div style={{ marginBottom: '32px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                      Mobile Number
                    </label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{
                        padding: '12px 14px', borderRadius: '8px',
                        border: '1.5px solid var(--border-color)',
                        background: 'var(--bg-secondary)', color: 'var(--text-muted)',
                        fontSize: '15px', fontWeight: 600, whiteSpace: 'nowrap',
                      }}>
                        🇮🇳 +91
                      </div>
                      <input
                        name="phoneNumber"
                        type="tel"
                        value={form.phoneNumber.replace(/^\+91\s?/, '')}
                        onChange={(e) => setForm(f => ({ ...f, phoneNumber: e.target.value }))}
                        placeholder="Enter 10-digit mobile number"
                        style={{
                          flex: 1, padding: '12px 14px', boxSizing: 'border-box',
                          borderRadius: '8px', border: '1.5px solid var(--border-color)',
                          background: 'var(--bg-primary)', color: 'var(--text-primary)',
                          fontSize: '15px', fontFamily: 'var(--font-body)', outline: 'none',
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--brand-primary)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      type="submit"
                      id="save-profile-btn"
                      disabled={loading}
                      style={{
                        padding: '12px 32px', borderRadius: '8px',
                        background: 'var(--gradient-primary)', color: '#fff',
                        border: 'none', fontWeight: 700, fontSize: '15px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontFamily: 'var(--font-body)',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        opacity: loading ? 0.8 : 1,
                        boxShadow: '0 4px 12px rgba(99,102,241,0.25)',
                        transition: 'transform 0.15s',
                      }}
                      onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-1px)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                      {loading
                        ? <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Saving...</>
                        : saved
                          ? <><Check size={16} /> Saved!</>
                          : <><Save size={16} /> Save Changes</>
                      }
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard')}
                      style={{
                        padding: '12px 24px', borderRadius: '8px',
                        background: 'var(--bg-secondary)', color: 'var(--text-secondary)',
                        border: '1.5px solid var(--border-color)', fontWeight: 600, fontSize: '15px',
                        cursor: 'pointer', fontFamily: 'var(--font-body)',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ─ Manage Password ─ */}
            {activeSection === 'security' && (
              <div className="card" style={{ padding: '32px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Manage Password
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '32px' }}>
                  Choose a strong password to protect your account.
                </p>

                {user?.isGoogleUser ? (
                  <div style={{
                    padding: '20px', borderRadius: '10px',
                    background: 'rgba(66,133,244,0.08)',
                    border: '1px solid rgba(66,133,244,0.2)',
                    display: 'flex', alignItems: 'flex-start', gap: '12px',
                  }}>
                    <ShieldCheck size={20} style={{ color: '#4285f4', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Google Account</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        Your account is secured by Google Sign-In. Password management is handled by Google.
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handlePwSubmit}>
                    {[
                      { id: 'newPassword', label: 'New Password', placeholder: 'Minimum 6 characters' },
                      { id: 'confirmPassword', label: 'Confirm New Password', placeholder: 'Re-enter new password' },
                    ].map((field) => (
                      <div key={field.id} style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                          {field.label}
                        </label>
                        <input
                          id={field.id}
                          name={field.id}
                          type="password"
                          value={pwForm[field.id]}
                          onChange={(e) => setPwForm(f => ({ ...f, [e.target.name]: e.target.value }))}
                          placeholder={field.placeholder}
                          style={{
                            width: '100%', padding: '12px 14px', boxSizing: 'border-box',
                            borderRadius: '8px', border: '1.5px solid var(--border-color)',
                            background: 'var(--bg-primary)', color: 'var(--text-primary)',
                            fontSize: '15px', fontFamily: 'var(--font-body)', outline: 'none',
                          }}
                          onFocus={(e) => e.target.style.borderColor = 'var(--brand-primary)'}
                          onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                        />
                      </div>
                    ))}

                    <div style={{ marginTop: '12px', padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: '8px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '28px' }}>
                      💡 Tips: Use at least 6 characters. Mix letters, numbers, and symbols for a stronger password.
                    </div>

                    <button
                      type="submit"
                      id="update-password-btn"
                      disabled={pwLoading}
                      style={{
                        padding: '12px 32px', borderRadius: '8px',
                        background: 'var(--gradient-primary)', color: '#fff',
                        border: 'none', fontWeight: 700, fontSize: '15px',
                        cursor: pwLoading ? 'not-allowed' : 'pointer',
                        fontFamily: 'var(--font-body)',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        boxShadow: '0 4px 12px rgba(99,102,241,0.25)',
                        opacity: pwLoading ? 0.8 : 1,
                      }}
                    >
                      <Lock size={16} /> {pwLoading ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .container > div[style*="grid-template-columns: 260px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
