import { useEffect, useState } from 'react';
import { getSingleton, saveSingleton } from '../lib/api';
import { FormBuilder } from './Fields';
import { useSite } from '../context/SiteContext';

/** Edits a one-of-a-kind document (Profile, Settings) from a schema. */
export default function SingletonEditor({ endpoint, schema, title }) {
  const { reload } = useSite();
  const [value, setValue] = useState(null);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    getSingleton(endpoint)
      .then(setValue)
      .catch((err) => setAlert({ type: 'err', text: err.message }));
  }, [endpoint]);

  // Warn before losing unsaved edits on a refresh or tab close.
  useEffect(() => {
    const handler = (e) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const save = async (e) => {
    e?.preventDefault();
    setSaving(true);
    setAlert(null);
    try {
      const saved = await saveSingleton(endpoint, value);
      setValue(saved);
      setDirty(false);
      reload(); // repaint the public site with the new content
      setAlert({ type: 'ok', text: `${title} saved. The site is updated.` });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setAlert({ type: 'err', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (!value) return <div className="a-empty">Loading…</div>;

  return (
    <form onSubmit={save}>
      {alert && <div className={`a-alert ${alert.type}`}>{alert.text}</div>}

      <FormBuilder
        schema={schema}
        value={value}
        onChange={(v) => {
          setValue(v);
          setDirty(true);
        }}
      />

      <div className="a-sticky-save">
        <button className="a-btn block" type="submit" disabled={saving}>
          {saving ? <span className="a-spinner" /> : null}
          {saving ? 'Saving…' : dirty ? `Save ${title.toLowerCase()} •` : `Save ${title.toLowerCase()}`}
        </button>
      </div>
    </form>
  );
}
