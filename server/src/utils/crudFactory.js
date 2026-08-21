import express from 'express';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

/**
 * Builds a REST router for a collection so every content type gets the same
 * predictable admin surface: public GET (published only), protected write ops,
 * plus bulk re-ordering used by the drag-and-drop lists in the admin panel.
 */
export function crudRouter(Model, { sort = { order: 1, createdAt: -1 }, publicFilter = { published: true } } = {}) {
  const router = express.Router();

  // ---- Public ----------------------------------------------------------
  router.get(
    '/',
    asyncHandler(async (req, res) => {
      const showAll = req.query.all === 'true';
      const filter = showAll ? {} : { ...publicFilter };

      if (req.query.category && req.query.category !== 'All') filter.category = req.query.category;
      if (req.query.type) filter.type = req.query.type;
      if (req.query.featured === 'true') filter.featured = true;
      if (req.query.search) {
        filter.$or = [
          { title: { $regex: req.query.search, $options: 'i' } },
          { name: { $regex: req.query.search, $options: 'i' } },
          { role: { $regex: req.query.search, $options: 'i' } },
        ];
      }

      const limit = Math.min(Number(req.query.limit) || 0, 200);
      const query = Model.find(filter).sort(sort);
      if (limit) query.limit(limit);

      const items = await query.lean();
      res.json({ success: true, count: items.length, data: items });
    })
  );

  router.get(
    '/:id',
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const byId = id.match(/^[0-9a-fA-F]{24}$/);
      const item = await Model.findOne(byId ? { _id: id } : { slug: id }).lean();
      if (!item) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, data: item });
    })
  );

  // ---- Protected -------------------------------------------------------
  router.post(
    '/',
    protect,
    asyncHandler(async (req, res) => {
      const count = await Model.countDocuments();
      const item = await Model.create({ order: count, ...req.body });
      res.status(201).json({ success: true, data: item });
    })
  );

  router.put(
    '/reorder',
    protect,
    asyncHandler(async (req, res) => {
      const { items = [] } = req.body; // [{ _id, order }]
      await Promise.all(items.map(({ _id, order }) => Model.findByIdAndUpdate(_id, { order })));
      res.json({ success: true, message: 'Order updated' });
    })
  );

  router.put(
    '/:id',
    protect,
    asyncHandler(async (req, res) => {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!item) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, data: item });
    })
  );

  router.delete(
    '/:id',
    protect,
    asyncHandler(async (req, res) => {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, message: 'Deleted' });
    })
  );

  return router;
}

/**
 * Router for singleton documents (Profile, Settings): always one doc, created
 * on first read so the frontend never sees an empty response.
 */
export function singletonRouter(Model) {
  const router = express.Router();

  const getDoc = async () => {
    let doc = await Model.findOne();
    if (!doc) doc = await Model.create({});
    return doc;
  };

  router.get(
    '/',
    asyncHandler(async (req, res) => {
      const doc = await getDoc();
      res.json({ success: true, data: doc });
    })
  );

  router.put(
    '/',
    protect,
    asyncHandler(async (req, res) => {
      const doc = await getDoc();
      Object.assign(doc, req.body);
      await doc.save();
      res.json({ success: true, data: doc });
    })
  );

  return router;
}
