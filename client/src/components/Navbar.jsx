import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSite } from '../context/SiteContext';
import { Icon, Magnetic } from './ui';

/**
 * Scrolls to a hash target on the home page, navigating home first when the
 * user is deep inside a case study.
 */
function useSectionNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (href) => {
    const id = href.replace('#', '');
    if (pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };
}

export default function Navbar() {
  const { settings, navLinks, profile } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const goTo = useSectionNav();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the nav item for whichever section owns the viewport centre.
  useEffect(() => {
    if (pathname !== '/') return undefined;
    const ids = navLinks.map((l) => l.href.replace('#', '')).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [navLinks, pathname]);

  // Lock body scroll while the fullscreen menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleClick = (href) => {
    setOpen(false);
    setTimeout(() => goTo(href), open ? 380 : 0);
  };

  return (
    <>
      <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          {settings.logoImage ? (
            <img src={settings.logoImage} alt={settings.logoText || profile.name} />
          ) : (
            <>
              {settings.logoText || profile.name}
              <span className="dot" />
            </>
          )}
        </Link>

        <nav className="nav-links">
          {navLinks.map((link) => (
            <button
              key={link.href + link.label}
              className={`nav-link ${active === link.href.replace('#', '') && pathname === '/' ? 'active' : ''}`}
              onClick={() => handleClick(link.href)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="nav-right">
          <Magnetic className="nav-cta">
            <a className="btn btn-sm" href={`mailto:${profile.email}`}>
              {settings.ctaButtonText || 'Get in touch'}
              <Icon.Arrow />
            </a>
          </Magnetic>
          <button
            className={`burger ${open ? 'open' : ''}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav className="stack">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href + link.label}
                  className="mobile-menu-link"
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22 + i * 0.07, duration: 0.5 }}
                  onClick={() => handleClick(link.href)}
                >
                  <span className="idx">0{i + 1}</span>
                  {link.label}
                </motion.button>
              ))}
            </nav>

            <motion.div
              className="mobile-menu-foot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="lead" style={{ color: 'var(--text)' }}>
                  {profile.email}
                </a>
              )}
              <div className="footer-socials">
                {(profile.socials || []).map((s) => (
                  <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="social-btn">
                    {s.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------ mobile dock */

const DOCK_ICONS = {
  '#home': Icon.Home,
  '#about': Icon.User,
  '#work': Icon.Grid,
  '#services': Icon.Sparkle,
  '#contact': Icon.Mail,
};

export function MobileDock() {
  const { navLinks } = useSite();
  const goTo = useSectionNav();
  const [active, setActive] = useState('#home');
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== '/') return undefined;
    const onScroll = () => {
      const mid = window.scrollY + window.innerHeight / 2;
      let current = navLinks[0]?.href || '#home';
      navLinks.forEach((link) => {
        const el = document.getElementById(link.href.replace('#', ''));
        if (el && el.offsetTop <= mid) current = link.href;
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [navLinks, pathname]);

  const items = navLinks.filter((l) => DOCK_ICONS[l.href]).slice(0, 5);
  if (!items.length) return null;

  return (
    <motion.nav
      className="dock"
      initial={{ y: 90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Section navigation"
    >
      {items.map((link) => {
        const IconCmp = DOCK_ICONS[link.href];
        const isActive = active === link.href && pathname === '/';
        return (
          <button
            key={link.href}
            className={`dock-item ${isActive ? 'active' : ''}`}
            onClick={() => goTo(link.href)}
            aria-label={link.label}
            aria-current={isActive ? 'true' : undefined}
          >
            <IconCmp />
            <span>{link.label}</span>
          </button>
        );
      })}
    </motion.nav>
  );
}
