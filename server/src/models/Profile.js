import mongoose from 'mongoose';

/**
 * Singleton document holding everything about the designer himself.
 * Nothing here is hard-coded on the frontend — the admin owns every field.
 */
const profileSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Shubh Singh' },
    designation: { type: String, default: 'Graphic Designer' },
    tagline: { type: String, default: '' },
    heroWords: { type: [String], default: [] },
    shortBio: { type: String, default: '' },
    longBio: { type: String, default: '' },
    avatar: { type: String, default: '' },
    portrait: { type: String, default: '' },
    heroImages: { type: [String], default: [] },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    yearsExperience: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
    availabilityText: { type: String, default: 'Available for freelance' },
    resumeUrl: { type: String, default: '' },
    marqueeWords: { type: [String], default: [] },
    stats: {
      type: [
        {
          label: { type: String, default: '' },
          value: { type: Number, default: 0 },
          suffix: { type: String, default: '+' },
        },
      ],
      default: [],
    },
    socials: {
      type: [
        {
          label: { type: String, default: '' },
          url: { type: String, default: '' },
          icon: { type: String, default: 'link' },
        },
      ],
      default: [],
    },
    tools: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model('Profile', profileSchema);
