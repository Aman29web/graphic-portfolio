import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';
import { upload, UPLOAD_DIR } from '../middleware/upload.js';

const router = express.Router();

const publicUrl = (req, filename) => `${req.protocol}://${req.get('host')}/uploads/${filename}`;

router.post(
  '/',
  protect,
  upload.single('image'),
  asyncHandler(async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file received' });
    res.status(201).json({ success: true, url: publicUrl(req, req.file.filename), filename: req.file.filename });
  })
);

router.post(
  '/multiple',
  protect,
  upload.array('images', 12),
  asyncHandler(async (req, res) => {
    const files = req.files || [];
    if (!files.length) return res.status(400).json({ success: false, message: 'No files received' });
    res.status(201).json({ success: true, urls: files.map((f) => publicUrl(req, f.filename)) });
  })
);

// Media library listing so the admin can reuse anything already uploaded
router.get(
  '/library',
  protect,
  asyncHandler(async (req, res) => {
    const files = fs
      .readdirSync(UPLOAD_DIR)
      .filter((f) => !f.startsWith('.'))
      .map((f) => {
        const stat = fs.statSync(path.join(UPLOAD_DIR, f));
        return { filename: f, url: publicUrl(req, f), size: stat.size, uploadedAt: stat.mtime };
      })
      .sort((a, b) => b.uploadedAt - a.uploadedAt);

    res.json({ success: true, count: files.length, data: files });
  })
);

router.delete(
  '/:filename',
  protect,
  asyncHandler(async (req, res) => {
    const safe = path.basename(req.params.filename);
    const target = path.join(UPLOAD_DIR, safe);
    if (fs.existsSync(target)) fs.unlinkSync(target);
    res.json({ success: true, message: 'File deleted' });
  })
);

export default router;
