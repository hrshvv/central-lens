import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import dbConnect from '@/lib/db/connect';
import { Article } from '@/lib/db/models/Article';
import { Video } from '@/lib/db/models/Video';
import { Category } from '@/lib/db/models/Category';

async function getHandler(req: NextRequest) {
  try {
    await dbConnect();
    
    const [totalArticles, publishedArticles, draftArticles, totalVideos, totalCategories] = await Promise.all([
      Article.countDocuments(),
      Article.countDocuments({ status: 'published' }),
      Article.countDocuments({ status: 'draft' }),
      Video.countDocuments(),
      Category.countDocuments()
    ]);

    const recentArticles = await Article.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('category', 'name')
      .lean();

    return NextResponse.json({
      stats: {
        totalArticles,
        publishedArticles,
        draftArticles,
        totalVideos,
        totalCategories
      },
      recentArticles
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const GET = withAuth(getHandler, ['admin', 'editor']);
