import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  User, Mail, Phone, Save, Check, ShieldCheck, Camera,
  Lock, ChevronRight, AlertCircle, MapPin, Bell, Heart,
  Package, CreditCard, LogOut, Shield, Settings
} from 'lucide-react';

const SIDEBAR_GROUPS = [
  {
    heading: 'ACCOUNT SETTINGS',
    items: [
      { id: 'profile', label: 'Profile Information', icon: User },
      { id: 'password', label: 'Manage Password', icon: Lock },
      { id: 'addresses', label: 'Manage Addresses', icon: MapPin },
      { id: 'notifications', label: 'Notification Preferences', icon: Bell },
    ],
  },
  {
    heading: 'MY ACTIVITY',
    items: [
      { id: 'wishlist', label: 'My Wishlist', icon: Heart },
      { id: 'orders', label: 'My Orders', icon: Package },
      { id: 'privacy', label: 'Privacy Settings', icon: Shield },
    ],
  },
];

const inp = (extra = {}) => ({
  width: '100%', padding: '11px 14px', boxSizing: 'border-box',
  borderRadius: '6px', border: '1px solid var(--border-color)',
  background: 'var(--bg-primary)', color: 'var(--text-primary)',
  fontSize: '14px', fontFamily: 'var(--font-body)', outline: 'none',
  transition: 'border-color 0.15s',
  ...extra,
});

const lbl = {
  display: 'block', fontSize: '12px', fontWeight: 600,
  color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px',
};

