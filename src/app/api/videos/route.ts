import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import { Video } from '@/lib/db/models/Video';
import '@/lib/db/models/Category';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    await dbConnect();

    const query: Record<string, any> = { status: 'published' };

    if (type && type !== 'all') {
      query.videoType = type;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (category) {
      // Find category by slug or ObjectId
      const { Category } = await import('@/lib/db/models/Category');
      const catDoc = await Category.findOne({ slug: category });
      if (catDoc) {
        query.category = catDoc._id;
      }
    }

    const videos = await Video.find(query)
      .sort({ isFeatured: -1, publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('category', 'name slug color')
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
