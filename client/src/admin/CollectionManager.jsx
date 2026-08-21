import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { list, create, update, remove, reorder } from '../lib/api';
import { COLLECTIONS } from './schemas';
import { FormBuilder } from './Fields';
import { useSite } from '../context/SiteContext';

/** One screen that drives every collection, configured by COLLECTIONS. */
export default function CollectionManager() {
  const { collection } = useParams();
  const config = COLLECTIONS[collection];
  const { reload } = useSite();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // item object or 'new'
  const [draft, setDraft] = useState({});
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      setItems(await list(config.endpoint, { all: true }));
    } catch (err) {
      setAlert({ type: 'err', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!config) return;
    setEditing(null);
    setSearch('');
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection]);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((it) => JSON.stringify(it).toLowerCase().includes(q));
  }, [items, search]);

  if (!config) return <div className="a-empty">Unknown collection.</div>;

  const openNew = () => {
    setDraft({ ...config.defaults, order: items.length });
    setEditing('new');
  };

  const openEdit = (item) => {
    setDraft({ ...item });
    setEditing(item);
  };

  const save = async (e) => {
    e?.preventDefault();
    setSaving(true);
    setAlert(null);
    try {
      if (editing === 'new') await create(config.endpoint, draft);
      else await update(config.endpoint, editing._id, draft);

      setEditing(null);
      await load();
      reload();
      setAlert({ type: 'ok', text: `${config.singular} saved.` });
    } catch (err) {
      setAlert({ type: 'err', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const del = async (item) => {
    const label = config.display(item).title;
    if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) return;
    try {
      await remove(config.endpoint, item._id);
      await load();
      reload();
      setAlert({ type: 'ok', text: 'Deleted.' });
    } catch (err) {
      setAlert({ type: 'err', text: err.message });
    }
  };

  const togglePublished = async (item) => {
    try {
      await update(config.endpoint, item._id, { published: !item.published });
      await load();
      reload();
    } catch (err) {
      setAlert({ type: 'err', text: err.message });
    }
  };

  const move = async (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;

    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);

    try {
      await reorder(config.endpoint, next.map((it, i) => ({ _id: it._id, order: i })));
      reload();
    } catch (err) {
      setAlert({ type: 'err', text: err.message });
      load();
    }
  };

  return (
    <>
      {alert && <div className={`a-alert ${alert.type}`}>{alert.text}</div>}

      <div className="a-toolbar">
        <div className="a-toolbar-row" style={{ flex: 1 }}>
          <input
            className="a-input"
            placeholder={`Search ${config.title.toLowerCase()}…`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="a-btn" onClick={openNew}>
          + New {config.singular.toLowerCase()}
        </button>
      </div>

      {loading && <div className="a-empty">Loading…</div>}

      {!loading && !filtered.length && (
        <div className="a-empty">
          {search ? 'Nothing matches that search.' : `No ${config.title.toLowerCase()} yet — add your first one.`}
        </div>
      )}

      <div className="a-list">
        {filtered.map((item, i) => {
          const d = config.display(item);
          return (
            <div className="a-item" key={item._id}>
              <div className="a-item-thumb">
                {d.thumb ? <img src={d.thumb} alt="" /> : <span>{d.icon || '◻'}</span>}
              </div>

              <div className="a-item-body" onClick={() => openEdit(item)} style={{ cursor: 'pointer' }}>
                <div className="a-item-title">{d.title}</div>
                <div className="a-item-sub">{d.sub}</div>
                <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                  <span className={`a-chip ${item.published ? 'on' : 'off'}`}>
                    {item.published ? 'Live' : 'Hidden'}
                  </span>
                  {item.featured && <span className="a-chip star">★ Featured</span>}
                  {typeof item.views === 'number' && item.views > 0 && (
                    <span className="a-chip">{item.views} views</span>
                  )}
                </div>
              </div>

              <div className="a-item-actions">
                {!search && (
                  <div className="a-move">
                    <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                      ↑
                    </button>
                    <button onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down">
                      ↓
                    </button>
                  </div>
                )}
                <button className="a-btn ghost sm" onClick={() => togglePublished(item)}>
                  {item.published ? 'Hide' : 'Show'}
                </button>
                <button className="a-btn ghost sm" onClick={() => openEdit(item)}>
                  Edit
                </button>
                <button className="a-btn danger sm" onClick={() => del(item)}>
                  ×
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {editing && (
        <div className="a-modal-backdrop" onClick={() => !saving && setEditing(null)}>
          <form className="a-modal" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <div className="a-modal-head">
              <h2>
                {editing === 'new' ? `New ${config.singular.toLowerCase()}` : `Edit ${config.singular.toLowerCase()}`}
              </h2>
              <button type="button" className="a-btn ghost sm" onClick={() => setEditing(null)}>
                Close
              </button>
            </div>

            <FormBuilder schema={config.schema} value={draft} onChange={setDraft} />

            <div className="a-form-actions">
              <button className="a-btn block" type="submit" disabled={saving}>
                {saving ? <span className="a-spinner" /> : null}
                {saving ? 'Saving…' : `Save ${config.singular.toLowerCase()}`}
              </button>
              <button type="button" className="a-btn ghost" onClick={() => setEditing(null)} disabled={saving}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
