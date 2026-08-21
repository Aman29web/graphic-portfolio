import { useSite } from '../context/SiteContext';
import { Reveal, SectionHead, Counter, SmartImage, Icon } from '../components/ui';

export function About() {
  const { profile, section } = useSite();
  const meta = section('about');
  const paragraphs = (profile.longBio || profile.shortBio || '').split('\n').filter(Boolean);

  return (
    <section className="section" id="about">
      <div className="container">
        <SectionHead eyebrow={meta.eyebrow} title={meta.label} subtitle={meta.subtitle} />

        <div className="about-grid">
          <Reveal className="about-portrait">
            <SmartImage
              src={profile.portrait || profile.avatar}
              alt={profile.name}
              style={{ width: '100%', aspectRatio: '4 / 5', objectFit: 'cover' }}
            />
            <div className="about-portrait-badge">
              <span>{profile.name}</span>
              <span className="muted">{profile.location}</span>
            </div>
          </Reveal>

          <div className="about-body">
            {paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.08} as="p" className={i === 0 ? 'lead' : 'muted'}>
                {p}
              </Reveal>
            ))}

            {profile.tools?.length > 0 && (
              <Reveal delay={0.2}>
                <div className="tool-chips">
                  {profile.tools.map((tool) => (
                    <span className="pill" key={tool}>
                      {tool}
                    </span>
                  ))}
                </div>
              </Reveal>
            )}

            <Reveal delay={0.28}>
              <div className="hero-actions" style={{ marginTop: '2rem' }}>
                {profile.email && (
                  <a className="btn btn-outline btn-sm" href={`mailto:${profile.email}`}>
                    <Icon.Mail width="15" height="15" /> {profile.email}
                  </a>
                )}
                {profile.phone && (
                  <a className="btn btn-ghost btn-sm" href={`tel:${profile.phone.replace(/\s/g, '')}`}>
                    {profile.phone}
                  </a>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Stats() {
  const { profile } = useSite();
  const stats = profile.stats || [];
  if (!stats.length) return null;

  return (
    <section className="section" id="stats" style={{ paddingBlock: 'clamp(1rem, 4vw, 2rem)' }}>
      <div className="container">
        <Reveal>
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <div className="stat" key={stat.label + i}>
                <span className="stat-value">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
