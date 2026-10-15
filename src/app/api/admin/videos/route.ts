import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import dbConnect from '@/lib/db/connect';
import { Video } from '@/lib/db/models/Video';
import '@/lib/db/models/Category';
import { processScheduledPublish } from '@/lib/db/publishHelper';

async function getHandler(req: NextRequest, user: any) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    await dbConnect();
    await processScheduledPublish();
    
    const query: Record<string, any> = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ];
    }

    // Role hierarchy:
    // If not owner, admin can ONLY see their own added videos
    if (user.role !== 'owner') {
      query.createdBy = user.id;
    }

    const videos = await Video.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('category', 'name slug color')
      .populate('createdBy', 'name email role')
      .lean();

    const total = await Video.countDocuments(query);

    return NextResponse.json({
      data: videos,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

async function postHandler(req: NextRequest, user: any) {
  try {
    const body = await req.json();
    await dbConnect();

    // Attach creator user ID
    body.createdBy = user.id;

    // Auto-generate slug if missing
    if (!body.slug && body.title) {
      body.slug = body.title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\u0900-\u097F]+/g, '-')
        .replace(/(^-|-$)+/g, '') || `video-${Date.now().toString(36)}`;
    }

    // Handle scheduled status and dates
    if (body.status === 'scheduled') {
      if (!body.scheduledAt) {
        return NextResponse.json(
          { error: 'शेड्यूल करने के लिए प्रकाशन का समय चुनना अनिवार्य है।' },
          { status: 400 }
        );
      }
      const schedDate = new Date(body.scheduledAt);
      if (isNaN(schedDate.getTime())) {
        return NextResponse.json({ error: 'अमान्य तारीख या समय।' }, { status: 400 });
      }
      if (schedDate <= new Date()) {
        body.status = 'published';
        body.publishedAt = new Date();
        delete body.scheduledAt;
      } else {
        body.scheduledAt = schedDate;
      }
    } else if (body.status === 'published') {
      body.publishedAt = body.publishedAt ? new Date(body.publishedAt) : new Date();
      delete body.scheduledAt;
    } else {
      delete body.scheduledAt;
    }

    const video = await Video.create(body);
    const populated = await Video.findById(video._id)
      .populate('category', 'name slug color')
      .populate('createdBy', 'name email role');

    return NextResponse.json(populated || video, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export const GET = withAuth(getHandler, ['admin', 'editor']);
export const POST = withAuth(postHandler, ['admin', 'editor']);
