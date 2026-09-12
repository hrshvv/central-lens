import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import { Article } from '@/lib/db/models/Article';

export async function GET() {
  try {
    await dbConnect();
    
    // In a real app, you might filter by date e.g. last 7 days
    const trendingArticles = await Article.find({ status: 'published', isTrending: true })
      .sort({ views: -1 })
      .limit(10)
      .populate('category', 'name slug color')
      .lean();

    return NextResponse.json(trendingArticles);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
