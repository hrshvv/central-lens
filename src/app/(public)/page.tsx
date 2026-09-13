import HeroSection from '@/components/home/HeroSection';
import TrendingCarousel from '@/components/home/TrendingCarousel';
import CategorySection from '@/components/home/CategorySection';

import dbConnect from '@/lib/db/connect';
import { Article } from '@/lib/db/models/Article';
import { Category } from '@/lib/db/models/Category';

async function getHomePageData() {
  try {
    await dbConnect();
    
    // Fetch latest articles for Hero
    const latestArticles = await Article.find({ status: 'published' })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(5)
      .populate('category', 'name slug')
      .lean();

    // Fetch trending articles (just picking some top views or random for now)
    const trendingArticles = await Article.find({ status: 'published', isFeatured: true })
      .sort({ viewCount: -1, createdAt: -1 })
      .limit(3)
      .populate('category', 'name slug')
      .lean();

    // If no trending, fallback to latest
    const trending = trendingArticles.length > 0 ? trendingArticles : latestArticles.slice(0, 3);

    // Fetch articles for specific categories (Politics, Sports, Entertainment)
    const topCategories = await Category.find({ slug: { $in: ['politics', 'sports', 'entertainment'] } }).lean();
    
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
      trending: JSON.parse(JSON.stringify(trending)),
      categoryData,
    };
  } catch (error) {
    return { latest: [], trending: [], categoryData: [] };
  }
}

export default async function HomePage() {
  const { latest, trending, categoryData } = await getHomePageData();
  
  const featuredArticle = latest.find((a: any) => a.isFeatured) || latest[0];
  const topArticles = latest.filter((a: any) => a._id !== featuredArticle?._id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-16">
      {/* Hero / Top Stories */}
      {latest.length > 0 ? (
        <HeroSection featuredArticle={featuredArticle} topArticles={topArticles} />
      ) : (
        <div className="text-center py-20 text-neutral-500">
          No articles found. Run the seed script to populate the database.
        </div>
      )}

      {/* Trending Section */}
      {trending.length > 0 && (
        <div className="pt-4">
          <TrendingCarousel articles={trending} />
        </div>
      )}

      {/* Category Grid */}
      <div className="space-y-4">
        {categoryData.map((data, index) => (
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
