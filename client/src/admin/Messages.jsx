import { useEffect, useState } from 'react';
import api, { getMessages } from '../lib/api';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [alert, setAlert] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getMessages({ archived: showArchived });
      setMessages(res.data);
    } catch (err) {
      setAlert({ type: 'err', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showArchived]);

  const toggleOpen = async (msg) => {
    const next = open === msg._id ? null : msg._id;
    setOpen(next);
    if (next && !msg.read) {
      await api.put(`/messages/${msg._id}`, { read: true }).catch(() => {});
      setMessages((list) => list.map((m) => (m._id === msg._id ? { ...m, read: true } : m)));
    }
  };

  const act = async (msg, body) => {
    try {
      await api.put(`/messages/${msg._id}`, body);
      load();
    } catch (err) {
      setAlert({ type: 'err', text: err.message });
    }
  };

  const del = async (msg) => {
    if (!window.confirm(`Delete the message from ${msg.name}?`)) return;
    try {
      await api.delete(`/messages/${msg._id}`);
      load();
    } catch (err) {
      setAlert({ type: 'err', text: err.message });
    }
  };

  return (
    <>
      {alert && <div className={`a-alert ${alert.type}`}>{alert.text}</div>}

      <div className="a-toolbar">
        <div className="a-toolbar-row">
          <button className={`a-btn ${showArchived ? 'ghost' : ''}`} onClick={() => setShowArchived(false)}>
            Inbox
          </button>
          <button className={`a-btn ${showArchived ? '' : 'ghost'}`} onClick={() => setShowArchived(true)}>
            Archived
          </button>
        </div>
        <button className="a-btn ghost" onClick={load}>
          ⟳ Refresh
        </button>
      </div>

      {loading && <div className="a-empty">Loading…</div>}
      {!loading && !messages.length && (
        <div className="a-empty">{showArchived ? 'Nothing archived.' : 'No messages yet.'}</div>
      )}

      <div className="a-list">
        {messages.map((m) => (
          <div className={`a-msg ${m.read ? '' : 'unread'}`} key={m._id} onClick={() => toggleOpen(m)}>
            <div className="a-msg-head">
              <span className="a-msg-name">
                {m.name}
                <span style={{ color: 'var(--a-muted)', fontWeight: 400 }}> · {m.email}</span>
              </span>
              <span className="a-msg-date">
                {new Date(m.createdAt).toLocaleString(undefined, {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            {(m.subject || m.budget) && (
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', margin: '0.3rem 0 0.45rem' }}>
                {m.subject && <span className="a-chip">{m.subject}</span>}
                {m.budget && <span className="a-chip">💰 {m.budget}</span>}
                {!m.read && <span className="a-chip on">New</span>}
              </div>
            )}

            <div className={`a-msg-body ${open === m._id ? '' : 'a-msg-collapsed'}`}>{m.message}</div>

            {open === m._id && (
              <div style={{ display: 'flex', gap: 6, marginTop: '0.8rem', flexWrap: 'wrap' }} onClick={(e) => e.stopPropagation()}>
                <a
                  className="a-btn sm"
                  href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || 'Your project enquiry'}`)}`}
                >
                  ✉ Reply
                </a>
                <button className="a-btn ghost sm" onClick={() => act(m, { read: !m.read })}>
                  Mark as {m.read ? 'unread' : 'read'}
                </button>
                <button className="a-btn ghost sm" onClick={() => act(m, { archived: !m.archived })}>
                  {m.archived ? 'Restore' : 'Archive'}
                </button>
                <button className="a-btn danger sm" onClick={() => del(m)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
