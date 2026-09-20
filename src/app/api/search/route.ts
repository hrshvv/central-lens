import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import { Article } from '@/lib/db/models/Article';
import { Video } from '@/lib/db/models/Video';
import '@/lib/db/models/Category';

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    await dbConnect();

    // If query is empty, return default homepage content (latest articles & videos)
    if (!query || !query.trim()) {
      const [articles, videos] = await Promise.all([
        Article.find({ status: 'published' })
          .sort({ publishedAt: -1, createdAt: -1 })
          .limit(8)
          .populate('category', 'name slug')
          .lean(),
        Video.find({ status: 'published' })
          .sort({ publishedAt: -1, createdAt: -1 })
          .limit(4)
          .populate('category', 'name slug color')
          .lean()
      ]);
      return NextResponse.json({ articles, videos, isDefault: true });
    }

    const cleanQuery = query.trim().slice(0, 100);
    const regex = new RegExp(escapeRegex(cleanQuery), 'i');
    
    const [articles, videos] = await Promise.all([
      Article.find({ status: 'published', $or: [{ title: regex }, { content: regex }] })
        .sort({ publishedAt: -1, createdAt: -1 })
        .limit(20)
        .populate('category', 'name slug')
        .lean(),
      Video.find({ status: 'published', $or: [{ title: regex }, { description: regex }] })
        .sort({ publishedAt: -1, createdAt: -1 })
        .limit(10)
        .populate('category', 'name slug color')
        .lean()
    ]);

    return NextResponse.json({ articles, videos, isDefault: false });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
