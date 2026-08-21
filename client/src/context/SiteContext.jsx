import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { getBootstrap } from '../lib/api';

const SiteContext = createContext(null);

/** Fallbacks so the site still renders something sane if the API is down. */
const FALLBACK = {
  profile: { name: 'Portfolio', designation: '', socials: [], stats: [], marqueeWords: [], heroWords: [], tools: [] },
  settings: {
    logoText: 'Portfolio',
    theme: 'dark',
    accentColor: '#ff5c39',
    accentColor2: '#7c5cff',
    bgColor: '#0a0a0c',
    surfaceColor: '#141419',
    textColor: '#f5f5f7',
    mutedColor: '#9a9aa5',
    fontHeading: "'Syne', sans-serif",
    fontBody: "'Space Grotesk', sans-serif",
    radius: 22,
    showCursor: true,
    showGrain: true,
    showLoader: true,
    showScrollProgress: true,
    showBlobs: true,
    enableContactForm: true,
    navLinks: [],
    sections: [],
    seo: {},
  },
  projects: [],
  services: [],
  skills: [],
  experience: [],
  testimonials: [],
  categories: [],
};

export function SiteProvider({ children }) {
  const [data, setData] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const res = await getBootstrap();
      setData({ ...FALLBACK, ...res, settings: { ...FALLBACK.settings, ...res.settings } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Push the admin-chosen palette into CSS custom properties.
  useEffect(() => {
    const s = data.settings || {};
    const root = document.documentElement;
    const vars = {
      '--accent': s.accentColor,
      '--accent-2': s.accentColor2,
      '--bg': s.bgColor,
      '--surface': s.surfaceColor,
      '--text': s.textColor,
      '--muted': s.mutedColor,
      '--font-heading': s.fontHeading,
      '--font-body': s.fontBody,
      '--radius': `${s.radius ?? 22}px`,
    };
    Object.entries(vars).forEach(([k, v]) => v && root.style.setProperty(k, v));
    root.setAttribute('data-theme', s.theme || 'dark');

    if (s.siteTitle) document.title = s.siteTitle;

    const setMeta = (name, content) => {
      if (!content) return;
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };
    setMeta('description', s.seo?.description);
    setMeta('keywords', s.seo?.keywords);
    setMeta('theme-color', s.bgColor);
  }, [data.settings]);

  const value = useMemo(() => {
    const sections = [...(data.settings?.sections || [])].sort((a, b) => a.order - b.order);
    const sectionMap = Object.fromEntries(sections.map((s) => [s.key, s]));
    const navLinks = [...(data.settings?.navLinks || [])].sort((a, b) => a.order - b.order);

    return {
      ...data,
      sections,
      sectionMap,
      navLinks,
      loading,
      error,
      reload: load,
      /** Section copy helper — never hard-code a heading in a component. */
      section: (key) => sectionMap[key] || { key, label: '', eyebrow: '', subtitle: '', enabled: true },
      isEnabled: (key) => sectionMap[key]?.enabled !== false,
    };
  }, [data, loading, error, load]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used inside <SiteProvider>');
  return ctx;
}
