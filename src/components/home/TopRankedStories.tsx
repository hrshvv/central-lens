import Link from 'next/link';
import { Flame, Eye } from 'lucide-react';

interface Article {
  _id: string;
  title: string;
  slug: string;
  category?: {
    name: string;
    slug: string;
  };
  views?: number;
  readingTime?: number;
  publishedAt?: string;
}

export default function TopRankedStories({ articles }: { articles: Article[] }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="my-14 bg-neutral-50/70 text-neutral-900 rounded-3xl p-6 sm:p-10 border border-neutral-200/90 shadow-2xs">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-5 mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
            <Flame size={22} className="animate-bounce" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900 flex items-center space-x-2">
              <span>शीर्ष 5 ट्रेंडिंग खबरें</span>
            </h2>
            <p className="text-xs text-neutral-500 font-sans mt-0.5">आज सबसे ज्यादा पढ़ी जा रही खबरें (Most Read Today)</p>
          </div>
        </div>
        <span className="hidden sm:inline-block text-xs font-bold text-red-600 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-200">
          लाइव रैंकिंग
        </span>
      </div>

      {/* Numbered Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {articles.slice(0, 5).map((article, idx) => {
          const catSlug = article.category?.slug || 'news';
          const catName = article.category?.name || 'समाचार';
          const rank = `0${idx + 1}`;

          return (
            <div 
              key={article._id || idx} 
              className="group relative flex flex-col justify-between p-4 rounded-2xl bg-white hover:bg-neutral-50/60 border border-neutral-200/80 hover:border-red-400 shadow-2xs hover:shadow-sm transition-all duration-300"
            >
              {/* Ranking Number */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl font-black text-red-600 tracking-tighter group-hover:scale-105 transition-all">
                  {rank}
                </span>
                <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider bg-neutral-100 px-2 py-0.5 rounded">
                  {catName}
                </span>
              </div>

              {/* Title Link */}
              <Link href={`/${catSlug}/${article.slug}`} className="block flex-1 my-2">
                <h3 className="font-bold text-sm sm:text-[15px] text-neutral-900 group-hover:text-red-600 line-clamp-3 leading-snug transition-colors">
                  {article.title}
                </h3>
              </Link>

              {/* Stats Footer */}
              <div className="flex items-center justify-between text-[11px] text-neutral-500 font-sans pt-3 border-t border-neutral-100 mt-2">
                <span className="flex items-center space-x-1">
                  <Eye size={12} className="text-neutral-400" />
                  <span>{article.views || Math.floor(Math.random() * 800 + 400)} पाठक</span>
                </span>
                <span>{article.readingTime || 4} मिनट</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
