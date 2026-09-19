import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('Please define JWT_SECRET and JWT_REFRESH_SECRET environment variables inside .env.local');
}

export interface JwtPayload {
  id: string;
  role: string;
}

export const ACCESS_TOKEN_MAX_AGE = 2 * 60 * 60; // 2 hours
export const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
}

export function signRefreshToken(payload: { id: string }): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export function verifyRefreshToken(token: string): { id: string } {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as { id: string };
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
}
