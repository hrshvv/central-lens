import type { MetadataRoute } from 'next';
import dbConnect from '@/lib/db/connect';
import { Article } from '@/lib/db/models/Article';
import { Category } from '@/lib/db/models/Category';
import { Video } from '@/lib/db/models/Video';

export const revalidate = 3600; // Cache sitemap for 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://centrallens.in';

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'always', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/videos`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ];

  try {
    await dbConnect();

    const [articles, categories, videos] = await Promise.all([
      Article.find({ status: 'published' })
        .populate('category', 'slug')
        .select('slug category publishedAt updatedAt')
        .sort({ publishedAt: -1 })
        .limit(1000)
        .lean(),
      Category.find().select('slug updatedAt').lean(),
      Video.find({ status: 'published' })
        .select('slug publishedAt updatedAt')
        .sort({ publishedAt: -1 })
        .limit(500)
        .lean(),
    ]);

    const categoryUrls: MetadataRoute.Sitemap = categories.map((cat: any) => ({
      url: `${baseUrl}/${cat.slug}`,
      lastModified: cat.updatedAt || new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }));

    const articleUrls: MetadataRoute.Sitemap = articles.map((article: any) => {
      const catSlug = article.category?.slug || 'news';
      return {
        url: `${baseUrl}/${catSlug}/${article.slug}`,
        lastModified: article.updatedAt || article.publishedAt || new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      };
    });

    const videoUrls: MetadataRoute.Sitemap = videos.map((vid: any) => ({
      url: `${baseUrl}/video/${vid.slug}`,
      lastModified: vid.updatedAt || vid.publishedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    return [...staticRoutes, ...categoryUrls, ...articleUrls, ...videoUrls];
  } catch {
    return staticRoutes;
  }
}
