import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingCart, Sun, Moon, Monitor, LogOut,
  User, Settings, ChevronDown, BarChart2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, isAuthenticated, logout, toggleTheme } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
    setMenuOpen(false);
  };

  const theme = user?.preferences?.theme || 'auto';
  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;

  const getInitials = () => {
    if (!user) return '?';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || user.email?.[0]?.toUpperCase() || '?';
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      {/* Brand */}
      <Link to="/dashboard" className="navbar-brand" id="nav-brand">
        <ShoppingCart size={22} strokeWidth={2.5} />
        Compare Mart
      </Link>

      <div className="navbar-nav">
        {/* Theme toggle */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={toggleTheme}
          aria-label={`Switch theme (current: ${theme})`}
          id="theme-toggle-btn"
          style={{ padding: '8px', borderRadius: '10px', marginRight: '8px' }}
          title={`Theme: ${theme}`}
        >
          <ThemeIcon size={16} />
        </button>

        {isAuthenticated && user ? (
          <div className="user-menu-wrapper" ref={menuRef}>
            <button
              className="user-avatar-btn"
              onClick={() => setMenuOpen((o) => !o)}
              id="user-menu-btn"
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              <div className="user-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.firstName} referrerPolicy="no-referrer" />
                ) : (
                  getInitials()
                )}
              </div>
              <span className="user-name">Hi, {user.firstName}</span>
              <ChevronDown
                size={14}
                style={{
                  color: 'var(--text-muted)',
                  transform: menuOpen ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>

            {menuOpen && (
              <div className="dropdown-menu" role="menu">
                <div className="dropdown-header">
                  <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>
                    {user.firstName} {user.lastName}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {user.email}
                  </div>
                  {user.isGoogleUser && (
                    <span className="badge badge-primary" style={{ marginTop: '6px' }}>
                      Google Account
                    </span>
                  )}
                </div>

                <Link
                  to="/dashboard"
                  className="dropdown-item"
                  role="menuitem"
                  id="nav-dashboard"
                  onClick={() => setMenuOpen(false)}
                >
                  <BarChart2 size={15} /> Dashboard
                </Link>
                <Link
                  to="/complete-profile"
                  className="dropdown-item"
                  role="menuitem"
                  id="nav-profile"
                  onClick={() => setMenuOpen(false)}
                >
                  <User size={15} /> Edit Profile
                </Link>
                <Link
                  to="/complete-profile"
                  className="dropdown-item"
                  role="menuitem"
                  id="nav-settings"
                  onClick={() => setMenuOpen(false)}
                >
                  <Settings size={15} /> Preferences
                </Link>

                <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '4px' }}>
                  <button
                    className="dropdown-item danger"
                    role="menuitem"
                    id="nav-logout"
                    onClick={handleLogout}
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary btn-sm" id="nav-login">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm" id="nav-register" style={{ marginLeft: '8px' }}>
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
