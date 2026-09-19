import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

async function verifyJwtRole(token: string, secret: string): Promise<string | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const base64Sig = signatureB64.replace(/-/g, '+').replace(/_/g, '/');
    const paddedSig = base64Sig.padEnd(base64Sig.length + (4 - (base64Sig.length % 4)) % 4, '=');
    const binarySig = atob(paddedSig);
    const signature = new Uint8Array(binarySig.length);
    for (let i = 0; i < binarySig.length; i++) {
      signature[i] = binarySig.charCodeAt(i);
    }

    const data = enc.encode(`${headerB64}.${payloadB64}`);
    const isValid = await crypto.subtle.verify('HMAC', key, signature, data);
    if (!isValid) return null;

    const base64Payload = payloadB64.replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = base64Payload.padEnd(base64Payload.length + (4 - (base64Payload.length % 4)) % 4, '=');
    const payload = JSON.parse(atob(paddedPayload));

    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }

    return payload.role || null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('cl_token')?.value;
    const jwtSecret = process.env.JWT_SECRET;

    if (!token || !jwtSecret) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const role = await verifyJwtRole(token, jwtSecret);
    if (!role || (role !== 'admin' && role !== 'editor')) {
      return NextResponse.redirect(new URL('/login?error=unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

