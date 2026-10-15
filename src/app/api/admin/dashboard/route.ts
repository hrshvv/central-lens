import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import dbConnect from '@/lib/db/connect';
import { Article } from '@/lib/db/models/Article';
import { Video } from '@/lib/db/models/Video';
import { Category } from '@/lib/db/models/Category';
import { User } from '@/lib/db/models/User';
import { NewsletterPost } from '@/lib/db/models/NewsletterPost';
import { processScheduledPublish } from '@/lib/db/publishHelper';

async function getHandler(req: NextRequest, user: any) {
  try {
    await dbConnect();
    await processScheduledPublish();
    const isOwner = user.role === 'owner';

    if (!isOwner) {
      // Regular Admin: Stats & Recent Articles scoped exclusively to their own content
      const [totalArticles, publishedArticles, scheduledArticles, draftArticles, totalVideos, scheduledVideos, totalCategories, totalNewsletters] = await Promise.all([
        Article.countDocuments({ createdBy: user.id }),
        Article.countDocuments({ createdBy: user.id, status: 'published' }),
        Article.countDocuments({ createdBy: user.id, status: 'scheduled' }),
        Article.countDocuments({ createdBy: user.id, status: 'draft' }),
        Video.countDocuments({ createdBy: user.id }),
        Video.countDocuments({ createdBy: user.id, status: 'scheduled' }),
        Category.countDocuments(),
        NewsletterPost.countDocuments({ createdBy: user.id })
      ]);

      const recentArticles = await Article.find({ createdBy: user.id })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('category', 'name')
        .populate('createdBy', 'name email role')
        .lean();

      return NextResponse.json({
        isOwner: false,
        role: user.role,
        stats: {
          totalArticles,
          publishedArticles,
          scheduledArticles,
          draftArticles,
          totalVideos,
          scheduledVideos,
          totalCategories,
          totalNewsletters
        },
        recentArticles
      });
    }

    // Owner: Complete platform-wide overview
    const [totalArticles, publishedArticles, scheduledArticles, draftArticles, totalVideos, scheduledVideos, totalCategories, totalUsers, totalNewsletters] = await Promise.all([
      Article.countDocuments(),
      Article.countDocuments({ status: 'published' }),
      Article.countDocuments({ status: 'scheduled' }),
      Article.countDocuments({ status: 'draft' }),
      Video.countDocuments(),
      Video.countDocuments({ status: 'scheduled' }),
      Category.countDocuments(),
      User.countDocuments(),
      NewsletterPost.countDocuments()
    ]);

    const recentArticles = await Article.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('category', 'name')
      .populate('createdBy', 'name email role')
      .lean();

    return NextResponse.json({
      isOwner: true,
      role: 'owner',
      stats: {
        totalArticles,
        publishedArticles,
        scheduledArticles,
        draftArticles,
        totalVideos,
        scheduledVideos,
        totalCategories,
        totalUsers,
        totalNewsletters
      },
      recentArticles
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const GET = withAuth(getHandler, ['admin', 'editor']);
