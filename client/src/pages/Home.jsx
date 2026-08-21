import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import { Marquee } from '../components/ui';

import Hero from '../sections/Hero';
import { About, Stats } from '../sections/About';
import Services from '../sections/Services';
import Work from '../sections/Work';
import Skills from '../sections/Skills';
import Experience from '../sections/Experience';
import Testimonials from '../sections/Testimonials';
import Contact from '../sections/Contact';

export default function Home() {
  const { sections, profile } = useSite();
  const { hash } = useLocation();

  const scrollTo = (href) => {
    const el = document.getElementById(href.replace('#', ''));
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
  };

  // Support deep links like /#work coming from the case-study pages.
  useEffect(() => {
    if (!hash) return;
    const t = setTimeout(() => scrollTo(hash), 260);
    return () => clearTimeout(t);
  }, [hash]);

  /** Section order and visibility both come from Settings in the admin panel. */
  const RENDERERS = {
    hero: () => <Hero onScrollTo={scrollTo} />,
    marquee: () => <Marquee items={profile.marqueeWords || []} />,
    about: () => <About />,
    stats: () => <Stats />,
    services: () => <Services />,
    work: () => <Work />,
    skills: () => <Skills />,
    experience: () => <Experience />,
    testimonials: () => <Testimonials />,
    contact: () => <Contact />,
  };

  const ordered = sections.length
    ? sections
    : Object.keys(RENDERERS).map((key, i) => ({ key, enabled: true, order: i }));

  return (
    <main>
      {ordered
        .filter((s) => s.enabled !== false && RENDERERS[s.key])
        .map((s) => (
          <div key={s.key}>{RENDERERS[s.key]()}</div>
        ))}
    </main>
  );
}
