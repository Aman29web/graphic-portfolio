import express from 'express';
import Project from '../models/Project.js';
import { crudRouter } from '../utils/crudFactory.js';
import { asyncHandler } from '../middleware/error.js';

const router = express.Router();

// Distinct categories power the filter chips on the work grid.
router.get(
  '/meta/categories',
  asyncHandler(async (req, res) => {
    const cats = await Project.distinct('category', { published: true });
    res.json({ success: true, data: cats.filter(Boolean).sort() });
  })
);

// Fire-and-forget view counter used by the case-study page.
router.post(
  '/:id/view',
  asyncHandler(async (req, res) => {
    const byId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    await Project.findOneAndUpdate(
      byId ? { _id: req.params.id } : { slug: req.params.id },
      { $inc: { views: 1 } }
    );
    res.json({ success: true });
  })
);

router.use('/', crudRouter(Project, { sort: { order: 1, createdAt: -1 } }));

export default router;
