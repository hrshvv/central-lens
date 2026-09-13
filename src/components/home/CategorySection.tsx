import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import Image from 'next/image';

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  createdAt: string;
}

interface CategorySectionProps {
  categoryName: string;
  categorySlug: string;
  articles: Article[];
}

export default function CategorySection({ categoryName, categorySlug, articles }: CategorySectionProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="py-12 border-t border-neutral-100">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">
          {categoryName}
        </h2>
        <Link 
          href={`/${categorySlug}`}
          className="group flex items-center space-x-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          <span>View All</span>
          <FiArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Featured Article (First one) */}
        {articles.length > 0 && (
          <div className="md:col-span-2 group cursor-pointer">
            <Link href={`/${categorySlug}/${articles[0].slug}`} className="block">
              <div className="relative h-64 md:h-[400px] w-full rounded-2xl overflow-hidden mb-5 bg-neutral-100">
                <img 
                  src={articles[0].coverImage || '/placeholder.jpg'} 
                  alt={articles[0].title}
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 group-hover:text-blue-600 transition-colors mb-3 line-clamp-2">
                {articles[0].title}
              </h3>
              <p className="text-neutral-600 line-clamp-3">
                {articles[0].excerpt}
              </p>
            </Link>
          </div>
        )}

        {/* Sidebar Articles */}
        <div className="flex flex-col space-y-6">
          {articles.slice(1, 4).map((article) => (
            <Link href={`/${categorySlug}/${article.slug}`} key={article._id} className="group block">
              <div className="flex gap-4">
                <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-neutral-100 hidden sm:block">
                  <img 
                    src={article.coverImage || '/placeholder.jpg'} 
                    alt={article.title}
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-neutral-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1 leading-snug">
                    {article.title}
                  </h4>
                  <p className="text-sm text-neutral-500">
                    {new Date(article.createdAt).toLocaleDateString('hi-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
