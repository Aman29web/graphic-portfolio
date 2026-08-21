import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSite } from '../context/SiteContext';
import { Reveal, SectionHead, SmartImage, Icon } from '../components/ui';

/** Swipeable on touch, arrow-driven on desktop, autoplays until interacted with. */
export default function Testimonials() {
  const { testimonials, section } = useSite();
  const meta = section('testimonials');
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const total = testimonials.length;

  const go = useCallback(
    (dir) => {
      setDirection(dir);
      setIndex((v) => (v + dir + total) % total);
    },
    [total]
  );

  useEffect(() => {
    if (paused || total < 2) return undefined;
    const t = setInterval(() => go(1), 6000);
    return () => clearInterval(t);
  }, [paused, go, total]);

  if (!total) return null;

  const current = testimonials[index];

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <section className="section" id="testimonials">
      <div className="container">
        <SectionHead eyebrow={meta.eyebrow} title={meta.label} subtitle={meta.subtitle} />

        <Reveal>
          <div
            className="testimonial-viewport"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current._id}
                className="testimonial-card"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragStart={() => setPaused(true)}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -60) go(1);
                  else if (info.offset.x > 60) go(-1);
                  setPaused(false);
                }}
              >
                <div className="stars" aria-label={`${current.rating} out of 5`}>
                  {Array.from({ length: current.rating || 5 }).map((_, i) => (
                    <Icon.Star key={i} />
                  ))}
                </div>

                <p className="testimonial-quote">“{current.quote}”</p>

                <div className="testimonial-person">
                  {current.avatar && (
                    <SmartImage
                      src={current.avatar}
                      alt={current.name}
                      style={{ width: 46, height: 46, borderRadius: '50%', objectFit: 'cover' }}
                    />
                  )}
                  <div>
                    <div style={{ fontWeight: 600 }}>{current.name}</div>
                    <div className="muted" style={{ fontSize: '0.82rem' }}>
                      {[current.role, current.company].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>

        {total > 1 && (
          <div className="carousel-controls">
            <div className="carousel-dots">
              {testimonials.map((t, i) => (
                <button
                  key={t._id}
                  className={`carousel-dot ${i === index ? 'active' : ''}`}
                  aria-label={`Go to testimonial ${i + 1}`}
                  onClick={() => {
                    setDirection(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                />
              ))}
            </div>

            <div className="carousel-arrows">
              <button className="carousel-arrow" onClick={() => go(-1)} aria-label="Previous testimonial">
                <Icon.ArrowLeft />
              </button>
              <button className="carousel-arrow" onClick={() => go(1)} aria-label="Next testimonial">
                <Icon.ArrowRight />
              </button>
            </div>
          </div>
        )}

        <p className="muted" style={{ fontSize: '0.76rem', marginTop: '0.8rem', textAlign: 'center' }}>
          Swipe to browse · {index + 1} / {total}
        </p>
      </div>
    </section>
  );
}
