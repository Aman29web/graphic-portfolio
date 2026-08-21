import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { useSite } from '../context/SiteContext';
import { Icon } from './ui';

/* --------------------------------------------------------------- loader */

export function Loader({ onDone }) {
  const { settings, profile } = useSite();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let value = 0;
    const timer = setInterval(() => {
      value = Math.min(value + Math.random() * 18 + 6, 100);
      setProgress(Math.round(value));
      if (value >= 100) {
        clearInterval(timer);
        setTimeout(onDone, 480);
      }
    }, 160);
    return () => clearInterval(timer);
  }, [onDone]);

  return (
    <motion.div className="loader" exit={{ y: '-100%' }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}>
      <motion.div
        className="loader-name"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {profile.name || settings.logoText}
      </motion.div>

      <div className="loader-bar">
        <motion.span initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ ease: 'easeOut' }} />
      </div>

      <div className="loader-text">
        {settings.loaderText} <span className="loader-count">{progress}%</span>
      </div>
    </motion.div>
  );
}

/* --------------------------------------------------------------- cursor */

export function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return undefined;

    const pos = { x: 0, y: 0 };
    const ringPos = { x: 0, y: 0 };
    let raf;

    const move = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      setVisible(true);
      if (dot.current) dot.current.style.transform = `translate(${pos.x - 3.5}px, ${pos.y - 3.5}px)`;

      const el = e.target.closest('a, button, [data-cursor="hover"], input, textarea, select');
      setHovering(!!el);
    };

    // Ring trails the dot with simple lerp easing.
    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;
      if (ring.current) ring.current.style.transform = `translate(${ringPos.x - 19}px, ${ringPos.y - 19}px)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', move);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      <div ref={dot} className="cursor-dot" style={{ opacity: hovering ? 0 : 1, transition: 'opacity .2s' }} />
      <div
        ref={ring}
        className="cursor-ring"
        style={{
          transition: 'width .3s, height .3s, opacity .2s, margin .3s',
          width: hovering ? 58 : 38,
          height: hovering ? 58 : 38,
          margin: hovering ? '-10px 0 0 -10px' : 0,
          opacity: 0.85,
        }}
      />
    </>
  );
}

/* ------------------------------------------------------- scroll progress */

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });
  return <motion.div className="scroll-progress" style={{ scaleX }} />;
}

/* ------------------------------------------------------------- back top */

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          className="to-top"
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Icon.Up />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* --------------------------------------------------------- ambient blobs */

export function Blobs() {
  return (
    <>
      <motion.div
        className="blob"
        style={{ width: 320, height: 320, background: 'var(--accent)', top: '-8%', right: '-18%' }}
        animate={{ scale: [1, 1.18, 1], x: [0, 24, 0], y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="blob"
        style={{ width: 260, height: 260, background: 'var(--accent-2)', bottom: '4%', left: '-22%' }}
        animate={{ scale: [1, 1.25, 1], x: [0, -20, 0], y: [0, -26, 0] }}
        transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />
    </>
  );
}
