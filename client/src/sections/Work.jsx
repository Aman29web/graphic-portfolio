import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSite } from '../context/SiteContext';
import { Reveal, SectionHead, SmartImage, Icon } from '../components/ui';

const PAGE = 6;

export function ProjectCard({ project, index = 0 }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.4), ease: [0.22, 1, 0.36, 1] }}
      className="project-card"
      style={{ '--card-accent': project.accent }}
    >
      <Link to={`/work/${project.slug}`} aria-label={`Open case study: ${project.title}`}>
        <div className="project-card-media">
          <span className="project-card-badge">{project.category}</span>
          {project.featured && (
            <span className="project-card-featured" style={{ background: project.accent || 'var(--accent)' }}>
              ★
            </span>
          )}
          <SmartImage
            src={project.coverImage}
            alt={project.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div className="project-card-body">
          <div className="project-card-meta">
            {project.client && <span>{project.client}</span>}
            {project.client && project.year && <span>·</span>}
            {project.year && <span>{project.year}</span>}
          </div>
          <h3 className="project-card-title">{project.title}</h3>
          <p className="project-card-desc">{project.description}</p>
          <span className="project-card-arrow" style={project.accent ? { color: project.accent } : undefined}>
            View case study <Icon.Arrow />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Work() {
  const { projects, categories, section } = useSite();
  const meta = section('work');
  const [filter, setFilter] = useState('All');
  const [visible, setVisible] = useState(PAGE);

  const filtered = useMemo(
    () => (filter === 'All' ? projects : projects.filter((p) => p.category === filter)),
    [projects, filter]
  );

  const shown = filtered.slice(0, visible);

  if (!projects.length) return null;

  const chips = ['All', ...categories];

  return (
    <section className="section" id="work">
      <div className="container">
        <SectionHead eyebrow={meta.eyebrow} title={meta.label} subtitle={meta.subtitle} />

        <Reveal>
          <div className="filter-bar" role="tablist" aria-label="Filter projects by category">
            {chips.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={filter === cat}
                className={`filter-chip ${filter === cat ? 'active' : ''}`}
                onClick={() => {
                  setFilter(cat);
                  setVisible(PAGE);
                }}
              >
                {cat}
                {cat !== 'All' && (
                  <span style={{ opacity: 0.55, marginLeft: 6, fontSize: '0.72em' }}>
                    {projects.filter((p) => p.category === cat).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </Reveal>

        <motion.div layout className="work-grid">
          <AnimatePresence mode="popLayout">
            {shown.map((project, i) => (
              <ProjectCard key={project._id} project={project} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {!shown.length && (
          <p className="muted" style={{ textAlign: 'center', padding: '2rem 0' }}>
            No projects in this category yet.
          </p>
        )}

        {visible < filtered.length && (
          <div className="load-more">
            <button className="btn btn-outline" onClick={() => setVisible((v) => v + PAGE)}>
              Load more ({filtered.length - visible} left)
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
