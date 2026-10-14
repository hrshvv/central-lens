import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, signAccessToken, ACCESS_TOKEN_MAX_AGE } from './jwt';
import dbConnect from '@/lib/db/connect';
import { User } from '@/lib/db/models/User';

type Handler = (req: NextRequest, user: any, ...args: any[]) => Promise<NextResponse> | NextResponse;

export function withAuth(handler: Handler, allowedRoles?: string[]) {
  return async (req: NextRequest, ...args: any[]) => {
    try {
      const token = req.cookies.get('cl_token')?.value;

      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const decoded = verifyToken(token);

      // Verify and resolve the current, real-time role directly from MongoDB
      await dbConnect();
      const userDoc = await User.findById(decoded.id).select('role name email avatar');

      if (!userDoc) {
        return NextResponse.json({ error: 'User not found' }, { status: 401 });
      }

      const currentRole = userDoc.role;

      if (allowedRoles) {
        const isOwner = currentRole === 'owner';
        const isAllowed = allowedRoles.includes(currentRole) || isOwner;
        if (!isAllowed) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
      }

      const authenticatedUser = {
        id: userDoc._id.toString(),
        role: userDoc.role,
        name: userDoc.name,
        email: userDoc.email,
        avatar: userDoc.avatar,
      };

      const response = await handler(req, authenticatedUser, ...args);

      // If the JWT token's stored role is out of date, sync and refresh the cookie seamlessly
      if (decoded.role !== userDoc.role && response instanceof NextResponse) {
        try {
          const freshToken = signAccessToken({ id: userDoc._id.toString(), role: userDoc.role });
          response.cookies.set('cl_token', freshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: ACCESS_TOKEN_MAX_AGE,
          });
        } catch {
          // ignore cookie update error
        }
      }

      return response;
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  };
}
