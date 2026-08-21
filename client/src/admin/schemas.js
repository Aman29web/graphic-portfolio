/**
 * Field definitions for every editable content type.
 *
 * Adding a field to the site is a two-step job: add it to the Mongoose model
 * on the server, then add it here. No admin screens need to be written.
 */

/* ------------------------------------------------------------ singletons */

export const profileSchema = [
  {
    title: 'Identity',
    columns: 2,
    fields: [
      { name: 'name', label: 'Full name', placeholder: 'Shubh Singh' },
      { name: 'designation', label: 'Designation', placeholder: 'Graphic Designer' },
      { name: 'tagline', label: 'Hero tagline', type: 'textarea', full: true, hint: 'The big line under your name.' },
      {
        name: 'heroWords',
        label: 'Rotating hero words',
        type: 'tags',
        full: true,
        hint: 'Cycles in the headline: "Shubh Singh makes ___".',
      },
    ],
  },
  {
    title: 'Bio',
    fields: [
      { name: 'shortBio', label: 'Short bio', type: 'textarea', hint: 'One or two sentences, used in previews.' },
      {
        name: 'longBio',
        label: 'Full bio',
        type: 'longtext',
        hint: 'Shown in the About section. Leave a blank line between paragraphs.',
      },
    ],
  },
  {
    title: 'Images',
    columns: 2,
    fields: [
      { name: 'avatar', label: 'Avatar', type: 'image' },
      { name: 'portrait', label: 'About portrait', type: 'image' },
      { name: 'heroImages', label: 'Hero images (up to 3)', type: 'imageList', full: true },
    ],
  },
  {
    title: 'Contact & availability',
    columns: 2,
    fields: [
      { name: 'email', label: 'Email' },
      { name: 'phone', label: 'Phone' },
      { name: 'location', label: 'Location' },
      { name: 'yearsExperience', label: 'Years of experience', type: 'number' },
      { name: 'resumeUrl', label: 'Resume / CV link' },
      { name: 'availabilityText', label: 'Availability text' },
      { name: 'available', label: 'Currently available for work', type: 'boolean', full: true },
    ],
  },
  {
    title: 'Marquee & tools',
    fields: [
      { name: 'marqueeWords', label: 'Scrolling marquee words', type: 'tags' },
      { name: 'tools', label: 'Software you use', type: 'tags' },
    ],
  },
  {
    title: 'Stats',
    fields: [
      {
        name: 'stats',
        label: 'Stats',
        type: 'repeater',
        itemLabel: (it) => it.label || 'Stat',
        fields: [
          { name: 'label', label: 'Label' },
          { name: 'value', label: 'Value', type: 'number' },
          { name: 'suffix', label: 'Suffix', placeholder: '+' },
        ],
      },
    ],
  },
  {
    title: 'Social links',
    fields: [
      {
        name: 'socials',
        label: 'Socials',
        type: 'repeater',
        itemLabel: (it) => it.label || 'Link',
        fields: [
          { name: 'label', label: 'Label', placeholder: 'Behance' },
          { name: 'url', label: 'URL', placeholder: 'https://…' },
        ],
      },
    ],
  },
];

