import { Article } from './models/Article';
import { Video } from './models/Video';

/**
 * Checks for any articles or videos whose scheduled time has passed,
 * and automatically transitions them to 'published' status.
 */
export async function processScheduledPublish() {
  try {
    const now = new Date();

    // 1. Publish scheduled articles whose time has arrived
    const articleResult = await Article.updateMany(
      {
        status: 'scheduled',
        scheduledAt: { $lte: now },
      },
      {
        $set: {
          status: 'published',
          publishedAt: now,
        },
      }
    );

    // 2. Publish scheduled videos whose time has arrived
    const videoResult = await Video.updateMany(
      {
        status: 'scheduled',
        scheduledAt: { $lte: now },
      },
      {
        $set: {
          status: 'published',
          publishedAt: now,
        },
      }
    );

    return {
      publishedArticles: articleResult.modifiedCount || 0,
      publishedVideos: videoResult.modifiedCount || 0,
    };
  } catch (error) {
    console.error('Error in processScheduledPublish:', error);
    return { publishedArticles: 0, publishedVideos: 0 };
  }
}

/**
 * Generates MongoDB filter for public queries to include both
 * already-published items and scheduled items whose time has passed.
 */
export function getPublicArticleFilter(filter: Record<string, any> = {}) {
  const now = new Date();
  return {
    ...filter,
    $or: [
      { status: 'published' },
      { status: 'scheduled', scheduledAt: { $lte: now } },
    ],
  };
}

export function getPublicVideoFilter(filter: Record<string, any> = {}) {
  const now = new Date();
  return {
    ...filter,
    $or: [
      { status: 'published' },
      { status: 'scheduled', scheduledAt: { $lte: now } },
    ],
  };
}
