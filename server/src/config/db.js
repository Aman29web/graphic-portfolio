import mongoose from 'mongoose';

/**
 * Hosting dashboards (Railway, Render, Vercel) commonly store the value with
 * surrounding quotes or stray whitespace/newlines from a paste. Clean those up
 * rather than dying on an unhelpful "Invalid scheme" from the driver.
 */
function cleanUri(raw) {
  return String(raw)
    .trim()
    .replace(/^['"]|['"]$/g, '') // wrapping quotes
    .replace(/\s+/g, '') // newlines injected by a wrapped paste
    .trim();
}

export async function connectDB() {
  const raw = process.env.MONGODB_URI;
  if (!raw) {
    throw new Error(
      'MONGODB_URI is not set. Add it to server/.env locally, or to the service variables on your host.'
    );
  }

  const uri = cleanUri(raw);

  if (!/^mongodb(\+srv)?:\/\//.test(uri)) {
    // Show only the harmless prefix — never log the credentials.
    const preview = uri.slice(0, 24).replace(/:[^:@/]+@/, ':****@');
    throw new Error(
      `MONGODB_URI must start with "mongodb://" or "mongodb+srv://", but it starts with "${preview}…". ` +
        'Check the variable on your host for a stray prefix, quotes, or a copied "MONGODB_URI=" in the value itself.'
    );
  }

  mongoose.set('strictQuery', true);

  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
  });

  console.log(`✅ MongoDB connected → ${conn.connection.host}/${conn.connection.name}`);

  mongoose.connection.on('error', (err) => console.error('MongoDB error:', err.message));
  mongoose.connection.on('disconnected', () => console.warn('⚠️  MongoDB disconnected'));

  return conn;
}
