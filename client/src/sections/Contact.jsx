import { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { sendMessage } from '../lib/api';
import { Reveal, RevealText, Icon, Magnetic } from '../components/ui';

const BUDGETS = ['Under ₹25k', '₹25k — ₹50k', '₹50k — ₹1L', '₹1L+', 'Not sure yet'];

const EMPTY = { name: '', email: '', subject: '', budget: '', message: '' };

export default function Contact() {
  const { profile, settings, section } = useSite();
  const meta = section('contact');
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState({ type: null, text: '' });
  const [sending, setSending] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, text: '' });

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ type: 'err', text: 'Name, email and message are required.' });
      return;
    }

    setSending(true);
    try {
      const res = await sendMessage(form);
      setStatus({ type: 'ok', text: res.message || 'Message sent!' });
      setForm(EMPTY);
    } catch (err) {
      setStatus({ type: 'err', text: err.message });
    } finally {
      setSending(false);
    }
  };

  const links = [
    profile.email && { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    profile.phone && { label: 'Phone', value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}` },
    profile.location && { label: 'Based in', value: profile.location, href: null },
  ].filter(Boolean);

  return (
    <section className="section" id="contact">
      <div className="container">
        <Reveal>
          <span className="eyebrow">{meta.eyebrow}</span>
        </Reveal>

        <h2 className="h1 contact-cta-heading" style={{ margin: '1rem 0 1.2rem' }}>
          <RevealText text={settings.ctaHeading || meta.label} />
        </h2>

        <Reveal delay={0.1}>
          <p className="lead" style={{ marginBottom: '2.5rem' }}>
            {settings.ctaSubtext || meta.subtitle}
          </p>
        </Reveal>

        <div className="contact-grid">
          <div>
            <Reveal>
              <div className="contact-links">
                {links.map((link) =>
                  link.href ? (
                    <a key={link.label} className="contact-link" href={link.href}>
                      <span className="label">{link.label}</span>
                      <span className="value">
                        {link.value} <Icon.Arrow />
                      </span>
                    </a>
                  ) : (
                    <div key={link.label} className="contact-link">
                      <span className="label">{link.label}</span>
                      <span className="value">{link.value}</span>
                    </div>
                  )
                )}
              </div>
            </Reveal>

            {profile.socials?.length > 0 && (
              <Reveal delay={0.12}>
                <div className="footer-socials" style={{ marginTop: '1.6rem' }}>
                  {profile.socials.map((s) => (
                    <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="social-btn">
                      {s.label} <Icon.Arrow width="12" height="12" />
                    </a>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          {settings.enableContactForm && (
            <Reveal delay={0.15}>
              <form className="form" onSubmit={submit} noValidate>
                <div className="field">
                  <label htmlFor="cf-name">Your name *</label>
                  <input
                    id="cf-name"
                    className="input"
                    value={form.name}
                    onChange={set('name')}
                    placeholder="Jane Doe"
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="cf-email">Email *</label>
                  <input
                    id="cf-email"
                    className="input"
                    type="email"
                    inputMode="email"
                    value={form.email}
                    onChange={set('email')}
                    placeholder="jane@company.com"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="cf-subject">Project type</label>
                  <input
                    id="cf-subject"
                    className="input"
                    value={form.subject}
                    onChange={set('subject')}
                    placeholder="Brand identity for a coffee startup"
                  />
                </div>

                <div className="field">
                  <label htmlFor="cf-budget">Budget range</label>
                  <select id="cf-budget" className="select" value={form.budget} onChange={set('budget')}>
                    <option value="">Select a range</option>
                    {BUDGETS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="cf-message">Tell me about it *</label>
                  <textarea
                    id="cf-message"
                    className="textarea"
                    value={form.message}
                    onChange={set('message')}
                    placeholder="What are you building, who is it for, and when do you need it?"
                    required
                  />
                </div>

                {status.type && <div className={`form-note ${status.type}`}>{status.text}</div>}

                <Magnetic>
                  <button className="btn btn-block" type="submit" disabled={sending}>
                    {sending ? 'Sending…' : 'Send message'}
                    {!sending && <Icon.ArrowRight />}
                  </button>
                </Magnetic>

                <p className="muted" style={{ fontSize: '0.76rem' }}>
                  Usually replies within 24 hours. No spam, ever.
                </p>
              </form>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
