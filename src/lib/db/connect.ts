import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Windows / ISP local DNS failing to resolve MongoDB SRV records
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch {
  // Ignore in restricted environments
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null, lastFail: 0 };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  // If connection failed recently (within last 10s), fail fast to prevent route freezing
  if (cached.lastFail && Date.now() - cached.lastFail < 10000) {
    throw new Error('MongoDB connection is offline (throttled)');
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      cached.lastFail = 0;
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.lastFail = Date.now();
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
