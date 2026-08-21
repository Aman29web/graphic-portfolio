import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';

import Admin from '../models/Admin.js';
import Profile from '../models/Profile.js';
import Settings from '../models/Settings.js';
import Project from '../models/Project.js';
import Service from '../models/Service.js';
import Skill from '../models/Skill.js';
import Experience from '../models/Experience.js';
import Testimonial from '../models/Testimonial.js';

import * as data from './data.js';

async function seed() {
  const fresh = process.argv.includes('--fresh');
  await connectDB();

  console.log(fresh ? 'Wiping collections (--fresh)...' : 'Seeding content...');

  await Promise.all([
    Project.deleteMany({}),
    Service.deleteMany({}),
    Skill.deleteMany({}),
    Experience.deleteMany({}),
    Testimonial.deleteMany({}),
    Profile.deleteMany({}),
    Settings.deleteMany({}),
  ]);

  await Profile.create(data.profile);
  await Settings.create(data.settings);

  // Created one at a time so the slug pre-validate hook runs per document.
  for (const p of data.projects) await Project.create(p);

  await Service.insertMany(data.services);
  await Skill.insertMany(data.skills);
  await Experience.insertMany(data.experience);
  await Testimonial.insertMany(data.testimonials);

  const email = (process.env.ADMIN_EMAIL || 'admin@shubhsingh.design').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  if (fresh) await Admin.deleteMany({});
  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log(`Admin already exists -> ${email}`);
  } else {
    await Admin.create({ name: 'Shubh Singh', email, password, avatar: data.profile.avatar });
    console.log(`Admin created -> ${email} / ${password}`);
  }

  console.log(`
Seed complete
  Projects:     ${data.projects.length}
  Services:     ${data.services.length}
  Skills:       ${data.skills.length}
  Experience:   ${data.experience.length}
  Testimonials: ${data.testimonials.length}

  Admin panel: http://localhost:5173/admin
`);

  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
