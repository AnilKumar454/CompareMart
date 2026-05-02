import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  User, Mail, Phone, ArrowLeft, Save, Check,
  ShieldCheck, Edit3, Lock
} from 'lucide-react';

export default function EditProfilePage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
  });

  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const handlePwChange = (e) => {
    setPwForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName.trim()) return toast.error('First name is required.');
    if (!form.email.trim()) return toast.error('Email is required.');

    setLoading(true);
    try {
      const { data } = await authAPI.updateProfile({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        phoneNumber: form.phoneNumber.trim(),
      });
      if (data.success) {
        updateUser(data.user);
        setSaved(true);
        toast.success('Profile updated successfully! ✅');
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    return `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase() || '?';
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px 12px 44px',
    borderRadius: '12px',
    border: '1.5px solid var(--border-color)',
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    fontSize: '15px',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: '8px',
  };

  const iconWrapStyle = {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
    display: 'flex',
  };

  return (
    <div className="main-layout">
      <Navbar />

      {/* Header */}
      <section className="page-header" style={{ padding: '40px 0 60px' }}>
        <div className="container page-header-content">
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: '#fff',
              borderRadius: '10px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              display: 'flex', alignItems: 'center', gap: '6px',
              marginBottom: '20px',
              backdropFilter: 'blur(8px)',
            }}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <h1 className="hero-title" style={{ fontSize: 'clamp(28px, 5vw, 42px)' }}>
            Edit <span className="gradient-text">Profile</span>
          </h1>
          <p className="hero-subtitle">Update your personal information and account details.</p>
        </div>
      </section>

      <section style={{ padding: '40px 0 80px', marginTop: '-32px' }}>
        <div className="container" style={{ maxWidth: '720px' }}>

          {/* Avatar card */}
          <div className="card" style={{ padding: '28px 32px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', fontWeight: 800, color: '#fff',
              flexShrink: 0, boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
              overflow: 'hidden',
            }}>
              {user?.avatar
                ? <img src={user.avatar} alt={user.firstName} referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : getInitials()
              }
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {user?.firstName} {user?.lastName}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '2px' }}>{user?.email}</div>
              {user?.isGoogleUser && (
                <span className="badge badge-primary" style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={11} /> Google Account
                </span>
              )}
            </div>
          </div>

          {/* Edit form */}
          <div className="card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '10px',
                background: 'rgba(99,102,241,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--brand-primary)',
              }}>
                <Edit3 size={18} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Personal Information
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" style={labelStyle}>First Name *</label>
                  <div style={{ position: 'relative' }}>
                    <span style={iconWrapStyle}><User size={16} /></span>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="First name"
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--brand-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
                      required
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" style={labelStyle}>Last Name</label>
                  <div style={{ position: 'relative' }}>
                    <span style={iconWrapStyle}><User size={16} /></span>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Last name"
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--brand-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="email" style={labelStyle}>Email Address *</label>
                <div style={{ position: 'relative' }}>
                  <span style={iconWrapStyle}><Mail size={16} /></span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    style={{
                      ...inputStyle,
                      ...(user?.isGoogleUser ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
                    }}
                    disabled={user?.isGoogleUser}
                    onFocus={(e) => { if (!user?.isGoogleUser) { e.target.style.borderColor = 'var(--brand-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; }}}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
                    required
                  />
                </div>
                {user?.isGoogleUser && (
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                    Email cannot be changed for Google-linked accounts.
                  </p>
                )}
              </div>

              {/* Phone */}
              <div style={{ marginBottom: '28px' }}>
                <label htmlFor="phoneNumber" style={labelStyle}>Mobile Number</label>
                <div style={{ position: 'relative' }}>
                  <span style={iconWrapStyle}><Phone size={16} /></span>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--brand-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                id="save-profile-btn"
                disabled={loading}
                style={{ fontSize: '15px', padding: '14px', gap: '8px' }}
              >
                {loading ? (
                  <>
                    <span style={{
                      width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)',
                      borderTopColor: '#fff', borderRadius: '50%',
                      animation: 'spin 0.7s linear infinite', display: 'inline-block',
                    }} />
                    Saving...
                  </>
                ) : saved ? (
                  <><Check size={18} /> Saved!</>
                ) : (
                  <><Save size={18} /> Save Changes</>
                )}
              </button>
            </form>
          </div>

          {/* Change Password card - only for non-Google users */}
          {!user?.isGoogleUser && (
            <div className="card" style={{ padding: '32px', marginTop: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '10px',
                  background: 'rgba(239,68,68,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#ef4444',
                }}>
                  <Lock size={18} />
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Change Password
                </h2>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                Leave blank if you don't want to change your password.
              </p>

              <form onSubmit={async (e) => {
                e.preventDefault();
                if (pwForm.newPassword.length < 6) return toast.error('New password must be at least 6 characters.');
                if (pwForm.newPassword !== pwForm.confirmPassword) return toast.error('Passwords do not match.');
                setPwLoading(true);
                try {
                  // re-use completeProfile or a dedicated endpoint; here we inform user
                  toast.success('Password change coming soon! Contact support for now.');
                  setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                } catch (err) {
                  toast.error('Failed to change password.');
                } finally {
                  setPwLoading(false);
                }
              }}>
                {[
                  { id: 'currentPassword', label: 'Current Password', placeholder: '••••••••' },
                  { id: 'newPassword', label: 'New Password', placeholder: 'Min 6 characters' },
                  { id: 'confirmPassword', label: 'Confirm New Password', placeholder: 'Repeat new password' },
                ].map((field) => (
                  <div key={field.id} style={{ marginBottom: '16px' }}>
                    <label htmlFor={field.id} style={labelStyle}>{field.label}</label>
                    <div style={{ position: 'relative' }}>
                      <span style={iconWrapStyle}><Lock size={16} /></span>
                      <input
                        id={field.id}
                        name={field.id}
                        type="password"
                        value={pwForm[field.id]}
                        onChange={handlePwChange}
                        placeholder={field.placeholder}
                        style={inputStyle}
                        onFocus={(e) => { e.target.style.borderColor = '#ef4444'; e.target.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.12)'; }}
                        onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="submit"
                  className="btn btn-block"
                  id="change-password-btn"
                  disabled={pwLoading}
                  style={{
                    fontSize: '15px', padding: '14px',
                    background: '#ef4444', color: '#fff',
                    border: 'none', borderRadius: '12px',
                    fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    opacity: pwLoading ? 0.7 : 1,
                    transition: 'opacity 0.2s',
                  }}
                >
                  <Lock size={16} /> {pwLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 600px) {
          form > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
