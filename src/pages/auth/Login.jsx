import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bg1 from '../../assets/images/bg1.jpg';
import logo from '../../assets/images/logo.png';
import './Login.css';

const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    {open ? (
      <>
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a20.6 20.6 0 0 1 5.06-5.94M9.9 4.24A10.6 10.6 0 0 1 12 4c7 0 11 7 11 7a20.6 20.6 0 0 1-2.22 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" />
        <path d="M1 1l22 22" />
      </>
    )}
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 7l10 6 10-6" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="4" y="10" width="16" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Enter your email and password to continue.');
      return;
    }
    // TODO: wire up real auth call here
    navigate('/supervisor/profile');
  };

  return (
    <div className="login-page" style={{ backgroundImage: `url(${bg1})` }}>
      <div className="login-overlay" />

      <div className="login-content">
        <div className="brand">
          <div className="brand-mark">
            <img src={logo} alt="GMS logo" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </div>
          <h1 className="brand-title">GMS</h1>
          <div className="brand-stripe" aria-hidden="true" />
          <p className="brand-subtitle">Garage Management System</p>
        </div>

        <div className="login-card">
          <h2 className="card-title">Welcome Back!</h2>
          <p className="card-subtitle">Sign in to continue to your account</p>

          <form onSubmit={handleSubmit} noValidate>
            <label className="field-label" htmlFor="email">Email address</label>
            <div className="input-wrap">
              <span className="input-icon"><MailIcon /></span>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <label className="field-label" htmlFor="password">Password</label>
            <div className="input-wrap">
              <span className="input-icon"><LockIcon /></span>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-action"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>

            {error && <p className="form-error">{error}</p>}

            <div className="row-between">
              <label className="checkbox">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                />
                <span>Remember me</span>
              </label>
              <a href="/forgot-password" className="link">Forgot password?</a>
            </div>

            <button type="submit" className="btn-primary">Sign in</button>

            <div className="divider"><span>or</span></div>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/Register')}
            >
              <UserIcon />
              Register
            </button>
          </form>
        </div>

        <p className="login-footer">© 2026 GMS. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;

