import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSite } from '../context/SiteContext';
import { Reveal, SectionHead, SmartImage, Icon } from '../components/ui';

/**
 * Accordion list rather than a card grid — it reads far better on a phone,
 * where six stacked cards would mean six screens of scrolling.
 */
export default function Services() {
  const { services, section } = useSite();
  const meta = section('services');
  const [openId, setOpenId] = useState(services[0]?._id || null);

  if (!services.length) return null;

  return (
    <section className="section" id="services">
      <div className="container">
        <SectionHead eyebrow={meta.eyebrow} title={meta.label} subtitle={meta.subtitle} />

        <div className="services-list">
          {services.map((service, i) => {
            const isOpen = openId === service._id;
            return (
              <Reveal key={service._id} delay={i * 0.05}>
                <div
                  className={`service-row ${isOpen ? 'open' : ''}`}
                  onClick={() => setOpenId(isOpen ? null : service._id)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setOpenId(isOpen ? null : service._id);
                    }
                  }}
                >
                  <div className="service-row-head">
                    <span className="service-icon" style={service.accent ? { color: service.accent } : undefined}>
                      {service.icon || '✦'}
                    </span>
                    <h3 className="service-title">{service.title}</h3>
                    <span className="service-toggle">
                      <Icon.Plus />
                    </span>
                  </div>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className="service-body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="service-body-inner">
                          <div className="stack" style={{ gap: '1rem' }}>
                            <p className="muted">{service.description}</p>

                            {service.features?.length > 0 && (
                              <div className="service-features">
                                {service.features.map((f) => (
                                  <span className="service-feature" key={f}>
                                    {f}
                                  </span>
                                ))}
                              </div>
                            )}

                            {service.price && <span className="service-price">{service.price}</span>}
                          </div>

                          {service.image && (
                            <SmartImage src={service.image} alt={service.title} className="service-thumb" />
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
