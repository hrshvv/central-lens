import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import { Article } from '@/lib/db/models/Article';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    let decodedSlug = slug;
    try {
      decodedSlug = decodeURIComponent(slug);
    } catch {
      decodedSlug = slug;
    }

    const slugVariants = Array.from(new Set([
      slug,
      decodedSlug,
      decodedSlug.trim().replace(/\s+/g, '-'),
      decodedSlug.trim().replace(/-/g, ' '),
      slug.trim().replace(/\s+/g, '-'),
    ])).filter(Boolean);

    await dbConnect();
    const article = await Article.findOneAndUpdate(
      {
        $or: [
          { slug: { $in: slugVariants } },
          { title: decodedSlug },
        ],
        status: 'published',
      },
      { $inc: { views: 1 } },
      { returnDocument: 'after' }
    ).populate('category', 'name slug color').lean();

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
