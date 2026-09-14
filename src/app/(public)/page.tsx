import HeroSection from '@/components/home/HeroSection';
import TrendingCarousel from '@/components/home/TrendingCarousel';
import CategorySection from '@/components/home/CategorySection';
import TopRankedStories from '@/components/home/TopRankedStories';

import dbConnect from '@/lib/db/connect';
import { Article } from '@/lib/db/models/Article';
import { Category } from '@/lib/db/models/Category';

async function getHomePageData() {
  try {
    await dbConnect();
    
    // Fetch latest articles for Hero
    const latestArticles = await Article.find({ status: 'published' })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(6)
      .populate('category', 'name slug')
      .lean();

    // Fetch top 5 ranked / most viewed articles
    const topRankedArticles = await Article.find({ status: 'published' })
      .sort({ views: -1, publishedAt: -1 })
      .limit(5)
      .populate('category', 'name slug')
      .lean();

    // Fetch trending articles for visual carousel
    const trendingArticles = await Article.find({ status: 'published', isTrending: true })
      .sort({ publishedAt: -1 })
      .limit(4)
      .populate('category', 'name slug')
      .lean();

    const trending = trendingArticles.length > 0 ? trendingArticles : latestArticles.slice(0, 3);

    // Fetch articles for specific core categories
    const topCategories = await Category.find({ slug: { $in: ['national', 'politics', 'sports', 'technology', 'business'] } }).lean();
    
    const categoryData = await Promise.all(
      topCategories.map(async (cat: any) => {
        const catArticles = await Article.find({ status: 'published', category: cat._id })
          .sort({ publishedAt: -1, createdAt: -1 })
          .limit(4)
          .lean();
        return {
          categoryName: cat.name,
          categorySlug: cat.slug,
          articles: JSON.parse(JSON.stringify(catArticles)),
        };
      })
    );

    return {
      latest: JSON.parse(JSON.stringify(latestArticles)),
      topRanked: JSON.parse(JSON.stringify(topRankedArticles)),
      trending: JSON.parse(JSON.stringify(trending)),
      categoryData,
    };
  } catch (error) {
    return { latest: [], topRanked: [], trending: [], categoryData: [] };
  }
}

export default async function HomePage() {
  const { latest, topRanked, trending, categoryData } = await getHomePageData();
  
  const featuredArticle = latest.find((a: any) => a.isFeatured) || latest[0];
  const topArticles = latest.filter((a: any) => a._id !== featuredArticle?._id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero Magazine Section */}
      {latest.length > 0 ? (
        <HeroSection featuredArticle={featuredArticle} topArticles={topArticles} />
      ) : (
        <div className="text-center py-24 text-neutral-500 bg-neutral-50 rounded-3xl border border-neutral-200">
          <p className="text-lg font-bold">अभी कोई लेख उपलब्ध नहीं है।</p>
          <p className="text-sm mt-1 text-neutral-400">एडमिन पैनल से नए लेख प्रकाशित करें।</p>
        </div>
      )}

      {/* Top 5 Ranked Stories Widget (शीर्ष 5 खबरें) */}
      {topRanked.length > 0 && (
        <TopRankedStories articles={topRanked} />
      )}

      {/* Trending Visual Carousel */}
      {trending.length > 0 && (
        <div className="my-14">
          <div className="mb-6 flex items-center space-x-3">
            <span className="w-2 h-7 bg-red-600 rounded-full inline-block"></span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              स्पेशल रिपोर्ट्स & ट्रेंडिंग
            </h2>
          </div>
          <TrendingCarousel articles={trending} />
        </div>
      )}

      {/* Category Feeds */}
      <div className="space-y-4">
        {categoryData.filter(d => d.articles.length > 0).map((data, index) => (
          <CategorySection 
            key={index}
            categoryName={data.categoryName}
            categorySlug={data.categorySlug}
            articles={data.articles}
          />
        ))}
      </div>
    </div>
  );
}
