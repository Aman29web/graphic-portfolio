import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSite } from '../context/SiteContext';
import { Reveal, SectionHead } from '../components/ui';

const LABELS = { all: 'Everything', work: 'Work', education: 'Education', award: 'Awards' };

export default function Experience() {
  const { experience, section } = useSite();
  const meta = section('experience');

  const types = useMemo(() => {
    const present = [...new Set(experience.map((e) => e.type))];
    return ['all', ...present];
  }, [experience]);

  const [tab, setTab] = useState('all');
  const shown = tab === 'all' ? experience : experience.filter((e) => e.type === tab);

  if (!experience.length) return null;

  return (
    <section className="section" id="experience">
      <div className="container">
        <SectionHead eyebrow={meta.eyebrow} title={meta.label} subtitle={meta.subtitle} />

        {types.length > 2 && (
          <Reveal>
            <div className="exp-tabs">
              {types.map((t) => (
                <button key={t} className={`filter-chip ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                  {LABELS[t] || t}
                </button>
              ))}
            </div>
          </Reveal>
        )}

        <div className="timeline">
          <AnimatePresence mode="popLayout">
            {shown.map((item, i) => (
              <motion.div
                layout
                key={item._id}
                className={`timeline-item ${item.current ? 'current' : ''}`}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.07, 0.5) }}
              >
                <span className="timeline-dot" />
                <span className="timeline-date">
                  {item.startDate}
                  {item.endDate || item.current ? ' — ' : ''}
                  {item.current ? 'Present' : item.endDate}
                  {item.location ? ` · ${item.location}` : ''}
                </span>
                <h3 className="timeline-role">{item.role}</h3>
                <div className="timeline-company">{item.company}</div>
                {item.description && <p className="timeline-desc">{item.description}</p>}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
