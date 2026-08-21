import { Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import { Reveal, Icon } from '../components/ui';

export default function Footer() {
  const { profile, settings } = useSite();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <Reveal>
            <div className="stack" style={{ gap: '0.5rem' }}>
              <span className="eyebrow">Say hello</span>
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="h3" style={{ wordBreak: 'break-word' }}>
                  {profile.email}
                </a>
              )}
              {settings.footerNote && <p className="muted">{settings.footerNote}</p>}
            </div>
          </Reveal>

          {profile.socials?.length > 0 && (
            <Reveal delay={0.08}>
              <div className="footer-socials">
                {profile.socials.map((s) => (
                  <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="social-btn">
                    {s.label}
                    <Icon.Arrow width="12" height="12" />
                  </a>
                ))}
              </div>
            </Reveal>
          )}
        </div>

        <div className="footer-huge" aria-hidden="true">
          {profile.name}
        </div>

        <div className="footer-bottom">
          <span>{settings.footerCredit || `© ${year} ${profile.name}. All rights reserved.`}</span>
          <span style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top ↑</button>
            <Link to="/admin" style={{ opacity: 0.55 }}>
              Admin
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
