import mongoose from 'mongoose';
import slugify from 'slugify';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    category: { type: String, default: 'Branding' },
    client: { type: String, default: '' },
    year: { type: String, default: '' },
    role: { type: String, default: '' },
    description: { type: String, default: '' },
    longDescription: { type: String, default: '' },
    challenge: { type: String, default: '' },
    solution: { type: String, default: '' },
    outcome: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    gallery: { type: [String], default: [] },
    tools: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    link: { type: String, default: '' },
    linkLabel: { type: String, default: 'View live' },
    extraLinks: {
      type: [
        {
          label: { type: String, default: '' },
          url: { type: String, default: '' },
        },
      ],
      default: [],
    },
    accent: { type: String, default: '#ff5c39' },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

projectSchema.pre('validate', function makeSlug(next) {
  if (!this.slug || this.isModified('title')) {
    const base = slugify(this.title || 'project', { lower: true, strict: true });
    this.slug = `${base}-${this._id.toString().slice(-4)}`;
  }
  next();
});

export default mongoose.model('Project', projectSchema);
