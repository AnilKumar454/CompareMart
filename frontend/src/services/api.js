import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cm_token');
      localStorage.removeItem('cm_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth APIs ──────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleAuth: (credential) => api.post('/auth/google', { credential }),
  checkEmail: (email) => api.post('/auth/check-email', { email }),
  getMe: () => api.get('/auth/me'),
  completeProfile: (data) => api.put('/auth/complete-profile', data),
  updatePreferences: (preferences) => api.put('/auth/preferences', { preferences }),
};

export default api;
