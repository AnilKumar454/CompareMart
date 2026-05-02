import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Phone, MapPin, Tag, ChevronRight, ChevronLeft,
  CheckCircle, Sparkles, ShoppingCart
} from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: 'electronics',  label: 'Electronics',  emoji: '📱' },
  { id: 'shoes',        label: 'Shoes',         emoji: '👟' },
  { id: 'clothing',     label: 'Clothing',      emoji: '👕' },
  { id: 'home',         label: 'Home & Living', emoji: '🏠' },
  { id: 'sports',       label: 'Sports',        emoji: '⚽' },
  { id: 'books',        label: 'Books',         emoji: '📚' },
  { id: 'beauty',       label: 'Beauty',        emoji: '💄' },
  { id: 'toys',         label: 'Toys',          emoji: '🧸' },
  { id: 'automotive',   label: 'Automotive',    emoji: '🚗' },
  { id: 'grocery',      label: 'Grocery',       emoji: '🛒' },
];

const STEPS = [
  { id: 1, title: 'Phone Number',   subtitle: 'Stay updated with deal alerts' },
  { id: 2, title: 'Interests',      subtitle: 'Pick categories you love to shop' },
  { id: 3, title: 'Address',        subtitle: 'Optional — for better local deals' },
];

export default function CompleteProfilePage() {
  const { user, completeProfile, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [step, setStep]             = useState(1);
  const [isLoading, setIsLoading]   = useState(false);
  const [phone, setPhone]           = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [selectedCats, setSelectedCats] = useState([]);
  const [address, setAddress]       = useState({ street: '', city: '', state: '', zipCode: '', country: 'India' });

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) navigate('/login', { replace: true });
  }, [isAuthenticated, navigate]);

  // Pre-fill existing data
  useEffect(() => {
    if (user) {
      if (user.phoneNumber) setPhone(user.phoneNumber);
      if (user.preferences?.categories?.length) setSelectedCats(user.preferences.categories);
      if (user.address?.city) setAddress({ street: '', city: '', state: '', zipCode: '', country: 'India', ...user.address });
    }
  }, [user]);

  const validatePhone = () => {
    if (phone && !/^[+]?[\d\s\-().]{7,20}$/.test(phone)) {
      setPhoneError('Please enter a valid phone number');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const toggleCategory = (id) => {
    setSelectedCats((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step === 1 && !validatePhone()) return;
    setStep((s) => Math.min(s + 1, 3));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleSkip = () => navigate('/dashboard', { replace: true });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await completeProfile({
        phoneNumber: phone,
        preferences: { categories: selectedCats, notifications: true },
        address,
      });
      toast.success('Profile set up! Welcome to Compare Mart 🎉', { duration: 4000 });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  const setAddr = (field) => (e) => setAddress((a) => ({ ...a, [field]: e.target.value }));

  return (
    <div className="profile-page">
      <div className="profile-card">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: 56, height: 56,
            background: 'var(--gradient-primary)',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
          }}>
            <ShoppingCart size={26} color="#fff" strokeWidth={2} />
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '26px',
            fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px',
          }}>
            Welcome, {user?.firstName}! 👋
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Let's personalize your experience in {4 - step} quick {4 - step === 1 ? 'step' : 'steps'}
          </p>
        </div>

        {/* Progress bar */}
        <div className="profile-progress" style={{ marginBottom: '32px' }}>
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={`progress-step ${s.id === step ? 'active' : s.id < step ? 'completed' : ''}`}
            />
          ))}
        </div>

        {/* Step indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          marginBottom: '28px', padding: '14px 18px',
          background: 'var(--gradient-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '10px',
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {step === 1 ? <Phone size={16} color="#fff" /> : step === 2 ? <Tag size={16} color="#fff" /> : <MapPin size={16} color="#fff" />}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>
              Step {step} of {STEPS.length} — {STEPS[step - 1].title}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{STEPS[step - 1].subtitle}</div>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: '12px', fontWeight: 700, color: 'var(--brand-primary)' }}>
            {Math.round((step / STEPS.length) * 100)}%
          </div>
        </div>

        {/* ── Step 1: Phone ── */}
        {step === 1 && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="profile-phone">Phone Number (optional)</label>
              <div className="form-input-wrapper">
                <Phone size={16} className="input-icon" />
                <input
                  id="profile-phone"
                  type="tel"
                  className={`form-input ${phoneError ? 'error' : ''}`}
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setPhoneError(''); }}
                  autoFocus
                />
              </div>
              {phoneError && <span className="form-error">⚠ {phoneError}</span>}
              <span className="form-hint">We'll send deal alerts via SMS (optional)</span>
            </div>
          </div>
        )}

        {/* ── Step 2: Categories ── */}
        {step === 2 && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Select categories you're interested in
              </p>
              {selectedCats.length > 0 && (
                <span className="badge badge-primary">
                  {selectedCats.length} selected
                </span>
              )}
            </div>
            <div className="categories-grid">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-card ${selectedCats.includes(cat.id) ? 'selected' : ''}`}
                  onClick={() => toggleCategory(cat.id)}
                  id={`cat-${cat.id}`}
                  aria-pressed={selectedCats.includes(cat.id)}
                >
                  {selectedCats.includes(cat.id) && (
                    <CheckCircle
                      size={14}
                      style={{ position: 'absolute', top: 8, right: 8, color: 'var(--brand-primary)' }}
                    />
                  )}
                  <span className="category-icon">{cat.emoji}</span>
                  <span className="category-name">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 3: Address ── */}
        {step === 3 && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Optionally add your address for hyper-local deals and faster checkout.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="addr-street">Street Address</label>
                <input
                  id="addr-street"
                  type="text"
                  className="form-input"
                  placeholder="123 Main Street"
                  value={address.street}
                  onChange={setAddr('street')}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="addr-city">City</label>
                  <input
                    id="addr-city"
                    type="text"
                    className="form-input"
                    placeholder="Mumbai"
                    value={address.city}
                    onChange={setAddr('city')}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="addr-state">State</label>
                  <input
                    id="addr-state"
                    type="text"
                    className="form-input"
                    placeholder="Maharashtra"
                    value={address.state}
                    onChange={setAddr('state')}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="addr-zip">PIN Code</label>
                  <input
                    id="addr-zip"
                    type="text"
                    className="form-input"
                    placeholder="400001"
                    value={address.zipCode}
                    onChange={setAddr('zipCode')}
                    maxLength={10}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="addr-country">Country</label>
                  <input
                    id="addr-country"
                    type="text"
                    className="form-input"
                    value={address.country}
                    onChange={setAddr('country')}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div style={{
          display: 'flex', gap: '12px', marginTop: '32px',
          borderTop: '1px solid var(--border-color)', paddingTop: '24px',
        }}>
          {step > 1 && (
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={handleBack}
              id="profile-back-btn"
              style={{ flex: 1 }}
            >
              <ChevronLeft size={18} /> Back
            </button>
          )}

          <button
            type="button"
            className="btn btn-ghost btn-lg"
            onClick={handleSkip}
            id="profile-skip-btn"
            style={{ flexShrink: 0, padding: '16px 20px' }}
          >
            Skip
          </button>

          {step < 3 ? (
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={handleNext}
              id="profile-next-btn"
              style={{ flex: 2 }}
            >
              Continue <ChevronRight size={18} />
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={handleSubmit}
              disabled={isLoading}
              id="profile-finish-btn"
              style={{ flex: 2 }}
            >
              {isLoading ? (
                <><span className="spinner" /> Saving...</>
              ) : (
                <><Sparkles size={18} /> Finish Setup</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
