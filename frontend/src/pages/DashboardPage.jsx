import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
  TrendingUp, Search, Bell, Zap, Star, ArrowRight,
  ShoppingBag, Percent, Gift, BarChart2, Heart,
  ChevronRight, Flame, Clock
} from 'lucide-react';

const CATEGORIES = [
  { id: 'electronics',  label: 'Electronics',  emoji: '📱', deals: 234 },
  { id: 'shoes',        label: 'Shoes',         emoji: '👟', deals: 189 },
  { id: 'clothing',     label: 'Clothing',      emoji: '👕', deals: 312 },
  { id: 'home',         label: 'Home & Living', emoji: '🏠', deals: 145 },
  { id: 'sports',       label: 'Sports',        emoji: '⚽', deals: 98  },
  { id: 'books',        label: 'Books',         emoji: '📚', deals: 567 },
  { id: 'beauty',       label: 'Beauty',        emoji: '💄', deals: 203 },
  { id: 'toys',         label: 'Toys',          emoji: '🧸', deals: 76  },
  { id: 'automotive',   label: 'Automotive',    emoji: '🚗', deals: 54  },
  { id: 'grocery',      label: 'Grocery',       emoji: '🛒', deals: 421 },
];

import { PRODUCTS_DATA, getStoreList, getLowestPrice, getHighestPrice, getDiscount } from '../data/products';

const FEATURED_DEALS = PRODUCTS_DATA.map(p => ({
  id: p.id,
  name: p.name,
  category: p.category,
  originalPrice: getHighestPrice(p),
  salePrice: getLowestPrice(p),
  discount: getDiscount(p),
  rating: p.rating,
  reviews: p.reviews,
  image: p.image,
  badge: p.badge,
  stores: getStoreList(p)
}));

const STATS = [
  { icon: <ShoppingBag size={20} />, value: '2M+',   label: 'Products Tracked',   color: '#6366f1' },
  { icon: <Percent size={20} />,     value: '₹50Cr+', label: 'Saved by Users',     color: '#ec4899' },
  { icon: <Bell size={20} />,        value: '500K+',  label: 'Deal Alerts Sent',   color: '#06b6d4' },
  { icon: <Star size={20} />,        value: '4.9★',  label: 'Average Rating',     color: '#f59e0b' },
];

import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

