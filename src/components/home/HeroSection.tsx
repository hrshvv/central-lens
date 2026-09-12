import Link from 'next/link';

export default function HeroSection({ featuredArticle, topArticles }: { featuredArticle: any, topArticles: any[] }) {
  if (!featuredArticle) {
    return (
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-10 rounded-2xl mb-12 shadow-lg">
        <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded mb-4 inline-block uppercase tracking-wider">
          Welcome to Central Lens
        </span>
        <h1 className="text-3xl md:text-5xl font-black mb-4">
          भारत की आवाज़, निष्पक्ष पत्रकारिता
        </h1>
        <p className="text-gray-100 max-w-2xl text-lg mb-6">
          Central Lens brings you deep, honest journalism in Hindi covering politics, technology, sports, and business.
        </p>
        <Link href="/admin" className="inline-block bg-white text-red-700 font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors shadow">
          Go to Admin CMS to Publish Articles &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
      {/* Main Featured Article (60%) */}
      <div className="lg:col-span-8 relative group cursor-pointer overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
        <img 
          src={featuredArticle.coverImage || 'https://via.placeholder.com/800x600'} 
          alt={featuredArticle.title} 
          className="w-full h-[500px] object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
          <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded mb-4 inline-block uppercase">
            {featuredArticle.category?.name || 'News'}
          </span>
          <Link href={`/category/${featuredArticle.category?.slug}/${featuredArticle.slug}`}>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
              {featuredArticle.title}
            </h1>
          </Link>
          <div className="flex items-center text-gray-300 text-sm space-x-4">
            <span>By {featuredArticle.author?.name}</span>
            <span>{new Date(featuredArticle.publishedAt || featuredArticle.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* 4 Small Side Cards (40%) */}
      <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
        {topArticles.map((article: any) => (
          <div key={article._id} className="flex space-x-4 group cursor-pointer">
            <img 
              src={article.coverImage || 'https://via.placeholder.com/150'} 
              alt={article.title} 
              className="w-32 h-24 object-cover rounded-xl"
            />
            <div className="flex-1">
              <span className="text-blue-600 text-xs font-bold uppercase mb-1 block">
                {article.category?.name || 'News'}
              </span>
              <Link href={`/category/${article.category?.slug}/${article.slug}`}>
                <h3 className="font-bold text-gray-900 group-hover:text-red-600 line-clamp-2 mb-1 leading-snug">
                  {article.title}
                </h3>
              </Link>
              <span className="text-xs text-gray-500">
                {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
