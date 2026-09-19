import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Windows / ISP local DNS failing to resolve MongoDB SRV records
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch {
  // Ignore in restricted environments
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null, lastFail: 0 };
}

/**
 * Dynamically resolves MongoDB SRV URI to standard replica set URI using Google / Cloudflare DNS
 * to prevent querySrv ECONNREFUSED on Windows or ISPs blocking SRV queries.
 */
async function resolveSrvUri(uri: string): Promise<string> {
  if (!uri.startsWith('mongodb+srv://')) {
    return uri;
  }

  try {
    const resolver = new dns.promises.Resolver();
    resolver.setServers(['8.8.8.8', '1.1.1.1']);

    const parsed = new URL(uri.replace('mongodb+srv://', 'http://'));
    const srvRecords = await resolver.resolveSrv(`_mongodb._tcp.${parsed.hostname}`);

    if (!srvRecords || srvRecords.length === 0) {
      return uri;
    }

    let txtParams = '';
    try {
      const txt = await resolver.resolveTxt(parsed.hostname);
      txtParams = txt.flat().join('&');
    } catch {
      // Ignore if no TXT records
    }

    const hosts = srvRecords.map(r => `${r.name}:${r.port}`).join(',');
    const auth = parsed.username ? `${parsed.username}${parsed.password ? `:${parsed.password}` : ''}@` : '';
    const pathname = parsed.pathname || '/';
    const params = new URLSearchParams(parsed.search);

    if (txtParams) {
      new URLSearchParams(txtParams).forEach((v, k) => {
        if (!params.has(k)) params.set(k, v);
      });
    }

    if (!params.has('ssl') && !params.has('tls')) {
      params.set('ssl', 'true');
    }

    return `mongodb://${auth}${hosts}${pathname}?${params.toString()}`;
  } catch {
    // If resolution fails, return original URI
    return uri;
  }
}

async function dbConnect() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

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
      maxPoolSize: 10,
      minPoolSize: 2,
    };

    cached.promise = (async () => {
      let targetUri = MONGODB_URI;
      try {
        targetUri = await resolveSrvUri(MONGODB_URI);
      } catch {
        targetUri = MONGODB_URI;
      }
      return mongoose.connect(targetUri, opts).then((m) => {
        cached.lastFail = 0;
        return m;
      });
    })();
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