export default function AccountSettingsPage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState('profile');

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    gender: user?.gender || '',
    dob: user?.dob || '',
  });

  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [addr, setAddr] = useState({ name: '', phone: '', pincode: '', street: '', city: '', state: '', type: 'Home' });
  const [notif, setNotif] = useState({
    deals: true, priceAlerts: true, orderUpdates: true, newsletter: false,
  });
  const [privacy, setPrivacy] = useState({ twoFactor: false, loginAlerts: true, dataSharingAds: false });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.firstName.trim()) return toast.error('First name is required.');
    setLoading(true);
    try {
      const { data } = await authAPI.updateProfile({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: user.email,
        phoneNumber: form.phoneNumber.trim(),
      });
      if (data.success) {
        updateUser(data.user);
        setSaved(true);
        toast.success('Profile updated!');
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update.');
    } finally {
      setLoading(false);
    }
  };

  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase() || '?';

  const Btn = ({ children, onClick, disabled, danger, secondary, type = 'button' }) => (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      padding: '10px 28px', borderRadius: '6px', fontWeight: 700, fontSize: '14px',
      cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)',
      border: 'none', display: 'inline-flex', alignItems: 'center', gap: '7px',
      transition: 'all 0.15s', opacity: disabled ? 0.7 : 1,
      background: danger ? '#ef4444' : secondary ? 'var(--bg-secondary)' : 'var(--gradient-primary)',
      color: secondary ? 'var(--text-secondary)' : '#fff',
      boxShadow: !secondary && !danger ? '0 2px 8px rgba(99,102,241,0.25)' : 'none',
      outline: secondary ? '1px solid var(--border-color)' : 'none',
    }}>
      {children}
    </button>
  );

  const SectionCard = ({ title, subtitle, children }) => (
    <div className="card" style={{ padding: '28px 32px' }}>
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', margin: '4px 0 0' }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );

  const Toggle = ({ checked, onChange, label, desc }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border-color)' }}>
      <div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
        {desc && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{desc}</div>}
      </div>
      <button onClick={() => onChange(!checked)} style={{
        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
        background: checked ? 'var(--brand-primary)' : '#cbd5e1', position: 'relative', transition: 'background 0.2s',
      }}>
        <span style={{
          position: 'absolute', top: 3, left: checked ? 23 : 3, width: 18, height: 18,
          borderRadius: '50%', background: '#fff', transition: 'left 0.2s',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        }} />
      </button>
    </div>
  );

  return (
    <div className="main-layout" style={{ background: '#f1f3f6', minHeight: '100vh' }}>
      <Navbar />

      {/* Breadcrumb */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '10px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
          <span onClick={() => navigate('/dashboard')} style={{ color: 'var(--brand-primary)', cursor: 'pointer', fontWeight: 600 }}>Home</span>
          <ChevronRight size={13} />
          <span style={{ color: 'var(--text-primary)' }}>My Account</span>
          <ChevronRight size={13} />
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
            {SIDEBAR_GROUPS.flatMap(g => g.items).find(i => i.id === active)?.label}
          </span>
        </div>
      </div>

      <div className="container" style={{ padding: '24px 0 80px', display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px', alignItems: 'start' }}>

        {/* ── Sidebar ── */}
        <div>
          {/* Avatar card */}
          <div style={{ background: 'var(--bg-secondary)', borderRadius: '4px', border: '1px solid var(--border-color)', padding: '24px', marginBottom: '4px', textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '12px' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%', background: 'var(--gradient-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px', fontWeight: 800, color: '#fff', overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
              }}>
                {user?.avatar
                  ? <img src={user.avatar} alt="" referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : initials}
              </div>
              <div style={{
                position: 'absolute', bottom: 0, right: 0, width: 24, height: 24,
                background: 'var(--brand-primary)', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid var(--bg-secondary)', cursor: 'pointer',
              }}>
                <Camera size={11} color="#fff" />
              </div>
            </div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>{user?.firstName} {user?.lastName}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>{user?.email}</div>
            {user?.isGoogleUser && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '8px', fontSize: '11px', fontWeight: 600, color: '#4285f4', background: 'rgba(66,133,244,0.1)', padding: '3px 10px', borderRadius: '999px' }}>
                <ShieldCheck size={11} /> Google
              </div>
            )}
          </div>

          {/* Nav */}
          {SIDEBAR_GROUPS.map((group) => (
            <div key={group.heading} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', marginBottom: '4px', overflow: 'hidden' }}>
              <div style={{ padding: '12px 20px 6px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.8px' }}>{group.heading}</div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <button key={item.id} onClick={() => setActive(item.id)} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 20px', background: isActive ? 'rgba(99,102,241,0.08)' : 'transparent',
                    border: 'none', borderLeft: isActive ? '3px solid var(--brand-primary)' : '3px solid transparent',
                    cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '13.5px',
                    fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                    textAlign: 'left', transition: 'all 0.15s',
                  }}>
                    <Icon size={15} /> {item.label}
                  </button>
                );
              })}
            </div>
          ))}

          {/* Logout */}
          <button
            onClick={() => { logout(); navigate('/login', { replace: true }); toast.success('Logged out!'); }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 20px', background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)', borderRadius: '4px',
              cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '13.5px',
              fontWeight: 600, color: '#ef4444', textAlign: 'left',
            }}
          >
            <LogOut size={15} /> Logout
          </button>
        </div>

        {/* ── Main Panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* PROFILE */}
          {active === 'profile' && (
            <SectionCard title="Personal Information" subtitle="Update your name, gender and date of birth.">
              <form onSubmit={handleSave}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '18px' }}>
                  <div>
                    <label style={lbl}>First Name *</label>
                    <input style={inp()} name="firstName" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                      onFocus={e => e.target.style.borderColor = 'var(--brand-primary)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                      placeholder="First name" required />
                  </div>
                  <div>
                    <label style={lbl}>Last Name</label>
                    <input style={inp()} name="lastName" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                      onFocus={e => e.target.style.borderColor = 'var(--brand-primary)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                      placeholder="Last name" />
                  </div>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={lbl}>Gender</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {['Male', 'Female', 'Other'].map(g => (
                      <label key={g} style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>
                        <input type="radio" name="gender" value={g} checked={form.gender === g} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
                          style={{ accentColor: 'var(--brand-primary)' }} />
                        {g}
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={lbl}>Date of Birth</label>
                  <input type="date" style={inp({ maxWidth: 220 })} value={form.dob}
                    onChange={e => setForm(f => ({ ...f, dob: e.target.value }))}
                    onFocus={e => e.target.style.borderColor = 'var(--brand-primary)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={lbl}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <input type="email" value={user?.email || ''} readOnly style={inp({ background: 'var(--bg-secondary)', cursor: 'not-allowed', color: 'var(--text-muted)', paddingRight: 90 })} />
                    <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#10b981' }}>
                      <ShieldCheck size={12} /> Verified
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <AlertCircle size={11} /> Email cannot be changed for security.
                  </p>
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <label style={lbl}>Mobile Number</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ ...inp(), width: 'auto', padding: '11px 14px', background: 'var(--bg-secondary)', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap', cursor: 'default' }}>🇮🇳 +91</div>
                    <input type="tel" value={form.phoneNumber.replace(/^\+91\s?/, '')}
                      onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))}
                      style={inp({ flex: 1 })} placeholder="10-digit mobile number"
                      onFocus={e => e.target.style.borderColor = 'var(--brand-primary)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <Btn type="submit" disabled={loading}>
                    {loading ? '...' : saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
                  </Btn>
                  <Btn secondary onClick={() => navigate('/dashboard')}>Cancel</Btn>
                </div>
              </form>
            </SectionCard>
          )}

          {/* PASSWORD */}
          {active === 'password' && (
            <SectionCard title="Manage Password" subtitle="Choose a strong password to keep your account secure.">
              {user?.isGoogleUser ? (
                <div style={{ padding: 20, borderRadius: 8, background: 'rgba(66,133,244,0.07)', border: '1px solid rgba(66,133,244,0.2)', display: 'flex', gap: 14 }}>
                  <ShieldCheck size={20} style={{ color: '#4285f4', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>Google Account</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Password is managed by Google. Sign in with your Google account.</div>
                  </div>
                </div>
              ) : (
                <form onSubmit={e => {
                  e.preventDefault();
                  if (pwForm.newPw.length < 6) return toast.error('Min 6 characters.');
                  if (pwForm.newPw !== pwForm.confirm) return toast.error('Passwords do not match.');
                  toast.success('Password updated!');
                  setPwForm({ current: '', newPw: '', confirm: '' });
                }}>
                  {[
                    { key: 'current', label: 'Current Password', ph: '••••••••' },
                    { key: 'newPw', label: 'New Password', ph: 'Min 6 characters' },
                    { key: 'confirm', label: 'Confirm New Password', ph: 'Repeat new password' },
                  ].map(f => (
                    <div key={f.key} style={{ marginBottom: 18 }}>
                      <label style={lbl}>{f.label}</label>
                      <input type="password" value={pwForm[f.key]} placeholder={f.ph} style={inp()}
                        onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                        onFocus={e => e.target.style.borderColor = 'var(--brand-primary)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                    </div>
                  ))}
                  <div style={{ padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 6, fontSize: 12, color: 'var(--text-muted)', marginBottom: 24 }}>
                    💡 Use 8+ characters with letters, numbers & symbols for a strong password.
                  </div>
                  <Btn type="submit"><Lock size={14} /> Update Password</Btn>
                </form>
              )}
            </SectionCard>
          )}

          {/* ADDRESSES */}
          {active === 'addresses' && (
            <SectionCard title="Manage Addresses" subtitle="Add or edit delivery addresses.">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
                {['name', 'phone', 'pincode', 'city', 'state'].map(field => (
                  <div key={field}>
                    <label style={lbl}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    <input style={inp()} value={addr[field]} placeholder={field}
                      onChange={e => setAddr(a => ({ ...a, [field]: e.target.value }))}
                      onFocus={e => e.target.style.borderColor = 'var(--brand-primary)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={lbl}>Street / Locality</label>
                <textarea value={addr.street} onChange={e => setAddr(a => ({ ...a, street: e.target.value }))}
                  placeholder="House No., Street, Area, Locality"
                  style={{ ...inp(), minHeight: 70, resize: 'vertical' }} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={lbl}>Address Type</label>
                <div style={{ display: 'flex', gap: 12 }}>
                  {['Home', 'Work', 'Other'].map(t => (
                    <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
                      <input type="radio" name="addrType" checked={addr.type === t} onChange={() => setAddr(a => ({ ...a, type: t }))} style={{ accentColor: 'var(--brand-primary)' }} />
                      {t}
                    </label>
                  ))}
                </div>
              </div>
              <Btn onClick={() => toast.success('Address saved!')}><MapPin size={14} /> Save Address</Btn>
            </SectionCard>
          )}

          {/* NOTIFICATIONS */}
          {active === 'notifications' && (
            <SectionCard title="Notification Preferences" subtitle="Choose what updates you want to receive.">
              <Toggle checked={notif.priceAlerts} onChange={v => setNotif(n => ({ ...n, priceAlerts: v }))}
                label="Price Drop Alerts" desc="Get notified when a product's price drops." />
              <Toggle checked={notif.deals} onChange={v => setNotif(n => ({ ...n, deals: v }))}
                label="Daily Deal Alerts" desc="Receive the best deals and offers every day." />
              <Toggle checked={notif.orderUpdates} onChange={v => setNotif(n => ({ ...n, orderUpdates: v }))}
                label="Order & Compare Updates" desc="Updates about your activity on Compare Mart." />
              <Toggle checked={notif.newsletter} onChange={v => setNotif(n => ({ ...n, newsletter: v }))}
                label="Newsletter & Promotions" desc="Weekly newsletter with curated deals." />
              <div style={{ marginTop: 24 }}>
                <Btn onClick={() => toast.success('Preferences saved!')}><Bell size={14} /> Save Preferences</Btn>
              </div>
            </SectionCard>
          )}

          {/* WISHLIST */}
          {active === 'wishlist' && (
            <SectionCard title="My Wishlist" subtitle="Products you've saved for later.">
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                <Heart size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
                <p style={{ fontSize: 16, fontWeight: 600 }}>Your wishlist is empty</p>
                <p style={{ fontSize: 13, marginTop: 6 }}>Save products by clicking the heart icon on any product card.</p>
                <button onClick={() => navigate('/dashboard')} style={{ marginTop: 20, padding: '10px 24px', borderRadius: 6, background: 'var(--gradient-primary)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
                  Browse Deals
                </button>
              </div>
            </SectionCard>
          )}

          {/* ORDERS */}
          {active === 'orders' && (
            <SectionCard title="My Orders" subtitle="Track your recent comparisons and saved carts.">
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                <Package size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
                <p style={{ fontSize: 16, fontWeight: 600 }}>No orders yet</p>
                <p style={{ fontSize: 13, marginTop: 6 }}>Your comparison history will appear here.</p>
                <button onClick={() => navigate('/dashboard')} style={{ marginTop: 20, padding: '10px 24px', borderRadius: 6, background: 'var(--gradient-primary)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
                  Start Comparing
                </button>
              </div>
            </SectionCard>
          )}

          {/* PRIVACY */}
          {active === 'privacy' && (
            <SectionCard title="Privacy Settings" subtitle="Control your data and account security.">
              <Toggle checked={privacy.twoFactor} onChange={v => setPrivacy(p => ({ ...p, twoFactor: v }))}
                label="Two-Factor Authentication" desc="Add an extra layer of security to your account." />
              <Toggle checked={privacy.loginAlerts} onChange={v => setPrivacy(p => ({ ...p, loginAlerts: v }))}
                label="Login Activity Alerts" desc="Get notified of new sign-ins to your account." />
              <Toggle checked={privacy.dataSharingAds} onChange={v => setPrivacy(p => ({ ...p, dataSharingAds: v }))}
                label="Personalised Ads" desc="Allow us to use your activity to personalise ads." />
              <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
                <Btn onClick={() => toast.success('Privacy settings saved!')}><Shield size={14} /> Save Settings</Btn>
              </div>
              <div style={{ marginTop: 28, padding: '16px 20px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8 }}>
                <div style={{ fontWeight: 700, color: '#ef4444', marginBottom: 4 }}>Danger Zone</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
                  Permanently delete your account and all data. This cannot be undone.
                </div>
                <Btn danger onClick={() => toast.error('Please contact support to delete your account.')}>Delete My Account</Btn>
              </div>
            </SectionCard>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .container[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
