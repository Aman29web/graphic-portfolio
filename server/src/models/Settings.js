import mongoose from 'mongoose';

/**
 * Singleton document that drives site chrome: colors, fonts, nav, section
 * order/visibility, SEO and feature toggles. The React app reads this on boot
 * and writes the palette into CSS custom properties.
 */
const settingsSchema = new mongoose.Schema(
  {
    siteTitle: { type: String, default: 'Shubh Singh — Graphic Designer' },
    logoText: { type: String, default: 'Shubh' },
    logoImage: { type: String, default: '' },
    favicon: { type: String, default: '' },

    // Theme
    theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
    accentColor: { type: String, default: '#ff5c39' },
    accentColor2: { type: String, default: '#7c5cff' },
    bgColor: { type: String, default: '#0a0a0c' },
    surfaceColor: { type: String, default: '#131317' },
    textColor: { type: String, default: '#f4f4f5' },
    mutedColor: { type: String, default: '#9b9ba4' },
    fontHeading: { type: String, default: "'Syne', sans-serif" },
    fontBody: { type: String, default: "'Space Grotesk', sans-serif" },
    radius: { type: Number, default: 22 },

    // Feature toggles
    showCursor: { type: Boolean, default: true },
    showGrain: { type: Boolean, default: true },
    showLoader: { type: Boolean, default: true },
    showScrollProgress: { type: Boolean, default: true },
    showBlobs: { type: Boolean, default: true },
    enableContactForm: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false },
    maintenanceText: { type: String, default: 'Portfolio is getting a fresh coat of paint. Back soon.' },
    loaderText: { type: String, default: 'Designing something worth your scroll' },

    // Navigation & sections
    navLinks: {
      type: [
        {
          label: { type: String, default: '' },
          href: { type: String, default: '' },
          order: { type: Number, default: 0 },
        },
      ],
      default: [],
    },
    sections: {
      type: [
        {
          key: { type: String, default: '' },
          label: { type: String, default: '' },
          eyebrow: { type: String, default: '' },
          subtitle: { type: String, default: '' },
          enabled: { type: Boolean, default: true },
          order: { type: Number, default: 0 },
        },
      ],
      default: [],
    },

    // Call to action / footer
    ctaHeading: { type: String, default: "Let's make something loud." },
    ctaSubtext: { type: String, default: '' },
    ctaButtonText: { type: String, default: 'Start a project' },
    footerNote: { type: String, default: '' },
    footerCredit: { type: String, default: '' },

    // SEO
    seo: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      keywords: { type: String, default: '' },
      ogImage: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Settings', settingsSchema);