export const settingsSchema = [
  {
    title: 'Site',
    columns: 2,
    fields: [
      { name: 'siteTitle', label: 'Browser title' },
      { name: 'logoText', label: 'Logo text' },
      { name: 'logoImage', label: 'Logo image (optional)', type: 'image', full: true },
    ],
  },
  {
    title: 'Colours',
    columns: 2,
    note: 'Applies instantly across the site',
    fields: [
      { name: 'theme', label: 'Theme', type: 'select', options: ['dark', 'light'] },
      { name: 'radius', label: 'Corner radius (px)', type: 'number', min: 0, max: 40 },
      { name: 'accentColor', label: 'Accent', type: 'color' },
      { name: 'accentColor2', label: 'Secondary accent', type: 'color' },
      { name: 'bgColor', label: 'Background', type: 'color' },
      { name: 'surfaceColor', label: 'Surface / cards', type: 'color' },
      { name: 'textColor', label: 'Text', type: 'color' },
      { name: 'mutedColor', label: 'Muted text', type: 'color' },
    ],
  },
  {
    title: 'Typography',
    columns: 2,
    fields: [
      {
        name: 'fontHeading',
        label: 'Heading font',
        type: 'select',
        options: [
          { value: "'Fraunces', Georgia, serif", label: 'Fraunces (soft & characterful)' },
          { value: "'Plus Jakarta Sans', sans-serif", label: 'Plus Jakarta Sans (clean)' },
          { value: "'Caveat', cursive", label: 'Caveat (handwritten)' },
          { value: "'Syne', sans-serif", label: 'Syne (bold & graphic)' },
        ],
      },
      {
        name: 'fontBody',
        label: 'Body font',
        type: 'select',
        options: [
          { value: "'Plus Jakarta Sans', system-ui, sans-serif", label: 'Plus Jakarta Sans' },
          { value: "'Fraunces', Georgia, serif", label: 'Fraunces' },
          { value: "'Syne', sans-serif", label: 'Syne' },
        ],
      },
    ],
  },
  {
    title: 'Features',
    columns: 2,
    fields: [
      { name: 'showLoader', label: 'Intro loading screen', type: 'boolean' },
      { name: 'showCursor', label: 'Custom cursor (desktop)', type: 'boolean' },
      { name: 'showGrain', label: 'Film grain overlay', type: 'boolean' },
      { name: 'showScrollProgress', label: 'Scroll progress bar', type: 'boolean' },
      { name: 'showBlobs', label: 'Animated gradient blobs', type: 'boolean' },
      { name: 'enableContactForm', label: 'Contact form', type: 'boolean' },
      { name: 'loaderText', label: 'Loader message', full: true },
    ],
  },
  {
    title: 'Navigation',
    fields: [
      {
        name: 'navLinks',
        label: 'Nav links',
        type: 'repeater',
        hint: 'Use #home, #about, #work, #services, #contact so the mobile dock picks up icons.',
        itemLabel: (it) => it.label || 'Link',
        fields: [
          { name: 'label', label: 'Label' },
          { name: 'href', label: 'Target', placeholder: '#work' },
        ],
      },
    ],
  },
  {
    title: 'Sections',
    fields: [
      {
        name: 'sections',
        label: 'Page sections',
        type: 'repeater',
        hint: 'Reorder with the arrows; toggle Enabled to hide a section entirely.',
        itemLabel: (it) => `${it.key} — ${it.label || ''}`,
        fields: [
          { name: 'key', label: 'Key (do not change)' },
          { name: 'label', label: 'Heading' },
          { name: 'eyebrow', label: 'Eyebrow' },
          { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
          { name: 'enabled', label: 'Enabled', type: 'boolean' },
        ],
      },
    ],
  },
  {
    title: 'Call to action & footer',
    columns: 2,
    fields: [
      { name: 'ctaHeading', label: 'Contact heading', full: true },
      { name: 'ctaSubtext', label: 'Contact subtext', type: 'textarea', full: true },
      { name: 'ctaButtonText', label: 'CTA button text' },
      { name: 'footerNote', label: 'Footer note' },
      { name: 'footerCredit', label: 'Footer credit line', full: true },
    ],
  },
  {
    title: 'SEO',
    fields: [
      { name: 'seo.title', label: 'Meta title' },
      { name: 'seo.description', label: 'Meta description', type: 'textarea' },
      { name: 'seo.keywords', label: 'Keywords' },
      { name: 'seo.ogImage', label: 'Share image', type: 'image' },
    ],
  },
  {
    title: 'Maintenance',
    fields: [
      { name: 'maintenanceMode', label: 'Maintenance mode (hides the public site)', type: 'boolean' },
      { name: 'maintenanceText', label: 'Maintenance message', type: 'textarea' },
    ],
  },
];

/* ----------------------------------------------------------- collections */

export const projectSchema = [
  {
    title: 'Basics',
    columns: 2,
    fields: [
      { name: 'title', label: 'Project title', full: true, placeholder: 'Kettle & Co. — Tea Brand Identity' },
      { name: 'category', label: 'Category', placeholder: 'Branding' },
      { name: 'client', label: 'Client' },
      { name: 'year', label: 'Year', placeholder: '2025' },
      { name: 'role', label: 'Your role', placeholder: 'Brand Identity, Packaging' },
      { name: 'description', label: 'Short description', type: 'textarea', full: true, hint: 'Shown on the project card.' },
    ],
  },
  {
    title: 'Case study',
    fields: [
      { name: 'longDescription', label: 'Overview', type: 'longtext' },
      { name: 'challenge', label: 'The challenge', type: 'textarea' },
      { name: 'solution', label: 'The approach', type: 'textarea' },
      { name: 'outcome', label: 'The outcome', type: 'textarea' },
    ],
  },
  {
    title: 'Media',
    fields: [
      { name: 'coverImage', label: 'Cover image', type: 'image' },
      { name: 'gallery', label: 'Gallery', type: 'imageList' },
    ],
  },
  {
    title: 'Links',
    columns: 2,
    fields: [
      { name: 'link', label: 'Main link', placeholder: 'https://behance.net/…' },
      { name: 'linkLabel', label: 'Link button text', placeholder: 'View live' },
      {
        name: 'extraLinks',
        label: 'Extra links',
        type: 'repeater',
        itemLabel: (it) => it.label || 'Link',
        fields: [
          { name: 'label', label: 'Label' },
          { name: 'url', label: 'URL' },
        ],
      },
    ],
  },
  {
    title: 'Meta',
    columns: 2,
    fields: [
      { name: 'tools', label: 'Tools used', type: 'tags', full: true },
      { name: 'tags', label: 'Tags', type: 'tags', full: true },
      { name: 'accent', label: 'Accent colour', type: 'color' },
      { name: 'order', label: 'Sort order', type: 'number' },
      { name: 'featured', label: 'Featured', type: 'boolean' },
      { name: 'published', label: 'Published', type: 'boolean' },
    ],
  },
];

export const serviceSchema = [
  {
    title: 'Service',
    columns: 2,
    fields: [
      { name: 'title', label: 'Title', full: true },
      { name: 'icon', label: 'Icon character', placeholder: '◈', hint: 'Any emoji or symbol.' },
      { name: 'price', label: 'Price', placeholder: 'From ₹45,000' },
      { name: 'description', label: 'Description', type: 'textarea', full: true },
      { name: 'features', label: 'What is included', type: 'tags', full: true },
      { name: 'image', label: 'Image', type: 'image', full: true },
      { name: 'accent', label: 'Accent colour', type: 'color' },
      { name: 'order', label: 'Sort order', type: 'number' },
      { name: 'published', label: 'Published', type: 'boolean', full: true },
    ],
  },
];

export const skillSchema = [
  {
    title: 'Skill',
    columns: 2,
    fields: [
      { name: 'name', label: 'Skill name', full: true },
      { name: 'category', label: 'Category', placeholder: 'Software' },
      { name: 'order', label: 'Sort order', type: 'number' },
      { name: 'level', label: 'Proficiency', type: 'range', min: 0, max: 100, full: true },
      { name: 'published', label: 'Published', type: 'boolean', full: true },
    ],
  },
];

export const experienceSchema = [
  {
    title: 'Entry',
    columns: 2,
    fields: [
      { name: 'role', label: 'Role / title', full: true },
      { name: 'company', label: 'Company / institution' },
      {
        name: 'type',
        label: 'Type',
        type: 'select',
        options: [
          { value: 'work', label: 'Work' },
          { value: 'education', label: 'Education' },
          { value: 'award', label: 'Award' },
        ],
      },
      { name: 'startDate', label: 'Start', placeholder: '2022' },
      { name: 'endDate', label: 'End', placeholder: '2024' },
      { name: 'location', label: 'Location' },
      { name: 'order', label: 'Sort order', type: 'number' },
      { name: 'description', label: 'Description', type: 'textarea', full: true },
      { name: 'current', label: 'Currently here', type: 'boolean' },
      { name: 'published', label: 'Published', type: 'boolean' },
    ],
  },
];

export const testimonialSchema = [
  {
    title: 'Testimonial',
    columns: 2,
    fields: [
      { name: 'name', label: 'Client name', full: true },
      { name: 'role', label: 'Their role' },
      { name: 'company', label: 'Company' },
      { name: 'quote', label: 'Quote', type: 'textarea', full: true },
      { name: 'avatar', label: 'Photo', type: 'image', full: true },
      { name: 'rating', label: 'Rating', type: 'number', min: 1, max: 5 },
      { name: 'order', label: 'Sort order', type: 'number' },
      { name: 'published', label: 'Published', type: 'boolean', full: true },
    ],
  },
];

/* --------------------------------------------------------- collection map */

export const COLLECTIONS = {
  projects: {
    endpoint: '/projects',
    title: 'Projects',
    singular: 'Project',
    schema: projectSchema,
    defaults: { published: true, featured: false, accent: '#ff5c39', category: 'Branding', gallery: [], tools: [], tags: [] },
    display: (item) => ({
      title: item.title,
      sub: [item.category, item.client, item.year].filter(Boolean).join(' · '),
      thumb: item.coverImage,
    }),
  },
  services: {
    endpoint: '/services',
    title: 'Services',
    singular: 'Service',
    schema: serviceSchema,
    defaults: { published: true, icon: '✦', features: [] },
    display: (item) => ({ title: item.title, sub: item.price || item.description, thumb: item.image, icon: item.icon }),
  },
  skills: {
    endpoint: '/skills',
    title: 'Skills',
    singular: 'Skill',
    schema: skillSchema,
    defaults: { published: true, level: 80, category: 'Software' },
    display: (item) => ({ title: item.name, sub: `${item.category} · ${item.level}%`, icon: '▰' }),
  },
  experience: {
    endpoint: '/experience',
    title: 'Experience',
    singular: 'Entry',
    schema: experienceSchema,
    defaults: { published: true, type: 'work', current: false },
    display: (item) => ({
      title: item.role,
      sub: [item.company, `${item.startDate}${item.current ? ' — Present' : item.endDate ? ` — ${item.endDate}` : ''}`]
        .filter(Boolean)
        .join(' · '),
      icon: item.type === 'award' ? '🏆' : item.type === 'education' ? '🎓' : '💼',
    }),
  },
  testimonials: {
    endpoint: '/testimonials',
    title: 'Testimonials',
    singular: 'Testimonial',
    schema: testimonialSchema,
    defaults: { published: true, rating: 5 },
    display: (item) => ({
      title: item.name,
      sub: [item.role, item.company].filter(Boolean).join(' · '),
      thumb: item.avatar,
    }),
  },
};
