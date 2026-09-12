import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JwtPayload } from './jwt';

type Handler = (req: NextRequest, user: JwtPayload, ...args: any[]) => Promise<NextResponse> | NextResponse;

export function withAuth(handler: Handler, allowedRoles?: string[]) {
  return async (req: NextRequest, ...args: any[]) => {
    try {
      const token = req.cookies.get('cl_token')?.value;

      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const decoded = verifyToken(token);

      if (allowedRoles && !allowedRoles.includes(decoded.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      return await handler(req, decoded, ...args);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  };
}
