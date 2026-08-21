import { useRef, useState, useEffect } from 'react';
import { uploadImage, getLibrary } from '../lib/api';

/* ------------------------------------------------------------- toggle -- */

export function Toggle({ label, value, onChange, hint }) {
  return (
    <div className="a-field">
      <div className="a-toggle" onClick={() => onChange(!value)} role="switch" aria-checked={!!value} tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onChange(!value);
          }
        }}
      >
        <span style={{ fontSize: '0.88rem' }}>{label}</span>
        <span className={`a-switch ${value ? 'on' : ''}`} />
      </div>
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}

/* ---------------------------------------------------------- tag input -- */

export function TagInput({ label, value = [], onChange, placeholder = 'Type and press Enter', hint }) {
  const [draft, setDraft] = useState('');

  const add = () => {
    const v = draft.trim();
    if (!v || value.includes(v)) return setDraft('');
    onChange([...value, v]);
    setDraft('');
  };

  return (
    <div className="a-field">
      {label && <label>{label}</label>}
      <div className="a-tags">
        {value.map((tag, i) => (
          <span className="a-tag" key={`${tag}-${i}`}>
            {tag}
            <button type="button" onClick={() => onChange(value.filter((_, idx) => idx !== i))} aria-label={`Remove ${tag}`}>
              ×
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              add();
            }
            if (e.key === 'Backspace' && !draft && value.length) onChange(value.slice(0, -1));
          }}
          onBlur={add}
        />
      </div>
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}

/* --------------------------------------------------------- media picker */

function MediaLibrary({ onPick, onClose }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLibrary()
      .then(setFiles)
      .catch(() => setFiles([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="a-modal-backdrop" onClick={onClose}>
      <div className="a-modal" onClick={(e) => e.stopPropagation()}>
        <div className="a-modal-head">
          <h2>Media library</h2>
          <button className="a-btn ghost sm" onClick={onClose} type="button">
            Close
          </button>
        </div>

        {loading && <p className="hint">Loading…</p>}
        {!loading && !files.length && <div className="a-empty">Nothing uploaded yet.</div>}

        <div className="a-gallery">
          {files.map((f) => (
            <div
              className="a-gallery-item"
              key={f.filename}
              onClick={() => {
                onPick(f.url);
                onClose();
              }}
              style={{ cursor: 'pointer' }}
            >
              <img src={f.url} alt={f.filename} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Single image: upload from device, paste a URL, or reuse from the library. */
export function ImageField({ label, value, onChange, hint }) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [showLib, setShowLib] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      onChange(await uploadImage(file));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  return (
    <div className="a-field">
      {label && <label>{label}</label>}
      <div className="a-image-field">
        <div className="a-image-preview">
          {value ? <img src={value} alt="" /> : <span>No image selected</span>}
        </div>

        <input className="a-input" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="Paste an image URL, or upload below" />

        <div className="a-image-actions">
          <button type="button" className="a-btn ghost sm" onClick={() => fileRef.current?.click()} disabled={busy}>
            {busy ? <span className="a-spinner" /> : '⬆'} Upload
          </button>
          <button type="button" className="a-btn ghost sm" onClick={() => setShowLib(true)}>
            🖼 Library
          </button>
          {value && (
            <button type="button" className="a-btn danger sm" onClick={() => onChange('')}>
              Remove
            </button>
          )}
        </div>

        <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
        {error && <span className="hint" style={{ color: 'var(--a-red)' }}>{error}</span>}
        {hint && <span className="hint">{hint}</span>}
      </div>

      {showLib && <MediaLibrary onPick={onChange} onClose={() => setShowLib(false)} />}
    </div>
  );
}

/** Multiple images with reordering — used for project galleries. */
export function ImageListField({ label, value = [], onChange, hint }) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [showLib, setShowLib] = useState(false);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true);
    try {
      const urls = [];
      for (const file of files) urls.push(await uploadImage(file));
      onChange([...value, ...urls]);
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  const move = (from, to) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div className="a-field">
      {label && <label>{label}</label>}

      <div className="a-gallery">
        {value.map((src, i) => (
          <div className="a-gallery-item" key={src + i}>
            <img src={src} alt="" />
            <button type="button" onClick={() => onChange(value.filter((_, idx) => idx !== i))} aria-label="Remove">
              ×
            </button>
            <div style={{ position: 'absolute', bottom: 3, left: 3, display: 'flex', gap: 2 }}>
              <button
                type="button"
                onClick={() => move(i, i - 1)}
                style={{ position: 'static', width: 20, height: 20 }}
                aria-label="Move left"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => move(i, i + 1)}
                style={{ position: 'static', width: 20, height: 20 }}
                aria-label="Move right"
              >
                ›
              </button>
            </div>
          </div>
        ))}

        <button type="button" className="a-gallery-add" onClick={() => fileRef.current?.click()} disabled={busy}>
          {busy ? <span className="a-spinner" /> : '+'}
        </button>
      </div>

      <div className="a-image-actions" style={{ marginTop: '0.5rem' }}>
        <button type="button" className="a-btn ghost sm" onClick={() => setShowLib(true)}>
          🖼 Add from library
        </button>
        <button
          type="button"
          className="a-btn ghost sm"
          onClick={() => {
            const url = window.prompt('Image URL');
            if (url) onChange([...value, url]);
          }}
        >
          🔗 Add URL
        </button>
      </div>

      <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={handleFiles} />
      {hint && <span className="hint">{hint}</span>}
      {showLib && <MediaLibrary onPick={(url) => onChange([...value, url])} onClose={() => setShowLib(false)} />}
    </div>
  );
}

/* ------------------------------------------------------------ repeater */

/** Array of objects (socials, stats, nav links, sections…). */
export function Repeater({ label, value = [], onChange, fields, itemLabel, hint }) {
  const blank = () => Object.fromEntries(fields.map((f) => [f.name, f.type === 'boolean' ? false : f.type === 'number' ? 0 : '']));

  const update = (i, key, val) => {
    const next = [...value];
    next[i] = { ...next[i], [key]: val };
    onChange(next);
  };

  const move = (from, to) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next.map((it, idx) => ('order' in it ? { ...it, order: idx } : it)));
  };

  return (
    <div className="a-field">
      {label && <label>{label}</label>}
      <div className="a-repeater">
        {value.map((item, i) => (
          <div className="a-repeater-item" key={i}>
            <div className="a-repeater-head">
              <span className="idx">
                {itemLabel ? itemLabel(item, i) : `Item ${i + 1}`}
              </span>
              <div className="a-move">
                <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label="Move up">
                  ↑
                </button>
                <button type="button" onClick={() => move(i, i + 1)} disabled={i === value.length - 1} aria-label="Move down">
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                  aria-label="Delete"
                  style={{ color: 'var(--a-red)' }}
                >
                  ×
                </button>
              </div>
            </div>

            <div className={`a-row ${fields.length > 1 ? 'two' : ''}`}>
              {fields.map((f) => (
                <Field
                  key={f.name}
                  {...f}
                  name={`${f.name}-${i}`} /* keep input ids unique across rows */
                  value={item[f.name]}
                  onChange={(v) => update(i, f.name, v)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="a-btn ghost sm" style={{ marginTop: '0.5rem' }} onClick={() => onChange([...value, blank()])}>
        + Add {label ? label.replace(/s$/, '').toLowerCase() : 'item'}
      </button>
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}

/* ---------------------------------------------------------- main field */

/** One switchboard so every editor screen renders fields the same way. */
export function Field({ type = 'text', name, label, value, onChange, options, placeholder, hint, rows, min, max }) {
  switch (type) {
    case 'boolean':
      return <Toggle label={label} value={!!value} onChange={onChange} hint={hint} />;

    case 'image':
      return <ImageField label={label} value={value} onChange={onChange} hint={hint} />;

    case 'imageList':
      return <ImageListField label={label} value={value || []} onChange={onChange} hint={hint} />;

    case 'tags':
      return <TagInput label={label} value={value || []} onChange={onChange} hint={hint} placeholder={placeholder} />;

    case 'textarea':
    case 'longtext':
      return (
        <div className="a-field">
          {label && <label htmlFor={name}>{label}</label>}
          <textarea
            id={name}
            className={`a-textarea ${type === 'longtext' ? 'tall' : ''}`}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
          />
          {hint && <span className="hint">{hint}</span>}
        </div>
      );

    case 'select':
      return (
        <div className="a-field">
          {label && <label htmlFor={name}>{label}</label>}
          <select id={name} className="a-select" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
            {(options || []).map((opt) => {
              const o = typeof opt === 'string' ? { value: opt, label: opt } : opt;
              return (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              );
            })}
          </select>
          {hint && <span className="hint">{hint}</span>}
        </div>
      );

    case 'color':
      return (
        <div className="a-field">
          {label && <label>{label}</label>}
          <div className="a-color">
            <input type="color" value={value || '#000000'} onChange={(e) => onChange(e.target.value)} aria-label={label} />
            <input className="a-input" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="#ff5c39" />
          </div>
          {hint && <span className="hint">{hint}</span>}
        </div>
      );

    case 'number':
      return (
        <div className="a-field">
          {label && <label htmlFor={name}>{label}</label>}
          <input
            id={name}
            type="number"
            className="a-input"
            value={value ?? ''}
            min={min}
            max={max}
            onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder={placeholder}
          />
          {hint && <span className="hint">{hint}</span>}
        </div>
      );

    case 'range':
      return (
        <div className="a-field">
          {label && (
            <label htmlFor={name}>
              {label} — <strong>{value ?? 0}%</strong>
            </label>
          )}
          <input
            id={name}
            type="range"
            min={min ?? 0}
            max={max ?? 100}
            value={value ?? 0}
            onChange={(e) => onChange(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--a-accent)' }}
          />
          {hint && <span className="hint">{hint}</span>}
        </div>
      );

    default:
      return (
        <div className="a-field">
          {label && <label htmlFor={name}>{label}</label>}
          <input
            id={name}
            className="a-input"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
          {hint && <span className="hint">{hint}</span>}
        </div>
      );
  }
}

/* ------------------------------------------------------- form builder -- */

/**
 * Renders a schema against a value object. Groups let a screen break a long
 * form into labelled cards without any bespoke markup.
 */
export function FormBuilder({ schema, value, onChange }) {
  const set = (name, v) => onChange({ ...value, [name]: v });

  const setNested = (path, v) => {
    const [head, tail] = path.split('.');
    onChange({ ...value, [head]: { ...(value[head] || {}), [tail]: v } });
  };

  const getValue = (name) => {
    if (!name.includes('.')) return value[name];
    const [head, tail] = name.split('.');
    return value[head]?.[tail];
  };

  return (
    <>
      {schema.map((group) => (
        <div className="a-card" key={group.title || group.fields[0]?.name}>
          {group.title && (
            <div className="a-card-title">
              {group.title}
              {group.note && <span className="hint">{group.note}</span>}
            </div>
          )}

          <div className={`a-row ${group.columns === 2 ? 'two' : group.columns === 3 ? 'three' : ''}`}>
            {group.fields.map((f) =>
              f.type === 'repeater' ? (
                <div key={f.name} style={{ gridColumn: '1 / -1' }}>
                  <Repeater
                    label={f.label}
                    hint={f.hint}
                    fields={f.fields}
                    itemLabel={f.itemLabel}
                    value={getValue(f.name) || []}
                    onChange={(v) => (f.name.includes('.') ? setNested(f.name, v) : set(f.name, v))}
                  />
                </div>
              ) : (
                <div key={f.name} style={f.full ? { gridColumn: '1 / -1' } : undefined}>
                  <Field
                    {...f}
                    value={getValue(f.name)}
                    onChange={(v) => (f.name.includes('.') ? setNested(f.name, v) : set(f.name, v))}
                  />
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </>
  );
}
