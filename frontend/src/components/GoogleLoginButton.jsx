import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleLoginButton({ onLoading }) {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();
  const btnRef = useRef(null);

  useEffect(() => {
    if (!window.google || !GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') return;

    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredential,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.renderButton(btnRef.current, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        shape: 'rectangular',
        text: 'continue_with',
        logo_alignment: 'left',
        width: 380,
      });
    } catch (e) {
      console.warn('Google sign-in init failed:', e);
    }
  }, []);

  const handleCredential = async (response) => {
    if (!response.credential) return;
    onLoading?.(true);
    try {
      const { isNewUser } = await googleLogin(response.credential);
      toast.success(isNewUser ? 'Welcome to Compare Mart! 🎉' : 'Welcome back!');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Google sign-in failed';
      toast.error(msg);
    } finally {
      onLoading?.(false);
    }
  };

  // Fallback button if Google SDK is not configured
  if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
    return (
      <button
        className="btn btn-google btn-lg btn-block"
        onClick={() => toast.error('Google Client ID not configured. Set VITE_GOOGLE_CLIENT_ID in .env')}
        type="button"
        id="google-login-btn"
      >
        <GoogleIcon />
        Continue with Google
      </button>
    );
  }

  return <div ref={btnRef} style={{ width: '100%', minHeight: '50px' }} />;
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
