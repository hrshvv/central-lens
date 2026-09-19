import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db/connect';
import { User } from '@/lib/db/models/User';
import { signAccessToken, signRefreshToken, ACCESS_TOKEN_MAX_AGE, REFRESH_TOKEN_MAX_AGE } from '@/lib/auth/jwt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

    const trimmedEmail = typeof email === 'string' ? email.trim() : '';
    const trimmedPassword = typeof password === 'string' ? password : '';

    if (!trimmedEmail) {
      return NextResponse.json(
        { error: 'कृपया अपना ईमेल पता दर्ज करें (Email address is required)', field: 'email' },
        { status: 400 }
      );
    }

    if (!trimmedPassword) {
      return NextResponse.json(
        { error: 'कृपया अपना पासवर्ड दर्ज करें (Password is required)', field: 'password' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Case-insensitive email lookup
    const normalizedEmail = trimmedEmail.toLowerCase();
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
    });

    if (!user) {
      return NextResponse.json(
        { 
          error: 'इस ईमेल पते से कोई खाता पंजीकृत नहीं है (No account found with this email)', 
          field: 'email' 
        },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(trimmedPassword, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { 
          error: 'दर्ज किया गया पासवर्ड गलत है। कृपया पुनः प्रयास करें। (Incorrect password entered)', 
          field: 'password' 
        },
        { status: 401 }
      );
    }

    const token = signAccessToken({ id: user._id.toString(), role: user.role });
    const refreshToken = signRefreshToken({ id: user._id.toString() });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });

    response.cookies.set('cl_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    response.cookies.set('cl_refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        error: 'सर्वर या डेटाबेस से संपर्क करने में समस्या आई। कृपया थोड़ी देर बाद पुनः प्रयास करें। (Connection error)', 
        field: 'general' 
      },
      { status: 500 }
    );
  }
}

