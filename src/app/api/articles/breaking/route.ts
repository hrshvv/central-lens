import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import { Article } from '@/lib/db/models/Article';

export async function GET() {
  try {
    await dbConnect();
    
    const breakingArticles = await Article.find({ status: 'published', isBreaking: true })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(5)
      .select('title slug category')
      .populate('category', 'name slug color')
      .lean();

    return NextResponse.json(breakingArticles);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
