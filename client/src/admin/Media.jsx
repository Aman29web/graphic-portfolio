import { useEffect, useRef, useState } from 'react';
import { getLibrary, deleteMedia, uploadImage } from '../lib/api';

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

export default function Media() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [alert, setAlert] = useState(null);
  const inputRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      setFiles(await getLibrary());
    } catch (err) {
      setAlert({ type: 'err', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (e) => {
    const picked = Array.from(e.target.files || []);
    if (!picked.length) return;
    setBusy(true);
    try {
      for (const file of picked) await uploadImage(file);
      await load();
      setAlert({ type: 'ok', text: `Uploaded ${picked.length} file(s).` });
    } catch (err) {
      setAlert({ type: 'err', text: err.message });
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  const del = async (file) => {
    if (!window.confirm(`Delete ${file.filename}? Anything using it will show a broken image.`)) return;
    try {
      await deleteMedia(file.filename);
      load();
    } catch (err) {
      setAlert({ type: 'err', text: err.message });
    }
  };

  const copy = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setAlert({ type: 'ok', text: 'URL copied to clipboard.' });
    } catch {
      window.prompt('Copy this URL', url);
    }
  };

  return (
    <>
      {alert && <div className={`a-alert ${alert.type}`}>{alert.text}</div>}

      <div className="a-toolbar">
        <span style={{ color: 'var(--a-muted)', fontSize: '0.85rem' }}>
          {files.length} file{files.length === 1 ? '' : 's'} uploaded
        </span>
        <button className="a-btn" onClick={() => inputRef.current?.click()} disabled={busy}>
          {busy ? <span className="a-spinner" /> : '⬆'} Upload images
        </button>
      </div>

      <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={handleUpload} />

      {loading && <div className="a-empty">Loading…</div>}
      {!loading && !files.length && (
        <div className="a-empty">
          No uploads yet. Images you add here can be reused anywhere in the admin panel.
        </div>
      )}

      <div className="a-list">
        {files.map((f) => (
          <div className="a-item" key={f.filename}>
            <div className="a-item-thumb">
              <img src={f.url} alt={f.filename} />
            </div>
            <div className="a-item-body">
              <div className="a-item-title">{f.filename}</div>
              <div className="a-item-sub">
                {kb(f.size)} · {new Date(f.uploadedAt).toLocaleDateString()}
              </div>
            </div>
            <div className="a-item-actions">
              <button className="a-btn ghost sm" onClick={() => copy(f.url)}>
                Copy URL
              </button>
              <button className="a-btn danger sm" onClick={() => del(f)}>
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