function DealCard({ deal }) {
  const { user, updateUser } = useAuth();
  const wishlist = user?.preferences?.wishlist || [];
  const saved = wishlist.includes(deal.id);
  const savings = deal.originalPrice - deal.salePrice;

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to save deals');
      return;
    }
    
    const newWishlist = saved 
      ? wishlist.filter(id => id !== deal.id)
      : [...wishlist, deal.id];
      
    const newPreferences = { ...user.preferences, wishlist: newWishlist };
    // Optimistic update
    updateUser({ ...user, preferences: newPreferences });
    
    try {
      await authAPI.updatePreferences(newPreferences);
      toast.success(saved ? 'Removed from wishlist' : 'Added to wishlist');
    } catch (error) {
      // Revert on error
      updateUser({ ...user, preferences: { ...user.preferences, wishlist } });
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <div
      className="card"
      id={`deal-card-${deal.id}`}
      style={{ cursor: 'pointer', position: 'relative' }}
      onClick={(e) => {
        window.location.href = `/compare/${deal.id}`;
      }}
    >
      {/* Badge */}
      <div style={{
        position: 'absolute', top: 14, left: 14,
        background: 'var(--gradient-primary)',
        color: '#fff', padding: '3px 10px',
        borderRadius: '999px', fontSize: '11px', fontWeight: 700,
        zIndex: 1,
      }}>
        {deal.badge}
      </div>

      {/* Wishlist button */}
      <button
        style={{
          position: 'absolute', top: 12, right: 12,
          background: saved ? 'rgba(239,68,68,0.1)' : 'var(--bg-secondary)',
          border: `1.5px solid ${saved ? '#ef4444' : 'var(--border-color)'}`,
          borderRadius: '50%', width: 34, height: 34,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.2s ease',
          zIndex: 1,
        }}
        onClick={handleToggleWishlist}
        aria-label="Save to wishlist"
        id={`wishlist-${deal.id}`}
      >
        <Heart size={15} fill={saved ? '#ef4444' : 'none'} color={saved ? '#ef4444' : 'var(--text-muted)'} />
      </button>

      {/* Image */}
      <div style={{
        height: '180px', width: '100%',
        padding: '24px',
        background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <img 
          src={deal.image} 
          alt={deal.name}
          style={{ 
            maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', 
            mixBlendMode: 'multiply', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
      </div>

      <div style={{ padding: '16px 20px 20px' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
          {deal.category}
        </div>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px', lineHeight: 1.3 }}>
          {deal.name}
        </h3>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', gap: '2px' }}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i} size={12}
                fill={i < Math.floor(deal.rating) ? '#f59e0b' : 'none'}
                color={i < Math.floor(deal.rating) ? '#f59e0b' : 'var(--border-color)'}
              />
            ))}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {deal.rating} ({deal.reviews.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800,
            color: 'var(--text-primary)',
          }}>
            ₹{deal.salePrice.toLocaleString('en-IN')}
          </span>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
            ₹{deal.originalPrice.toLocaleString('en-IN')}
          </span>
          <span style={{
            background: 'rgba(34,197,94,0.12)', color: '#16a34a',
            fontSize: '12px', fontWeight: 700,
            padding: '2px 8px', borderRadius: '6px',
          }}>
            -{deal.discount}%
          </span>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--color-success)', fontWeight: 600, marginBottom: '14px' }}>
          You save ₹{savings.toLocaleString('en-IN')}
        </p>

        {/* Stores */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {deal.stores.map((s) => (
            <span key={s} style={{
              fontSize: '11px', padding: '3px 9px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '999px', color: 'var(--text-muted)', fontWeight: 500,
            }}>
              {s}
            </span>
          ))}
        </div>

        <button
          className="btn btn-primary btn-block"
          id={`compare-btn-${deal.id}`}
          style={{ fontSize: '14px' }}
          onClick={(e) => {
            e.stopPropagation();
            window.location.href = `/compare/${deal.id}`;
          }}
        >
          Compare Prices <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery]   = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter products for suggestions based on search query
  const searchSuggestions = PRODUCTS_DATA.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const userCategories = user?.preferences?.categories || [];
  const hasPreferences = userCategories.length > 0;

  const preferredCats = hasPreferences
    ? CATEGORIES.filter((c) => userCategories.includes(c.id))
    : CATEGORIES.slice(0, 6);

  const filteredDeals = FEATURED_DEALS.filter((d) => {
    const matchesFilter = activeFilter === 'all' || d.category.toLowerCase() === activeFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q || 
      d.name.toLowerCase().includes(q) || 
      d.category.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      // The grid is already filtered by searchQuery, so we can just blur the input
      document.getElementById('dashboard-search')?.blur();
    }
  };

  return (
    <div className="main-layout">
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="page-header">
        <div className="container page-header-content">
          <p className="greeting-text">
            {new Date().getHours() < 12 ? '☀️ Good Morning' : new Date().getHours() < 17 ? '👋 Good Afternoon' : '🌙 Good Evening'}
          </p>
          <h1 className="hero-title">
            Hi, <span className="gradient-text">{user?.firstName}</span>! <br />
            Find the Best Deals
          </h1>
          <p className="hero-subtitle">
            Compare prices across 100+ stores and save big on every purchase.
          </p>

          {/* Search bar */}
          <div style={{ maxWidth: '580px', margin: '0 auto', position: 'relative' }}>
            <form onSubmit={handleSearch}>
              <div style={{
                display: 'flex', gap: '0',
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(16px)',
                border: '1.5px solid rgba(255,255,255,0.2)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px' }}>
                  <Search size={20} color="rgba(255,255,255,0.6)" />
                </div>
                <input
                  id="dashboard-search"
                  type="text"
                  placeholder="Search products, brands, categories (e.g. Mobile, Shoes)..."
                  value={searchQuery}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1, padding: '16px 0',
                    background: 'transparent',
                    border: 'none', outline: 'none',
                    color: '#fff', fontSize: '15px',
                    fontFamily: 'var(--font-body)',
                  }}
                />
                <button
                  type="submit"
                  id="search-submit-btn"
                  style={{
                    padding: '0 24px',
                    background: 'var(--gradient-primary)',
                    border: 'none', color: '#fff',
                    fontSize: '14px', fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    fontFamily: 'var(--font-body)',
                    transition: 'opacity 0.2s',
                  }}
                >
                  <Zap size={16} /> Search
                </button>
              </div>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && searchQuery.length >= 1 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0,
                marginTop: '8px', background: '#fff', borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)', overflow: 'hidden',
                zIndex: 100, textAlign: 'left', border: '1px solid var(--border-color)'
              }}>
                {searchSuggestions.length > 0 ? (
                  searchSuggestions.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => navigate(`/compare/${item.id}`)}
                      style={{
                        padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px',
                        cursor: 'pointer', borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                    >
                      <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <img src={item.image} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>{item.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>in {item.category}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '16px', color: '#64748b', fontSize: '14px', textAlign: 'center' }}>
                    No products found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile completion nudge */}
          {user && !user.isProfileComplete && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              marginTop: '24px', padding: '12px 20px',
              background: 'rgba(245,158,11,0.15)',
              border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: '12px',
              color: '#fcd34d', fontSize: '13px', fontWeight: 500,
            }}>
              <Bell size={15} />
              Complete your profile to unlock personalized recommendations
              <button
                onClick={() => navigate('/complete-profile')}
                id="nudge-complete-profile"
                style={{
                  background: '#f59e0b', color: '#fff',
                  border: 'none', borderRadius: '8px',
                  padding: '4px 12px', fontSize: '12px',
                  fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                }}
              >
                Set Up →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ padding: '40px 0 20px', background: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {STATS.map((stat, i) => (
              <div
                key={i}
                className="card"
                style={{
                  padding: '20px 24px',
                  display: 'flex', alignItems: 'center', gap: '16px',
                  animation: `fadeIn 0.4s ease ${i * 0.08}s both`,
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: '12px',
                  background: `${stat.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: stat.color, flexShrink: 0,
                }}>
                  {stat.icon}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="categories-section">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h2 className="section-title">
                {hasPreferences ? '⭐ Your Favourite Categories' : '🔥 Popular Categories'}
              </h2>
              <p className="section-subtitle">
                {hasPreferences
                  ? `Based on your ${userCategories.length} saved preferences`
                  : 'Explore deals across all categories'}
              </p>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              id="view-all-categories-btn"
              onClick={() => navigate('/complete-profile')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {hasPreferences ? 'Edit' : 'Customize'} <ChevronRight size={14} />
            </button>
          </div>

          <div className="categories-grid">
            {preferredCats.map((cat, i) => (
              <button
                key={cat.id}
                type="button"
                className="category-card"
                id={`dashboard-cat-${cat.id}`}
                style={{ animation: `fadeIn 0.4s ease ${i * 0.05}s both`, border: 'none', cursor: 'pointer' }}
              >
                <span className="category-icon">{cat.emoji}</span>
                <span className="category-name">{cat.label}</span>
                <span style={{ fontSize: '11px', color: 'var(--brand-primary)', fontWeight: 600, marginTop: '2px' }}>
                  {cat.deals} deals
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Deals ── */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Flame size={26} style={{ color: '#f97316' }} /> Today's Hot Deals
              </h2>
              <p className="section-subtitle">Prices updated every 15 minutes from top stores</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Clock size={13} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Updated 3 mins ago</span>
            </div>
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {['all', 'electronics', 'shoes', 'clothing', 'home', 'beauty'].map((f) => (
              <button
                key={f}
                className={`btn btn-sm ${activeFilter === f ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveFilter(f)}
                id={`filter-${f}`}
                style={{ textTransform: 'capitalize' }}
              >
                {f === 'all' ? '✨ All Deals' : f}
              </button>
            ))}
          </div>

          {/* Deals grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {filteredDeals.length > 0 ? (
              filteredDeals.map((deal, i) => (
                <div key={deal.id} style={{ animation: `fadeIn 0.4s ease ${i * 0.08}s both` }}>
                  <DealCard deal={deal} />
                </div>
              ))
            ) : (
              <div style={{
                gridColumn: '1 / -1', textAlign: 'center',
                padding: '60px 24px',
                color: 'var(--text-muted)',
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
                <p style={{ fontSize: '16px' }}>No deals found in this category right now.</p>
              </div>
            )}
          </div>

          {/* CTA banner */}
          <div style={{
            marginTop: '48px', padding: '40px 48px',
            background: 'var(--gradient-primary)',
            borderRadius: '24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '20px',
            boxShadow: '0 20px 60px rgba(99,102,241,0.35)',
          }}>
            <div style={{ color: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Gift size={22} />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800 }}>
                  Never miss a deal again!
                </span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', maxWidth: '400px' }}>
                Set up price drop alerts and we'll notify you the moment your favourite products go on sale.
              </p>
            </div>
            <button
              className="btn btn-lg"
              id="setup-alerts-btn"
              style={{
                background: '#fff', color: 'var(--brand-primary)',
                fontWeight: 700, boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
              }}
              onClick={() => navigate('/complete-profile')}
            >
              <Bell size={18} /> Set Up Alerts
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        padding: '32px 0',
        textAlign: 'center',
      }}>
        <div className="container">
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '10px', marginBottom: '12px',
          }}>
            <ShoppingBag size={18} style={{ color: 'var(--brand-primary)' }} />
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800,
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Compare Mart
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Compare Mart. Built with ❤️ for smart shoppers.
          </p>
        </div>
      </footer>
    </div>
  );
}
