import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import { Article } from '@/lib/db/models/Article';
import { Video } from '@/lib/db/models/Video';

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query || !query.trim()) {
      return NextResponse.json({ articles: [], videos: [] });
    }

    const cleanQuery = query.trim().slice(0, 100);

    await dbConnect();
    
    const regex = new RegExp(escapeRegex(cleanQuery), 'i');
    
    const [articles, videos] = await Promise.all([
      Article.find({ status: 'published', $or: [{ title: regex }, { content: regex }] })
        .limit(10)
        .populate('category', 'name slug')
        .lean(),
      Video.find({ status: 'published', $or: [{ title: regex }, { description: regex }] })
        .limit(10)
        .populate('category', 'name slug')
        .lean()
    ]);

    return NextResponse.json({ articles, videos });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
