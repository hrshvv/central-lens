import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import { Article } from '@/lib/db/models/Article';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const isFeatured = searchParams.get('isFeatured') === 'true';

    await dbConnect();
    
    const query: any = { status: 'published' };
    if (isFeatured) query.isFeatured = true;

    const articles = await Article.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit)
      .populate('category', 'name slug')
      .lean();

    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
