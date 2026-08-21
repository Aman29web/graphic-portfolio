import express from 'express';

import Profile from '../models/Profile.js';
import Settings from '../models/Settings.js';
import Service from '../models/Service.js';
import Skill from '../models/Skill.js';
import Experience from '../models/Experience.js';
import Testimonial from '../models/Testimonial.js';
import Project from '../models/Project.js';
import Message from '../models/Message.js';

import { crudRouter, singletonRouter } from '../utils/crudFactory.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

import authRoutes from './auth.js';
import projectRoutes from './projects.js';
import messageRoutes from './messages.js';
import uploadRoutes from './upload.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/profile', singletonRouter(Profile));
router.use('/settings', singletonRouter(Settings));
router.use('/projects', projectRoutes);
router.use('/services', crudRouter(Service));
router.use('/skills', crudRouter(Skill));
router.use('/experience', crudRouter(Experience));
router.use('/testimonials', crudRouter(Testimonial));
router.use('/messages', messageRoutes);
router.use('/upload', uploadRoutes);

/**
 * One request that boots the whole public site — avoids a waterfall of six
 * round-trips on mobile connections.
 */
router.get(
  '/bootstrap',
  asyncHandler(async (req, res) => {
    const [profile, settings, projects, services, skills, experience, testimonials, categories] =
      await Promise.all([
        Profile.findOne().lean().then(async (d) => d || (await Profile.create({})).toObject()),
        Settings.findOne().lean().then(async (d) => d || (await Settings.create({})).toObject()),
        Project.find({ published: true }).sort({ order: 1, createdAt: -1 }).lean(),
        Service.find({ published: true }).sort({ order: 1 }).lean(),
        Skill.find({ published: true }).sort({ order: 1 }).lean(),
        Experience.find({ published: true }).sort({ order: 1 }).lean(),
        Testimonial.find({ published: true }).sort({ order: 1 }).lean(),
        Project.distinct('category', { published: true }),
      ]);

    res.json({
      success: true,
      data: {
        profile,
        settings,
        projects,
        services,
        skills,
        experience,
        testimonials,
        categories: categories.filter(Boolean).sort(),
      },
    });
  })
);

// Admin dashboard tiles
router.get(
  '/stats',
  protect,
  asyncHandler(async (req, res) => {
    const [projects, published, featured, services, skills, experience, testimonials, messages, unread, topViewed] =
      await Promise.all([
        Project.countDocuments(),
        Project.countDocuments({ published: true }),
        Project.countDocuments({ featured: true }),
        Service.countDocuments(),
        Skill.countDocuments(),
        Experience.countDocuments(),
        Testimonial.countDocuments(),
        Message.countDocuments({ archived: { $ne: true } }),
        Message.countDocuments({ read: false, archived: { $ne: true } }),
        Project.find().sort({ views: -1 }).limit(5).select('title views slug').lean(),
      ]);

    const recentMessages = await Message.find({ archived: { $ne: true } })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({
      success: true,
      data: {
        projects,
        published,
        featured,
        services,
        skills,
        experience,
        testimonials,
        messages,
        unread,
        topViewed,
        recentMessages,
      },
    });
  })
);

router.get('/health', (req, res) =>
  res.json({ success: true, status: 'ok', uptime: process.uptime(), time: new Date().toISOString() })
);

export default router;
