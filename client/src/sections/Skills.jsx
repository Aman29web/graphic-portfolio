import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useSite } from '../context/SiteContext';
import { Reveal, SectionHead } from '../components/ui';

export default function Skills() {
  const { skills, section } = useSite();
  const meta = section('skills');

  const categories = useMemo(() => {
    const set = [...new Set(skills.map((s) => s.category).filter(Boolean))];
    return ['All', ...set];
  }, [skills]);

  const [tab, setTab] = useState('All');
  const shown = tab === 'All' ? skills : skills.filter((s) => s.category === tab);

  if (!skills.length) return null;

  return (
    <section className="section" id="skills">
      <div className="container">
        <SectionHead eyebrow={meta.eyebrow} title={meta.label} subtitle={meta.subtitle} />

        {categories.length > 2 && (
          <Reveal>
            <div className="skills-tabs">
              {categories.map((c) => (
                <button
                  key={c}
                  className={`filter-chip ${tab === c ? 'active' : ''}`}
                  onClick={() => setTab(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </Reveal>
        )}

        <div className="skills-grid">
          {shown.map((skill, i) => (
            <Reveal key={skill._id} delay={Math.min(i * 0.05, 0.4)} className="skill">
              <div className="skill-head">
                <span className="name">{skill.name}</span>
                <span className="pct">{skill.level}%</span>
              </div>
              <div className="skill-bar">
                <motion.div
                  className="skill-fill"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 1.1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
