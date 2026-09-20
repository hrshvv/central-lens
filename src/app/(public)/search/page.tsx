'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  Loader2, 
  FileText, 
  Video as VideoIcon, 
  X, 
  Sparkles, 
  Clock, 
  Play, 
  Flame,
  ArrowRight,
  TrendingUp,
  Compass
} from 'lucide-react';

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [results, setResults] = useState<{ articles: any[]; videos: any[]; isDefault?: boolean }>({ 
    articles: [], 
    videos: [],
    isDefault: true 
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'articles' | 'videos'>('all');

  const trendingTags = [
    'राजनीति',
    'राष्ट्रीय',
    'खेल',
    'टेक्नोलॉजी',
    'व्यापार',
    'बजट',
    'चुनाव',
    'विश्व'
  ];

  // Debounce the input query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      if (query !== searchParams.get('q')) {
        const params = new URLSearchParams();
        if (query.trim()) {
          params.set('q', query.trim());
        }
        router.replace(`/search${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false });
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [query, router, searchParams]);

  // Fetch results based on debounced query (or default homepage content if empty)
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    const endpoint = debouncedQuery.trim() 
      ? `/api/search?q=${encodeURIComponent(debouncedQuery.trim())}`
      : `/api/search`;

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        if (!isCancelled) {
          setResults({ 
            articles: data.articles || [], 
            videos: data.videos || [],
            isDefault: data.isDefault ?? !debouncedQuery.trim()
          });
          setLoading(false);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery]);

  const handleClear = () => {
    setQuery('');
    setDebouncedQuery('');
    router.replace('/search', { scroll: false });
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('hi-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  const totalResults = results.articles.length + results.videos.length;
  const isSearching = !!debouncedQuery.trim();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 min-h-[75vh] font-devanagari">
      
      {/* Search Bar Input Container */}
      <div className="max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none text-neutral-400">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-red-600" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="समाचार, वीडियो, विश्लेषण या विषय खोजें..."
            className="block w-full pl-11 sm:pl-13 pr-11 py-3.5 sm:py-4 text-base sm:text-lg border-2 border-neutral-200/90 rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all shadow-sm placeholder:text-neutral-400 font-medium"
            autoFocus
          />
          {query && (
            <button
              onClick={handleClear}
              aria-label="खोज साफ़ करें"
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-700 transition cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center">
                <X size={14} />
              </div>
            </button>
          )}
        </div>

        {/* Quick Trending Tags */}
        <div className="mt-3.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-xs font-bold text-neutral-500 flex items-center gap-1 mr-1">
            <TrendingUp size={13} className="text-red-600" />
            <span>ट्रेंडिंग:</span>
          </span>
          {trendingTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-sans ${
                debouncedQuery === tag 
                  ? 'bg-red-600 text-white border-red-600 font-bold shadow-2xs' 
                  : 'bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-neutral-600 border-neutral-200/80'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* When actively searching */}
      {isSearching && (
        <div className="space-y-8">
          {/* Search Summary & Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                &ldquo;<span className="text-red-600">{debouncedQuery}</span>&rdquo; के लिए परिणाम
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
                कुल {totalResults} परिणाम मिले
              </p>
            </div>

            {/* Filter Tabs */}
            {totalResults > 0 && (
              <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl self-start sm:self-auto text-xs font-bold font-sans">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'all' 
                      ? 'bg-white text-neutral-900 shadow-2xs' 
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  सभी ({totalResults})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('articles')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'articles' 
                      ? 'bg-white text-neutral-900 shadow-2xs' 
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  समाचार ({results.articles.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('videos')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'videos' 
                      ? 'bg-white text-neutral-900 shadow-2xs' 
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  वीडियो ({results.videos.length})
                </button>
              </div>
            )}
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
              <Loader2 className="h-8 w-8 animate-spin text-red-600 mb-3" />
              <p className="text-sm font-devanagari">खोज जारी है...</p>
            </div>
          )}

          {/* No Results Empty State */}
          {!loading && totalResults === 0 && (
            <div className="text-center py-16 px-4 bg-white rounded-2xl border border-neutral-200/80 shadow-2xs max-w-xl mx-auto space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                <Search size={22} />
              </div>
              <h2 className="text-lg font-bold text-neutral-900">
                &ldquo;{debouncedQuery}&rdquo; से संबंधित कोई परिणाम नहीं मिला
              </h2>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                कृपया कीवर्ड की वर्तनी जांचें या किसी अन्य सामान्य विषय (जैसे राजनीति, खेल, बजट) से खोजें।
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
                >
                  सभी ताज़ा समाचार देखें
                </button>
              </div>
            </div>
          )}

          {/* Search Result Lists */}
          {!loading && totalResults > 0 && (
            <div className="space-y-12">
              
              {/* Articles Section */}
              {(activeTab === 'all' || activeTab === 'articles') && results.articles.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2.5 mb-5">
                    <span className="w-2 h-6 bg-red-600 rounded-full inline-block" />
                    <h2 className="text-lg sm:text-xl font-bold text-neutral-900 flex items-center space-x-2">
                      <FileText size={18} className="text-red-600" />
                      <span>समाचार लेख ({results.articles.length})</span>
                    </h2>
                  </div>

                  <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                    {results.articles.map((article: any) => (
                      <Link
                        key={article._id}
                        href={`/${article.category?.slug || 'news'}/${article.slug}`}
                        className="group bg-white rounded-2xl border border-neutral-200/80 p-4 hover:border-red-200 hover:shadow-xs transition-all flex gap-4"
                      >
                        <div className="w-28 sm:w-32 h-24 sm:h-28 flex-shrink-0 bg-neutral-100 rounded-xl overflow-hidden relative">
                          <img
                            src={article.coverImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400&auto=format&fit=crop&q=80'}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            {article.category?.name && (
                              <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide font-sans mb-1 block">
                                {article.category.name}
                              </span>
                            )}
                            <h3 className="font-bold text-neutral-900 text-sm sm:text-base group-hover:text-red-600 line-clamp-2 transition-colors leading-snug">
                              {article.title}
                            </h3>
                            <p className="text-xs text-neutral-500 line-clamp-2 mt-1 hidden sm:block">
                              {article.excerpt}
                            </p>
                          </div>
                          {article.publishedAt && (
                            <div className="flex items-center space-x-1 text-[11px] text-neutral-400 font-sans mt-2">
                              <Clock size={12} />
                              <span>{formatDate(article.publishedAt)}</span>
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Videos Section */}
              {(activeTab === 'all' || activeTab === 'videos') && results.videos.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2.5 mb-5">
                    <span className="w-2 h-6 bg-red-600 rounded-full inline-block" />
                    <h2 className="text-lg sm:text-xl font-bold text-neutral-900 flex items-center space-x-2">
                      <VideoIcon size={18} className="text-red-600" />
                      <span>वीडियो बुलेटिन ({results.videos.length})</span>
                    </h2>
                  </div>

                  <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {results.videos.map((video: any) => (
                      <Link
                        key={video._id}
                        href={`/video/${video.slug}`}
                        className="group bg-white rounded-2xl border border-neutral-200/80 overflow-hidden hover:border-red-200 hover:shadow-xs transition-all flex flex-col"
                      >
                        <div className="relative aspect-video w-full bg-neutral-900 overflow-hidden">
                          <img
                            src={video.thumbnailUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80'}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                              <Play size={16} className="ml-0.5 fill-current" />
                            </div>
                          </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <h3 className="font-bold text-neutral-900 text-sm group-hover:text-red-600 line-clamp-2 transition-colors">
                            {video.title}
                          </h3>
                          {video.publishedAt && (
                            <span className="text-[11px] text-neutral-400 font-sans mt-2 block">
                              {formatDate(video.publishedAt)}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      )}

      {/* When NO query is entered (Default State: Homepage content to fill empty space) */}
      {!isSearching && (
        <div className="space-y-12">
          
          {/* Section 1: Latest & Trending Stories */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6">
              <div className="flex items-center space-x-3">
                <span className="w-2 h-7 bg-red-600 rounded-full inline-block" />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider font-sans">
                      LATEST STORIES
                    </span>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight font-devanagari">
                    ताज़ा व प्रमुख समाचार (Trending News)
                  </h2>
                </div>
              </div>
              <Link 
                href="/"
                className="text-xs font-bold text-neutral-600 hover:text-red-600 transition flex items-center space-x-1 font-devanagari"
              >
                <span>होमपेज पर जाएं</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
                <Loader2 className="h-7 w-7 animate-spin text-red-600 mb-2" />
                <p className="text-xs">ताज़ा खबरें लोड हो रही हैं...</p>
              </div>
            ) : results.articles.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {results.articles.slice(0, 8).map((article: any) => (
                  <Link
                    key={article._id}
                    href={`/${article.category?.slug || 'news'}/${article.slug}`}
                    className="group bg-white rounded-2xl border border-neutral-200/80 overflow-hidden hover:border-red-200 hover:shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/10] w-full bg-neutral-100 overflow-hidden">
                        <img
                          src={article.coverImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80'}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {article.category?.name && (
                          <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-sans">
                            {article.category.name}
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-neutral-900 text-sm group-hover:text-red-600 line-clamp-2 transition-colors leading-snug">
                          {article.title}
                        </h3>
                        <p className="text-xs text-neutral-500 line-clamp-2 mt-1.5 leading-relaxed">
                          {article.excerpt}
                        </p>
                      </div>
                    </div>
                    <div className="px-4 pb-4 pt-1 flex items-center space-x-1.5 text-[11px] text-neutral-400 font-sans border-t border-neutral-100">
                      <Clock size={12} />
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          {/* Section 2: Video Bulletins (from Homepage Video Section) */}
          {results.videos.length > 0 && (
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6">
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-7 bg-red-600 rounded-full inline-block" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider font-sans">
                        MULTIMEDIA DESK
                      </span>
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight font-devanagari">
                      वीडियो बुलेटिन & स्पेशल रिपोर्ट्स
                    </h2>
                  </div>
                </div>
                <Link 
                  href="/videos"
                  className="text-xs font-bold text-neutral-600 hover:text-red-600 transition flex items-center space-x-1 font-devanagari"
                >
                  <span>सभी वीडियो देखें</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {results.videos.slice(0, 4).map((video: any) => (
                  <Link
                    key={video._id}
                    href={`/video/${video.slug}`}
                    className="group bg-white rounded-2xl border border-neutral-200/80 overflow-hidden hover:border-red-200 hover:shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-video w-full bg-neutral-900 overflow-hidden">
                        <img
                          src={video.thumbnailUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80'}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                            <Play size={16} className="ml-0.5 fill-current" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-neutral-900 text-sm group-hover:text-red-600 line-clamp-2 transition-colors">
                          {video.title}
                        </h3>
                      </div>
                    </div>
                    <div className="px-4 pb-4 pt-1 text-[11px] text-neutral-400 font-sans border-t border-neutral-100">
                      {formatDate(video.publishedAt)}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Categories Quick Discovery */}
          <div className="p-6 sm:p-8 rounded-2xl bg-neutral-100/70 border border-neutral-200/80">
            <div className="flex items-center space-x-2.5 mb-4">
              <Compass size={18} className="text-red-600" />
              <h3 className="text-base font-bold text-neutral-900">
                प्रमुख श्रेणियों के अनुसार खोजें
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { name: 'राष्ट्रीय', slug: 'national' },
                { name: 'राजनीति', slug: 'politics' },
                { name: 'खेल जगत', slug: 'sports' },
                { name: 'टेक्नोलॉजी', slug: 'technology' },
                { name: 'व्यापार', slug: 'business' },
                { name: 'मनोरंजन', slug: 'entertainment' },
              ].map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className="bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 p-3 rounded-xl border border-neutral-200 text-center font-bold text-xs text-neutral-700 transition shadow-2xs block"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-neutral-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          <p className="text-xs font-devanagari">खोज पृष्ठ तैयार हो रहा है...</p>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
