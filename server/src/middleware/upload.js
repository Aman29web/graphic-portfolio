import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path
      .basename(file.originalname, ext)
      .replace(/[^a-z0-9]+/gi, '-')
      .toLowerCase()
      .slice(0, 40);
    cb(null, `${base || 'file'}-${Date.now()}${ext}`);
  },
});

const ALLOWED = /jpeg|jpg|png|gif|webp|svg|avif/;

export const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const okExt = ALLOWED.test(path.extname(file.originalname).toLowerCase());
    const okMime = file.mimetype.startsWith('image/');
    if (okExt && okMime) return cb(null, true);

    // A rejected upload is a bad request, not a server fault.
    const err = new Error('Only image files are allowed (jpg, png, gif, webp, svg, avif)');
    err.statusCode = 400;
    cb(err);
  },
});
