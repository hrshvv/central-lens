import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import dbConnect from '@/lib/db/connect';
import { Newsletter } from '@/lib/db/models/Newsletter';

async function getHandler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    await dbConnect();

    const subscribers = await Newsletter.find()
      .sort({ subscribedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Newsletter.countDocuments();
    const active = await Newsletter.countDocuments({ isActive: true });

    return NextResponse.json({
      data: subscribers,
      meta: {
        total,
        active,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export const GET = withAuth(getHandler, ['admin', 'editor']);
