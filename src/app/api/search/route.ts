import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import { Article } from '@/lib/db/models/Article';
import { Video } from '@/lib/db/models/Video';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    await dbConnect();
    
    // Basic regex search for MVP. In production, use MongoDB text index or Algolia
    const regex = new RegExp(query, 'i');
    
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
