import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import dbConnect from '@/lib/db/connect';
import { Article } from '@/lib/db/models/Article';
import { User } from '@/lib/db/models/User';
import '@/lib/db/models/Category';
import { processScheduledPublish } from '@/lib/db/publishHelper';

async function getHandler(req: NextRequest, user: any) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const query: any = {};
    if (status && status !== 'all') query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ];
    }

    // Role hierarchy:
    // If not owner, admin can ONLY see their own added articles
    if (user.role !== 'owner') {
      query.createdBy = user.id;
    }

    await dbConnect();
    await processScheduledPublish();
    
    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('category', 'name slug color')
      .populate('createdBy', 'name email role avatar')
      .lean();

    const total = await Article.countDocuments(query);

    return NextResponse.json({
      data: articles,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching admin articles:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function postHandler(req: NextRequest, user: any) {
  try {
    const body = await req.json();
    await dbConnect();

    // Attach creator user ID
    body.createdBy = user.id;

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

    // Ensure author name is populated from user record if missing
    if (!body.author?.name || body.author.name === 'Central Lens Bureau') {
      const creatorUser = await User.findById(user.id);
      if (creatorUser) {
        body.author = {
          name: creatorUser.name,
          avatar: creatorUser.avatar,
        };
      }
    }

    const article = await Article.create(body);
    const populated = await Article.findById(article._id)
      .populate('category', 'name slug color')
      .populate('createdBy', 'name email role');

    return NextResponse.json(populated || article, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export const GET = withAuth(getHandler, ['admin', 'editor']);
export const POST = withAuth(postHandler, ['admin', 'editor']);
