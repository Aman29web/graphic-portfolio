import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStats } from '../lib/api';
import { useSite } from '../context/SiteContext';

const QUICK = [
  { to: '/admin/collections/projects', label: 'Add a project', icon: '🖼' },
  { to: '/admin/profile', label: 'Edit profile', icon: '👤' },
  { to: '/admin/settings', label: 'Site settings', icon: '⚙' },
  { to: '/admin/collections/services', label: 'Services', icon: '✦' },
  { to: '/admin/messages', label: 'Inbox', icon: '✉' },
  { to: '/', label: 'View live site', icon: '↗' },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const { profile } = useSite();

  useEffect(() => {
    getStats().then(setStats).catch((err) => setError(err.message));
  }, []);

  const tiles = stats
    ? [
        { val: stats.projects, lab: 'Projects', sub: `${stats.published} live` },
        { val: stats.services, lab: 'Services' },
        { val: stats.testimonials, lab: 'Testimonials' },
        { val: stats.unread, lab: 'Unread messages' },
      ]
    : [];

  return (
    <>
      {error && <div className="a-alert err">{error}</div>}

      <div className="a-card" style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '1.15rem', fontWeight: 600 }}>Welcome back, {profile.name?.split(' ')[0] || 'there'} 👋</div>
        <p style={{ color: 'var(--a-muted)', fontSize: '0.87rem', margin: '0.3rem 0 0' }}>
          Everything on your portfolio is editable from here — nothing is hard-coded.
        </p>
      </div>

      <div className="a-stats">
        {tiles.map((t) => (
          <div className="a-stat" key={t.lab}>
            <div className="val">{t.val ?? '—'}</div>
            <div className="lab">
              {t.lab}
              {t.sub ? ` · ${t.sub}` : ''}
            </div>
          </div>
        ))}
      </div>

      <div className="a-card">
        <div className="a-card-title">Quick actions</div>
        <div className="a-quick">
          {QUICK.map((q) =>
            q.to === '/' ? (
              <a key={q.label} href="/" target="_blank" rel="noreferrer">
                <span>{q.icon}</span> {q.label}
              </a>
            ) : (
              <Link key={q.to} to={q.to}>
                <span>{q.icon}</span> {q.label}
              </Link>
            )
          )}
        </div>
      </div>

      {stats?.topViewed?.length > 0 && (
        <div className="a-card">
          <div className="a-card-title">Most viewed case studies</div>
          <div className="a-list">
            {stats.topViewed.map((p) => (
              <div className="a-item" key={p._id}>
                <div className="a-item-body">
                  <div className="a-item-title">{p.title}</div>
                  <div className="a-item-sub">{p.views || 0} views</div>
                </div>
                <a className="a-btn ghost sm" href={`/work/${p.slug}`} target="_blank" rel="noreferrer">
                  Open
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats?.recentMessages?.length > 0 && (
        <div className="a-card">
          <div className="a-card-title">
            Recent messages
            <Link className="a-btn ghost sm" to="/admin/messages">
              View all
            </Link>
          </div>
          <div className="a-list">
            {stats.recentMessages.map((m) => (
              <div className={`a-msg ${m.read ? '' : 'unread'}`} key={m._id}>
                <div className="a-msg-head">
                  <span className="a-msg-name">
                    {m.name} <span style={{ color: 'var(--a-muted)', fontWeight: 400 }}>· {m.email}</span>
                  </span>
                  <span className="a-msg-date">{new Date(m.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="a-msg-body a-msg-collapsed">{m.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
