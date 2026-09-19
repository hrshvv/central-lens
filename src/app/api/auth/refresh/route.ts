import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import { User } from '@/lib/db/models/User';
import { verifyRefreshToken, signAccessToken, ACCESS_TOKEN_MAX_AGE } from '@/lib/auth/jwt';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('cl_refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token provided' }, { status: 401 });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const newAccessToken = signAccessToken({ id: user._id.toString(), role: user.role });

    const response = NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });

    response.cookies.set('cl_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Failed to refresh token' }, { status: 401 });
  }
}
