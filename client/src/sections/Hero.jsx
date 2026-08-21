import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSite } from '../context/SiteContext';
import { Icon, Magnetic, SmartImage } from '../components/ui';
import { Blobs } from '../components/Chrome';

/** Cycles through the admin-defined hero words. */
function WordRotator({ words = [] }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (words.length < 2) return undefined;
    const t = setInterval(() => setI((v) => (v + 1) % words.length), 2200);
    return () => clearInterval(t);
  }, [words.length]);

  if (!words.length) return null;

  return (
    <span className="hero-rotator">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[i]}
          className="gradient-text"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'inline-block' }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Hero({ onScrollTo }) {
  const { profile, settings, projects } = useSite();
  const heroImages = (profile.heroImages || []).filter(Boolean).slice(0, 3);

  const fadeUp = (delay) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section className="hero" id="home">
      {settings.showBlobs && <Blobs />}

      <div className="container hero-inner">
        {profile.available && profile.availabilityText && (
          <motion.div className="hero-meta" {...fadeUp(0.05)}>
            <span className="pill">
              <span className="live-dot" />
              {profile.availabilityText}
            </span>
            {profile.location && <span className="pill">📍 {profile.location}</span>}
          </motion.div>
        )}

        <motion.div {...fadeUp(0.12)}>
          <span className="eyebrow">{profile.designation}</span>
        </motion.div>

        <h1 className="display hero-title">
          <motion.span className="line" {...fadeUp(0.2)}>
            {profile.name}
          </motion.span>
          {profile.heroWords?.length > 0 && (
            <motion.span className="line" {...fadeUp(0.3)} style={{ display: 'block' }}>
              <span className="outline-text">makes </span>
              <WordRotator words={profile.heroWords} />
            </motion.span>
          )}
        </h1>

        <motion.p className="lead" {...fadeUp(0.42)}>
          {profile.tagline || profile.shortBio}
        </motion.p>

        <motion.div className="hero-actions" {...fadeUp(0.52)} style={{ marginTop: '1.8rem' }}>
          <Magnetic>
            <button className="btn" onClick={() => onScrollTo('#work')}>
              View my work
              <Icon.ArrowRight />
            </button>
          </Magnetic>
          <Magnetic>
            <button className="btn btn-outline" onClick={() => onScrollTo('#contact')}>
              {settings.ctaButtonText || 'Hire me'}
            </button>
          </Magnetic>
          {profile.resumeUrl && profile.resumeUrl !== '#' && (
            <a className="btn btn-ghost" href={profile.resumeUrl} target="_blank" rel="noreferrer">
              <Icon.Download /> Resume
            </a>
          )}
        </motion.div>

        <motion.div className="hero-meta" {...fadeUp(0.62)}>
          <span className="pill">{projects.length}+ projects shipped</span>
          {profile.yearsExperience ? <span className="pill">{profile.yearsExperience} yrs experience</span> : null}
        </motion.div>
      </div>

      {heroImages.length > 0 && (
        <motion.div
          className="hero-media container"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {heroImages.map((src, i) => (
            <motion.div
              key={src}
              animate={{ y: [0, i % 2 ? 10 : -10, 0] }}
              transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Sizing lives in CSS so the wide third tile can differ on desktop */}
              <SmartImage src={src} alt={`Selected work ${i + 1}`} className="hero-shot" />
            </motion.div>
          ))}
        </motion.div>
      )}

      <motion.div
        className="scroll-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span>Scroll</span>
        <motion.span
          className="bar"
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: 'top' }}
        />
      </motion.div>
    </section>
  );
}
