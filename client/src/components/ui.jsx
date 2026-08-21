import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';

/* ------------------------------------------------------------------ icons */

export const Icon = {
  Arrow: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" {...p}>
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  ),
  ArrowRight: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" {...p}>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  ),
  ArrowLeft: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" {...p}>
      <path d="M19 12H5M11 19l-7-7 7-7" />
    </svg>
  ),
  Up: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" {...p}>
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  ),
  Home: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
    </svg>
  ),
  User: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
    </svg>
  ),
  Grid: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  Sparkle: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m12 3 2.2 6.3L20.5 11l-6.3 2.2L12 19.5 9.8 13.2 3.5 11l6.3-1.7z" />
    </svg>
  ),
  Mail: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  Plus: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14" {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Star: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13" {...p}>
      <path d="m12 2 2.9 6.3 6.6.8-4.9 4.5 1.3 6.6L12 17l-5.9 3.2 1.3-6.6L2.5 9.1l6.6-.8z" />
    </svg>
  ),
  Download: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" {...p}>
      <path d="M12 3v12M7 11l5 5 5-5M4 20h16" />
    </svg>
  ),
};

/* --------------------------------------------------------------- reveal */

/** Fades + lifts children into view once, respecting reduced motion. */
export function Reveal({ children, delay = 0, y = 26, className = '', as = 'div', once = true }) {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}

/** Splits a string into words that stagger up from a mask. */
export function RevealText({ text = '', className = '', delay = 0, wordClass = '' }) {
  const words = String(text).split(' ');
  return (
    <span className={className} style={{ display: 'inline-block' }}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
          <motion.span
            className={wordClass}
            style={{ display: 'inline-block' }}
            initial={{ y: '110%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.75, delay: delay + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* -------------------------------------------------------------- counter */

/** Counts up to `value` the first time it scrolls into view. */
export function Counter({ value = 0, suffix = '', duration = 1600 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    const target = Number(value) || 0;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(target);
      return undefined;
    }

    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {display}
      {suffix ? <span className="suffix">{suffix}</span> : null}
    </span>
  );
}

/* ------------------------------------------------------------- magnetic */

/** Pulls an element toward the pointer — desktop only, no-op on touch. */
export function Magnetic({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });

  const handleMove = (e) => {
    if (window.matchMedia('(hover: none)').matches) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y, display: 'inline-flex' }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------- parallax */

/** Translates children on scroll for depth. */
export function Parallax({ children, distance = 60, className = '' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------- section heading */

export function SectionHead({ eyebrow, title, subtitle, children }) {
  return (
    <div className="section-head">
      <div className="stack" style={{ gap: '0.85rem' }}>
        {eyebrow ? (
          <Reveal>
            <span className="eyebrow">{eyebrow}</span>
          </Reveal>
        ) : null}
        {title ? <h2 className="h2">{<RevealText text={title} />}</h2> : null}
      </div>
      {subtitle ? (
        <Reveal delay={0.12}>
          <p className="lead">{subtitle}</p>
        </Reveal>
      ) : null}
      {children}
    </div>
  );
}

/* --------------------------------------------------------------- image */

/** Image with a shimmer placeholder and a graceful fallback tile. */
export function SmartImage({ src, alt = '', className = '', style, ...rest }) {
  const [state, setState] = useState('loading');

  if (!src || state === 'error') {
    return (
      <div
        className={className}
        style={{
          background: 'linear-gradient(135deg, var(--surface), var(--bg))',
          display: 'grid',
          placeItems: 'center',
          color: 'var(--muted)',
          fontSize: '0.7rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          ...style,
        }}
      >
        {alt ? alt.slice(0, 22) : 'No image'}
      </div>
    );
  }

  return (
    <>
      {state === 'loading' && <div className={`skeleton ${className}`} style={style} aria-hidden="true" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={className}
        style={{ ...style, display: state === 'loading' ? 'none' : undefined }}
        onLoad={() => setState('ready')}
        onError={() => setState('error')}
        {...rest}
      />
    </>
  );
}

/* -------------------------------------------------------------- marquee */

/** Infinite CSS-free marquee — duplicated track animated with framer-motion. */
export function Marquee({ items = [], speed = 26, reverse = false }) {
  if (!items.length) return null;
  const track = (
    <div className="marquee-track" aria-hidden="false">
      {items.map((item, i) => (
        <span className="marquee-item" key={`${item}-${i}`}>
          {item}
          <span className="sep">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee">
      <motion.div
        style={{ display: 'flex' }}
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
      >
        {track}
        {track}
      </motion.div>
    </div>
  );
}
