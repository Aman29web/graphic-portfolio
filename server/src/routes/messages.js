import express from 'express';
import rateLimit from 'express-rate-limit';
import Message from '../models/Message.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many messages sent. Please try again later.' },
});

// Public: contact form submission
router.post(
  '/',
  contactLimiter,
  asyncHandler(async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
    }

    await Message.create({
      name: String(name).slice(0, 120),
      email,
      subject: String(req.body.subject || '').slice(0, 160),
      budget: String(req.body.budget || '').slice(0, 60),
      message: String(message).slice(0, 4000),
    });

    res.status(201).json({ success: true, message: "Thanks! Your message landed. I'll reply within 24 hours." });
  })
);

router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.archived === 'true') filter.archived = true;
    else filter.archived = { $ne: true };

    const messages = await Message.find(filter).sort({ createdAt: -1 }).lean();
    const unread = await Message.countDocuments({ read: false, archived: { $ne: true } });
    res.json({ success: true, count: messages.length, unread, data: messages });
  })
);

router.put(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const msg = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, data: msg });
  })
);

router.delete(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Message deleted' });
  })
);

export default router;
