import jwt from 'jsonwebtoken';

function getSecrets() {
  const secret = process.env.JWT_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  if (!secret || !refreshSecret) {
    throw new Error('Please define JWT_SECRET and JWT_REFRESH_SECRET environment variables');
  }
  return { secret, refreshSecret };
}

export interface JwtPayload {
  id: string;
  role: string;
}

export const ACCESS_TOKEN_MAX_AGE = 2 * 60 * 60; // 2 hours
export const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

export function signAccessToken(payload: JwtPayload): string {
  const { secret } = getSecrets();
  return jwt.sign(payload, secret, { expiresIn: '2h' });
}

export function signRefreshToken(payload: { id: string }): string {
  const { refreshSecret } = getSecrets();
  return jwt.sign(payload, refreshSecret, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload {
  try {
    const { secret } = getSecrets();
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export function verifyRefreshToken(token: string): { id: string } {
  try {
    const { refreshSecret } = getSecrets();
    return jwt.verify(token, refreshSecret) as { id: string };
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
}
