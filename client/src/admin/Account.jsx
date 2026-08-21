import { useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { ImageField } from './Fields';

export default function Account() {
  const { admin, setAdmin, logout } = useAuth();
  const [profile, setProfile] = useState({
    name: admin?.name || '',
    email: admin?.email || '',
    avatar: admin?.avatar || '',
  });
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [alert, setAlert] = useState(null);
  const [busy, setBusy] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setBusy(true);
    setAlert(null);
    try {
      const { data } = await api.put('/auth/me', profile);
      setAdmin(data.data);
      setAlert({ type: 'ok', text: 'Account details updated.' });
    } catch (err) {
      setAlert({ type: 'err', text: err.message });
    } finally {
      setBusy(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (pw.newPassword !== pw.confirm) {
      setAlert({ type: 'err', text: 'New passwords do not match.' });
      return;
    }
    setBusy(true);
    setAlert(null);
    try {
      await api.put('/auth/password', { currentPassword: pw.currentPassword, newPassword: pw.newPassword });
      setPw({ currentPassword: '', newPassword: '', confirm: '' });
      setAlert({ type: 'ok', text: 'Password changed. Use it next time you log in.' });
    } catch (err) {
      setAlert({ type: 'err', text: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {alert && <div className={`a-alert ${alert.type}`}>{alert.text}</div>}

      <form className="a-card" onSubmit={saveProfile}>
        <div className="a-card-title">Login details</div>

        <div className="a-row two">
          <div className="a-field">
            <label htmlFor="ac-name">Name</label>
            <input
              id="ac-name"
              className="a-input"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>
          <div className="a-field">
            <label htmlFor="ac-email">Email (used to log in)</label>
            <input
              id="ac-email"
              className="a-input"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>
        </div>

        <ImageField label="Avatar" value={profile.avatar} onChange={(v) => setProfile({ ...profile, avatar: v })} />

        <button className="a-btn" type="submit" disabled={busy}>
          Save details
        </button>
      </form>

      <form className="a-card" onSubmit={savePassword}>
        <div className="a-card-title">Change password</div>

        <div className="a-field">
          <label htmlFor="ac-cur">Current password</label>
          <input
            id="ac-cur"
            className="a-input"
            type="password"
            autoComplete="current-password"
            value={pw.currentPassword}
            onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })}
          />
        </div>

        <div className="a-row two">
          <div className="a-field">
            <label htmlFor="ac-new">New password</label>
            <input
              id="ac-new"
              className="a-input"
              type="password"
              autoComplete="new-password"
              value={pw.newPassword}
              onChange={(e) => setPw({ ...pw, newPassword: e.target.value })}
            />
          </div>
          <div className="a-field">
            <label htmlFor="ac-conf">Confirm new password</label>
            <input
              id="ac-conf"
              className="a-input"
              type="password"
              autoComplete="new-password"
              value={pw.confirm}
              onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
            />
          </div>
        </div>

        <button className="a-btn" type="submit" disabled={busy}>
          Update password
        </button>
      </form>

      <div className="a-card">
        <div className="a-card-title">Session</div>
        <button className="a-btn danger" onClick={logout}>
          Log out
        </button>
      </div>
    </>
  );
}
