import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate(location.state?.from || '/admin', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin">
      <div className="a-login">
        <form className="a-login-card" onSubmit={submit}>
          <div className="admin-brand" style={{ padding: 0, marginBottom: '1.1rem' }}>
            <span className="mark">S</span>
            Portfolio CMS
          </div>

          <h1>Welcome back</h1>
          <p style={{ color: 'var(--a-muted)', fontSize: '0.85rem', margin: '0 0 1.2rem' }}>
            Log in to manage every part of your portfolio.
          </p>

          {error && <div className="a-alert err">{error}</div>}

          <div className="a-field">
            <label htmlFor="lg-email">Email</label>
            <input
              id="lg-email"
              className="a-input"
              type="email"
              inputMode="email"
              autoComplete="username"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="admin@shubhsingh.design"
              required
            />
          </div>

          <div className="a-field">
            <label htmlFor="lg-pw">Password</label>
            <input
              id="lg-pw"
              className="a-input"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>

          <button className="a-btn block" type="submit" disabled={busy}>
            {busy ? <span className="a-spinner" /> : null}
            {busy ? 'Signing in…' : 'Sign in'}
          </button>

          <div className="a-hint-box">
            <strong>Seeded login</strong>
            <br />
            admin@shubhsingh.design / admin123
            <br />
            Change this under <em>Account</em> once you are in.
          </div>
        </form>
      </div>
    </div>
  );
}
