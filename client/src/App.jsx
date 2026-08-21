import { useEffect, useState, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { useSite } from './context/SiteContext';
import Navbar, { MobileDock } from './components/Navbar';
import { Loader, Cursor, ScrollProgress, BackToTop } from './components/Chrome';
import Footer from './sections/Footer';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';

// The admin bundle only loads for people who actually open /admin.
const AdminApp = lazy(() => import('./admin/AdminApp'));

function NotFound() {
  return (
    <div className="center-state">
      <div className="inner">
        <h1 className="display gradient-text">404</h1>
        <p className="lead">This page went off-canvas.</p>
        <Link className="btn" to="/">
          Back home
        </Link>
      </div>
    </div>
  );
}

function Maintenance() {
  const { settings, profile } = useSite();
  return (
    <div className="center-state">
      <div className="inner">
        <span className="eyebrow">Hold tight</span>
        <h1 className="h2">{profile.name}</h1>
        <p className="lead">{settings.maintenanceText}</p>
        <Link className="btn btn-outline btn-sm" to="/admin">
          Admin login
        </Link>
      </div>
    </div>
  );
}

/** Public site shell — chrome + animated route transitions. */
function PublicSite() {
  const { settings, loading, error } = useSite();
  const location = useLocation();
  const [booted, setBooted] = useState(false);

  const showLoader = settings.showLoader && !booted;

  if (error && !loading) {
    return (
      <div className="center-state">
        <div className="inner">
          <span className="eyebrow">Connection problem</span>
          <h1 className="h3">Could not reach the API</h1>
          <p className="muted">{error}</p>
          <p className="muted" style={{ fontSize: '0.85rem' }}>
            Start the backend with <code>npm run dev</code> inside the <code>server</code> folder, then reload.
          </p>
          <button className="btn" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (settings.maintenanceMode) return <Maintenance />;

  return (
    <>
      <AnimatePresence>{showLoader && <Loader onDone={() => setBooted(true)} />}</AnimatePresence>

      {settings.showCursor && <Cursor />}
      {settings.showGrain && <div className="grain" aria-hidden="true" />}
      {settings.showScrollProgress && <ScrollProgress />}

      <Navbar />

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.32 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/work/:slug" element={<ProjectDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      <Footer />
      <MobileDock />
      <BackToTop />
    </>
  );
}

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  // The admin panel keeps its own light UI regardless of the site theme.
  useEffect(() => {
    document.body.classList.toggle('admin-mode', isAdmin);
  }, [isAdmin]);

  if (isAdmin) {
    return (
      <Suspense
        fallback={
          <div className="center-state">
            <div className="inner">
              <div className="skeleton" style={{ width: 180, height: 12 }} />
              <p className="muted">Loading admin…</p>
            </div>
          </div>
        }
      >
        <AdminApp />
      </Suspense>
    );
  }

  return <PublicSite />;
}
