import Link from 'next/link';
import dbConnect from '@/lib/db/connect';
import { Article } from '@/lib/db/models/Article';
import { Category } from '@/lib/db/models/Category';

async function getCategoryArticles(categorySlug: string) {
  try {
    await dbConnect();
    const categoryDoc = await Category.findOne({ slug: categorySlug }).lean();
    if (!categoryDoc) {
      return { category: { name: categorySlug, slug: categorySlug }, articles: [] };
    }
    const articles = await Article.find({ category: (categoryDoc as any)._id, status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(10)
      .lean();
    return {
      category: categoryDoc,
      articles: JSON.parse(JSON.stringify(articles))
    };
  } catch (error) {
    return { category: { name: categorySlug, slug: categorySlug }, articles: [] };
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params;
  const { category, articles } = await getCategoryArticles(categorySlug);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="border-b border-gray-200 pb-4 mb-8">
        <h1 className="text-3xl font-black text-gray-900 capitalize">
          {(category as any)?.name || categorySlug}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {articles.length} articles published in this section
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-gray-500 mb-4">No articles published in this category yet.</p>
          <Link href="/" className="text-red-600 font-semibold hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article: any) => (
            <div key={article._id} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {article.coverImage && (
                <img src={article.coverImage} alt={article.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <Link href={`/category/${categorySlug}/${article.slug}`}>
                  <h2 className="font-bold text-lg text-gray-900 hover:text-red-600 mb-2 line-clamp-2">
                    {article.title}
                  </h2>
                </Link>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {article.subtitle || article.content?.substring(0, 100)}
                </p>
                <div className="text-xs text-gray-400">
                  {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
