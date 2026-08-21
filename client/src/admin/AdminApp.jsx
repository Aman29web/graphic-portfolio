import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMessages } from '../lib/api';

import Login from './Login';
import Dashboard from './Dashboard';
import CollectionManager from './CollectionManager';
import SingletonEditor from './SingletonEditor';
import Messages from './Messages';
import Media from './Media';
import Account from './Account';
import { profileSchema, settingsSchema, COLLECTIONS } from './schemas';

const NAV = [
  { section: 'Overview', items: [{ to: '/admin', label: 'Dashboard', icon: '▦', end: true }] },
  {
    section: 'Content',
    items: [
      { to: '/admin/profile', label: 'Profile & bio', icon: '👤' },
      { to: '/admin/collections/projects', label: 'Projects', icon: '🖼' },
      { to: '/admin/collections/services', label: 'Services', icon: '✦' },
      { to: '/admin/collections/skills', label: 'Skills', icon: '▰' },
      { to: '/admin/collections/experience', label: 'Experience', icon: '💼' },
      { to: '/admin/collections/testimonials', label: 'Testimonials', icon: '❝' },
    ],
  },
  {
    section: 'Manage',
    items: [
      { to: '/admin/messages', label: 'Messages', icon: '✉', badge: 'unread' },
      { to: '/admin/media', label: 'Media library', icon: '🗂' },
      { to: '/admin/settings', label: 'Site settings', icon: '⚙' },
      { to: '/admin/account', label: 'Account', icon: '🔑' },
    ],
  },
];

const TITLES = {
  '/admin': 'Dashboard',
  '/admin/profile': 'Profile & bio',
  '/admin/messages': 'Messages',
  '/admin/media': 'Media library',
  '/admin/settings': 'Site settings',
  '/admin/account': 'Account',
};

function Shell({ children }) {
  const { admin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const fetchUnread = () =>
      getMessages()
        .then((res) => setUnread(res.unread || 0))
        .catch(() => {});
    fetchUnread();
    const timer = setInterval(fetchUnread, 60000);
    return () => clearInterval(timer);
  }, [location.pathname]);

  const collectionKey = location.pathname.split('/admin/collections/')[1];
  const title = TITLES[location.pathname] || COLLECTIONS[collectionKey]?.title || 'Admin';

  return (
    <div className="admin">
      <div className="admin-shell">
        <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
          <div className="admin-brand">
            <span className="mark">S</span>
            Portfolio CMS
          </div>

          {NAV.map((group) => (
            <div className="admin-nav" key={group.section}>
              <span className="admin-nav-label">{group.section}</span>
              {group.items.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => (isActive ? 'active' : '')}>
                  <span>{item.icon}</span>
                  {item.label}
                  {item.badge === 'unread' && unread > 0 && <span className="badge">{unread}</span>}
                </NavLink>
              ))}
            </div>
          ))}

          <div className="admin-sidebar-foot">
            <div className="admin-user">
              {admin?.avatar ? <img src={admin.avatar} alt="" /> : <span className="mark">{admin?.name?.[0] || 'A'}</span>}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' }}>{admin?.name}</div>
                <div style={{ color: 'var(--a-muted)', fontSize: '0.72rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {admin?.email}
                </div>
              </div>
            </div>
            <a className="a-btn ghost sm block" href="/" target="_blank" rel="noreferrer">
              ↗ View site
            </a>
            <button className="a-btn ghost sm block" onClick={logout}>
              Log out
            </button>
          </div>
        </aside>

        {open && <div className="admin-overlay" onClick={() => setOpen(false)} />}

        <header className="admin-topbar">
          <button className="admin-burger" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
            <span />
            <span />
            <span />
          </button>
          <h1>{title}</h1>
          <Link className="a-btn ghost sm" to="/" style={{ marginLeft: 'auto' }} target="_blank">
            ↗ Site
          </Link>
        </header>

        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}

function Protected({ children }) {
  const { isAuthed, checking } = useAuth();
  const location = useLocation();

  if (checking) {
    return (
      <div className="admin">
        <div className="a-login">
          <span className="a-spinner" />
        </div>
      </div>
    );
  }

  if (!isAuthed) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return children;
}

export default function AdminApp() {
  const { isAuthed } = useAuth();

  return (
    <Routes>
      <Route path="/admin/login" element={isAuthed ? <Navigate to="/admin" replace /> : <Login />} />

      <Route
        path="/admin/*"
        element={
          <Protected>
            <Shell>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route
                  path="profile"
                  element={<SingletonEditor endpoint="/profile" schema={profileSchema} title="Profile" />}
                />
                <Route
                  path="settings"
                  element={<SingletonEditor endpoint="/settings" schema={settingsSchema} title="Settings" />}
                />
                <Route path="collections/:collection" element={<CollectionManager />} />
                <Route path="messages" element={<Messages />} />
                <Route path="media" element={<Media />} />
                <Route path="account" element={<Account />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </Shell>
          </Protected>
        }
      />
    </Routes>
  );
}
