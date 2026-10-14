import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import dbConnect from '@/lib/db/connect';
import { NewsletterPost } from '@/lib/db/models/NewsletterPost';
import { User } from '@/lib/db/models/User';

async function getHandler(req: NextRequest, user: any) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    await dbConnect();

    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { previewText: { $regex: search, $options: 'i' } },
      ];
    }

    // Role hierarchy:
    // If not owner, admin can ONLY see their own added newsletters
    if (user.role !== 'owner') {
      query.createdBy = user.id;
    }

    const newsletters = await NewsletterPost.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('createdBy', 'name email role')
      .lean();

    const total = await NewsletterPost.countDocuments(query);

    return NextResponse.json({
      data: newsletters,
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
    const { subject, content, previewText, status } = body;

    if (!subject || !content) {
      return NextResponse.json({ error: 'विषय (Subject) और मुख्य सामग्री (Content) आवश्यक हैं।' }, { status: 400 });
    }

    await dbConnect();

    const creatorUser = await User.findById(user.id);

    const newsletter = await NewsletterPost.create({
      subject: subject.trim(),
      previewText: previewText ? previewText.trim() : subject.slice(0, 120),
      content,
      status: status === 'sent' ? 'sent' : 'draft',
      sentAt: status === 'sent' ? new Date() : undefined,
      createdBy: user.id,
      authorName: creatorUser?.name || 'Central Lens Editorial',
    });

    const populated = await NewsletterPost.findById(newsletter._id).populate('createdBy', 'name email role');
    return NextResponse.json(populated || newsletter, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create newsletter' }, { status: 400 });
  }
}

export const GET = withAuth(getHandler, ['admin', 'editor']);
export const POST = withAuth(postHandler, ['admin', 'editor']);
