import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  createdAt: string;
  publishedAt?: string;
}

interface CategorySectionProps {
  categoryName: string;
  categorySlug: string;
  articles: Article[];
}

export default function CategorySection({ categoryName, categorySlug, articles }: CategorySectionProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="py-12 border-t border-neutral-200">
      {/* Category Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <span className="w-2 h-7 bg-red-600 rounded-full inline-block"></span>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            {categoryName}
          </h2>
        </div>
        <Link 
          href={`/${categorySlug}`}
          className="group flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 transition-colors bg-red-50 hover:bg-red-100 px-3.5 py-1.5 rounded-full"
        >
          <span>सभी देखें</span>
          <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Featured Article in Category (7 cols) */}
        {articles.length > 0 && (
          <div className="lg:col-span-7 group">
            <Link href={`/${categorySlug}/${articles[0].slug}`} className="block">
              <div className="relative h-64 sm:h-80 md:h-[380px] w-full rounded-2xl overflow-hidden mb-5 bg-neutral-100 shadow-sm">
                <img 
                  src={articles[0].coverImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80'} 
                  alt={articles[0].title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-neutral-900 group-hover:text-red-600 transition-colors mb-3 line-clamp-2 leading-snug">
                {articles[0].title}
              </h3>
              <p className="text-neutral-600 text-sm sm:text-base line-clamp-2 sm:line-clamp-3 mb-3 leading-relaxed">
                {articles[0].excerpt}
              </p>
              <div className="flex items-center space-x-2 text-xs text-neutral-400 font-sans">
                <Clock size={12} />
                <span>
                  {new Date(articles[0].publishedAt || articles[0].createdAt).toLocaleDateString('hi-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </Link>
          </div>
        )}

        {/* Side Stack Articles in Category (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4 divide-y divide-neutral-100">
          {articles.slice(1, 4).map((article, idx) => (
            <Link 
              href={`/${categorySlug}/${article.slug}`} 
              key={article._id || idx} 
              className={`group block ${idx > 0 ? 'pt-4' : ''}`}
            >
              <div className="flex gap-4 items-center">
                <div className="relative w-28 h-20 sm:w-32 sm:h-22 flex-shrink-0 rounded-xl overflow-hidden bg-neutral-100 shadow-sm">
                  <img 
                    src={article.coverImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=300&auto=format&fit=crop&q=80'} 
                    alt={article.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-bold text-neutral-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug mb-1.5">
                    {article.title}
                  </h4>
                  <span className="text-[11px] text-neutral-400 font-sans flex items-center space-x-1">
                    <Clock size={11} />
                    <span>
                      {new Date(article.publishedAt || article.createdAt).toLocaleDateString('hi-IN', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
