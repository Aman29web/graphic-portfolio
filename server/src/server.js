import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import { connectDB } from './config/db.js';
import apiRoutes from './routes/index.js';
import { notFound, errorHandler } from './middleware/error.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

// ---- Core middleware ---------------------------------------------------
app.use(
  cors({
    origin: (origin, cb) => cb(null, true), // portfolio API is public by design
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// Uploaded media
app.use(
  '/uploads',
  express.static(path.join(__dirname, '..', 'uploads'), {
    maxAge: '30d',
    setHeaders: (res) => res.set('Cross-Origin-Resource-Policy', 'cross-origin'),
  })
);

// ---- API ---------------------------------------------------------------
app.use('/api', apiRoutes);

// ---- Serve the built React app in production ---------------------------
const clientDist = path.join(__dirname, '..', '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get(/^\/(?!api|uploads).*/, (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
} else {
  app.get('/', (req, res) =>
    res.json({
      success: true,
      message: 'Shubh Singh portfolio API is running',
      docs: '/api/health',
    })
  );
}

app.use(notFound);
app.use(errorHandler);

// ---- Boot --------------------------------------------------------------
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n🎨 API ready on http://localhost:${PORT}`);
      console.log(`   Health:    http://localhost:${PORT}/api/health`);
      console.log(`   Bootstrap: http://localhost:${PORT}/api/bootstrap\n`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  });

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err?.message || err);
});
