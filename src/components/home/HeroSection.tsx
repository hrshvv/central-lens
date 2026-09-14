import Link from 'next/link';
import { Clock, User } from 'lucide-react';

export default function HeroSection({ featuredArticle, topArticles }: { featuredArticle: any; topArticles: any[] }) {
  if (!featuredArticle) {
    return (
      <div className="bg-gradient-to-br from-red-600 via-red-700 to-neutral-900 text-white p-10 sm:p-14 rounded-3xl mb-12 shadow-xl">
        <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1 rounded-full mb-5 inline-block uppercase tracking-wider">
          Central Lens
        </span>
        <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
          भारत की आवाज़, निष्पक्ष पत्रकारिता
        </h1>
        <p className="text-neutral-200 max-w-2xl text-lg mb-8 leading-relaxed">
          देश, विदेश, राजनीति, खेल और तकनीक की हर बड़ी खबर पर सबसे सटीक और गहरी नजर।
        </p>
        <Link 
          href="/admin" 
          className="inline-block bg-white text-red-700 font-bold px-7 py-3.5 rounded-xl hover:bg-neutral-100 transition-all shadow-md active:scale-95"
        >
          एडमिन पैनल से खबर प्रकाशित करें &rarr;
        </Link>
      </div>
    );
  }

  const categorySlug = featuredArticle.category?.slug || 'news';
  const categoryName = featuredArticle.category?.name || 'समाचार';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7 mb-10 sm:mb-14">
      {/* Main Featured Article (8 cols on lg) */}
      <div className="lg:col-span-8 relative group overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl bg-neutral-900 min-h-[380px] sm:min-h-[440px] lg:h-[540px] flex flex-col justify-end">
        {/* Background Image with Zoom */}
        <img 
          src={featuredArticle.coverImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80'} 
          alt={featuredArticle.title} 
          className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.88]"
        />

        {/* Gradient Overlay for Pristine Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 sm:via-black/40 to-transparent z-10 pointer-events-none" />

        {/* Content on bottom (Relative positioning prevents clipping) */}
        <div className="relative z-20 p-5 sm:p-8 lg:p-10 w-full">
          <div className="flex flex-wrap items-center gap-2 mb-2.5 sm:mb-3.5">
            <span className="bg-red-600 text-white text-[10px] sm:text-[11px] font-black px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-wider shadow-sm">
              {categoryName}
            </span>
            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-wider border border-white/10">
              प्रमुख समाचार
            </span>
          </div>

          <Link href={`/${categorySlug}/${featuredArticle.slug}`} className="block group/title">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[36px] font-black text-white leading-snug sm:leading-tight mb-2 sm:mb-3 group-hover/title:text-red-400 transition-colors drop-shadow-sm">
              {featuredArticle.title}
            </h1>
          </Link>

          {featuredArticle.subtitle && (
            <p className="text-neutral-200 text-xs sm:text-sm md:text-base line-clamp-2 max-w-3xl mb-3 sm:mb-4 font-normal leading-relaxed">
              {featuredArticle.subtitle}
            </p>
          )}

          <div className="flex flex-wrap items-center text-neutral-300 text-xs sm:text-sm gap-y-1 gap-x-3 sm:space-x-4 font-sans pt-1">
            <span className="flex items-center space-x-1.5 text-white font-medium">
              <User size={13} className="text-red-400 flex-shrink-0" />
              <span className="truncate max-w-[150px] sm:max-w-none">{featuredArticle.author?.name || 'Central Lens Bureau'}</span>
            </span>
            <span className="text-neutral-500">•</span>
            <span className="flex items-center space-x-1 text-neutral-400">
              <Clock size={12} className="flex-shrink-0" />
              <span>{new Date(featuredArticle.publishedAt || featuredArticle.createdAt).toLocaleDateString('hi-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 4 Small Side Cards (4 cols on lg) */}
      <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between border-b-2 border-neutral-900 pb-2 mb-1">
          <h2 className="text-base font-black text-neutral-900 uppercase tracking-tight flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-red-600 rounded-sm inline-block"></span>
            <span>ताज़ा सुर्खियां</span>
          </h2>
          <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">Live</span>
        </div>

        {topArticles.slice(0, 4).map((article: any, index: number) => {
          const catSlug = article.category?.slug || 'news';
          const catName = article.category?.name || 'समाचार';
          return (
            <div 
              key={article._id || index} 
              className="flex space-x-3.5 group p-2.5 rounded-2xl hover:bg-neutral-50 border border-transparent hover:border-neutral-100 transition-all duration-200"
            >
              <div className="relative w-28 h-20 sm:w-32 sm:h-22 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                <img 
                  src={article.coverImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=300&auto=format&fit=crop&q=80'} 
                  alt={article.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <span className="text-red-600 text-[11px] font-bold uppercase tracking-wider mb-1 block">
                    {catName}
                  </span>
                  <Link href={`/${catSlug}/${article.slug}`} className="block">
                    <h3 className="font-bold text-neutral-900 text-sm sm:text-[15px] group-hover:text-red-600 line-clamp-2 leading-snug transition-colors">
                      {article.title}
                    </h3>
                  </Link>
                </div>
                <span className="text-[11px] text-neutral-400 font-sans mt-1">
                  {new Date(article.publishedAt || article.createdAt).toLocaleDateString('hi-IN', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
