import HeroSection from '@/components/home/HeroSection';

import dbConnect from '@/lib/db/connect';
import { Article } from '@/lib/db/models/Article';

async function getArticles() {
  try {
    await dbConnect();
    const articles = await Article.find({ status: 'published' })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(5)
      .populate('category', 'name slug')
      .lean();
    return JSON.parse(JSON.stringify(articles));
  } catch (error) {
    return [];
  }
}

export default async function HomePage() {
  const articles = await getArticles();
  
  const featuredArticle = articles.find((a: any) => a.isFeatured) || articles[0];
  const topArticles = articles.filter((a: any) => a._id !== featuredArticle?._id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero / Top Stories */}
      <HeroSection featuredArticle={featuredArticle} topArticles={topArticles} />

      {/* Placeholders for the rest of Phase 1 Homepage components */}
      <div className="my-12">
        <h2 className="text-2xl font-bold mb-6 border-l-4 border-red-600 pl-4">Trending Now</h2>
        <div className="bg-gray-50 h-64 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-500">
          TrendingCarousel Component (To be implemented)
        </div>
      </div>

      <div className="my-12">
        <h2 className="text-2xl font-bold mb-6 border-l-4 border-blue-600 pl-4">राजनीति (Politics)</h2>
        <div className="bg-gray-50 h-64 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-500">
          CategorySection Component (To be implemented)
        </div>
      </div>
    </div>
  );
}
