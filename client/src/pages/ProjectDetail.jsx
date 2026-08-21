import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSite } from '../context/SiteContext';
import api from '../lib/api';
import { Reveal, RevealText, SmartImage, Icon, Magnetic } from '../components/ui';
import { ProjectCard } from '../sections/Work';

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { projects, loading } = useSite();
  const [lightbox, setLightbox] = useState(null);

  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];

  const { prev, next } = useMemo(() => {
    if (index < 0) return { prev: null, next: null };
    return {
      prev: projects[index - 1] || projects[projects.length - 1],
      next: projects[index + 1] || projects[0],
    };
  }, [index, projects]);

  const related = useMemo(
    () => projects.filter((p) => p.slug !== slug && p.category === project?.category).slice(0, 3),
    [projects, slug, project]
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  // Count the view once per mount; failures here should never break the page.
  useEffect(() => {
    if (!slug) return;
    api.post(`/projects/${slug}/view`).catch(() => {});
  }, [slug]);

  useEffect(() => {
    if (project?.title) document.title = `${project.title} — Case study`;
  }, [project]);

  // Close the lightbox with Escape.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setLightbox(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '7rem' }}>
        <div className="skeleton" style={{ height: 40, width: '60%', marginBottom: 20 }} />
        <div className="skeleton" style={{ height: '40vh', borderRadius: 'var(--radius)' }} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="center-state">
        <div className="inner">
          <h1 className="h2">Project not found</h1>
          <p className="muted">This case study may have been unpublished or the link is out of date.</p>
          <button className="btn" onClick={() => navigate('/')}>
            Back to portfolio
          </button>
        </div>
      </div>
    );
  }

  const facts = [
    project.client && { label: 'Client', value: project.client },
    project.year && { label: 'Year', value: project.year },
    project.role && { label: 'Role', value: project.role },
    project.category && { label: 'Category', value: project.category },
  ].filter(Boolean);

  const blocks = [
    project.longDescription && { title: 'Overview', body: project.longDescription },
    project.challenge && { title: 'The challenge', body: project.challenge },
    project.solution && { title: 'The approach', body: project.solution },
    project.outcome && { title: 'The outcome', body: project.outcome },
  ].filter(Boolean);

  return (
    <main style={{ '--accent': project.accent || undefined }}>
      <section className="project-hero container">
        <Reveal>
          <Link to="/#work" className="pill" style={{ marginBottom: '1.2rem', display: 'inline-flex' }}>
            <Icon.ArrowLeft width="13" height="13" /> All work
          </Link>
        </Reveal>

        <div className="hero-meta" style={{ marginTop: '0.8rem' }}>
          <span className="pill" style={{ borderColor: project.accent, color: project.accent }}>
            {project.category}
          </span>
          {project.tags?.map((t) => (
            <span className="pill" key={t}>
              {t}
            </span>
          ))}
        </div>

        <h1 className="h1" style={{ marginBottom: '1rem' }}>
          <RevealText text={project.title} />
        </h1>

        <Reveal delay={0.12}>
          <p className="lead">{project.description}</p>
        </Reveal>

        {(project.link || project.extraLinks?.length > 0) && (
          <Reveal delay={0.2}>
            <div className="hero-actions" style={{ marginTop: '1.6rem' }}>
              {project.link && (
                <Magnetic>
                  <a className="btn" href={project.link} target="_blank" rel="noreferrer">
                    {project.linkLabel || 'View live'} <Icon.Arrow />
                  </a>
                </Magnetic>
              )}
              {project.extraLinks?.map((l) => (
                <a key={l.url} className="btn btn-outline" href={l.url} target="_blank" rel="noreferrer">
                  {l.label} <Icon.Arrow />
                </a>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal delay={0.16}>
          <SmartImage
            src={project.coverImage}
            alt={project.title}
            className="project-hero-cover"
            onClick={() => setLightbox(project.coverImage)}
            style={{ cursor: 'zoom-in' }}
          />
        </Reveal>
      </section>

      <div className="container">
        {facts.length > 0 && (
          <Reveal>
            <div className="project-facts">
              {facts.map((f) => (
                <div className="project-fact" key={f.label}>
                  <div className="label">{f.label}</div>
                  <div className="value">{f.value}</div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        <div style={{ maxWidth: '70ch' }}>
          {blocks.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.06} className="project-block">
              <h3 className="h3">{b.title}</h3>
              <p className="muted">{b.body}</p>
            </Reveal>
          ))}

          {project.tools?.length > 0 && (
            <Reveal className="project-block">
              <h3 className="h3">Tools used</h3>
              <div className="tool-chips" style={{ marginTop: '0.8rem' }}>
                {project.tools.map((t) => (
                  <span className="pill" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
          )}
        </div>

        {project.gallery?.length > 0 && (
          <div className="project-gallery">
            {project.gallery.map((src, i) => (
              <Reveal key={src + i} delay={Math.min(i * 0.06, 0.35)}>
                <SmartImage
                  src={src}
                  alt={`${project.title} — image ${i + 1}`}
                  onClick={() => setLightbox(src)}
                  style={{ width: '100%', cursor: 'zoom-in' }}
                />
              </Reveal>
            ))}
          </div>
        )}

        {related.length > 0 && (
          <section style={{ marginTop: '4rem' }}>
            <h3 className="h3" style={{ marginBottom: '1.4rem' }}>
              More {project.category.toLowerCase()} work
            </h3>
            <div className="work-grid">
              {related.map((p, i) => (
                <ProjectCard key={p._id} project={p} index={i} />
              ))}
            </div>
          </section>
        )}

        <nav className="project-nav">
          {prev && (
            <Link to={`/work/${prev.slug}`} className="stack" style={{ gap: 2 }}>
              <span className="label muted" style={{ fontSize: '0.7rem', letterSpacing: '0.14em' }}>
                ← PREVIOUS
              </span>
              <strong>{prev.title}</strong>
            </Link>
          )}
          {next && (
            <Link to={`/work/${next.slug}`} className="stack" style={{ gap: 2, textAlign: 'right', marginLeft: 'auto' }}>
              <span className="label muted" style={{ fontSize: '0.7rem', letterSpacing: '0.14em' }}>
                NEXT →
              </span>
              <strong>{next.title}</strong>
            </Link>
          )}
        </nav>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.img
              src={lightbox}
              alt=""
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
