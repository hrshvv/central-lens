import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import dbConnect from '@/lib/db/connect';
import { Article } from '@/lib/db/models/Article';
import { Category } from '@/lib/db/models/Category';
import { Clock, Eye, ArrowLeft, Newspaper, Sparkles } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

async function getCategoryData(categorySlug: string) {
  try {
    await dbConnect();
    const categoryDoc = await Category.findOne({ slug: categorySlug }).lean();
    if (!categoryDoc) {
      return null;
    }

    const articles = await Article.find({ category: (categoryDoc as any)._id, status: 'published' })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(24)
      .populate('category', 'name slug color')
      .lean();

    return {
      category: categoryDoc,
      articles: JSON.parse(JSON.stringify(articles)),
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  await dbConnect();
  const categoryDoc = await Category.findOne({ slug: categorySlug }).lean();

  if (!categoryDoc) {
    return {
      title: 'श्रेणी नहीं मिली | Central Lens',
    };
  }

  const name = categoryDoc.name;
  const title = `${name} समाचार (News & Live Updates) | Central Lens`;
  const description = `सेंट्रल लेंस पर ${name} से जुड़े ताजा समाचार, ब्रेकिंग न्यूज़, ग्राउंड रिपोर्ट्स और विश्लेषण।`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'Central Lens',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const data = await getCategoryData(categorySlug);

  if (!data) {
    notFound();
  }

  const { category, articles } = data;
  const categoryName = (category as any)?.name || categorySlug;
  const categoryColor = (category as any)?.color || '#DC2626';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 font-devanagari">
      {/* Category Header */}
      <div className="border-b border-neutral-200 pb-6 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-neutral-500 mb-2 font-sans">
            <Link href="/" className="hover:text-red-600 transition-colors">
              होम
            </Link>
            <span>/</span>
            <span className="font-semibold text-neutral-800">{categoryName}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 flex items-center gap-3">
            <span
              className="inline-block w-3.5 h-8 rounded-full"
              style={{ backgroundColor: categoryColor }}
            />
            <span>{categoryName}</span>
          </h1>
        </div>

        <div className="text-xs text-neutral-500 font-sans">
          कुल <span className="font-bold text-neutral-900">{articles.length}</span> प्रकाशित लेख
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-neutral-200/80 max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 mx-auto flex items-center justify-center">
            <Newspaper size={28} />
          </div>
          <h3 className="text-xl font-bold text-neutral-900">इस श्रेणी में अभी कोई लेख उपलब्ध नहीं है।</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto font-sans">
            हमारी संपादकीय टीम शीघ्र ही इस विषय पर ताजा समाचार प्रकाशित करेगी।
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition"
            >
              <ArrowLeft size={14} />
              <span>मुख्य पृष्ठ पर वापस जाएं</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {articles.map((article: any) => {
            const formattedDate = new Date(article.publishedAt || article.createdAt).toLocaleDateString(
              'hi-IN',
              { month: 'short', day: 'numeric', year: 'numeric' }
            );

            return (
              <article
                key={article._id}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-neutral-200/80 hover:border-neutral-300 shadow-2xs hover:shadow-md transition-all duration-200"
              >
                {article.coverImage && (
                  <Link href={`/${categorySlug}/${article.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-neutral-100">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {article.isBreaking && (
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow">
                        ब्रेकिंग
                      </span>
                    )}
                  </Link>
                )}

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <Link href={`/${categorySlug}/${article.slug}`}>
                      <h2 className="font-bold text-base sm:text-lg text-neutral-900 group-hover:text-red-600 line-clamp-2 leading-snug transition-colors">
                        {article.title}
                      </h2>
                    </Link>
                    {article.subtitle && (
                      <p className="text-neutral-500 text-xs line-clamp-2 mt-2 leading-relaxed">
                        {article.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400 font-sans">
                    <span className="flex items-center space-x-1 text-neutral-500">
                      <Clock size={12} />
                      <span>{formattedDate}</span>
                    </span>

                    <span className="flex items-center space-x-1">
                      <Eye size={12} />
                      <span>{article.views || 0} व्यूज</span>
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
