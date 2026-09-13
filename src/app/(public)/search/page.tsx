'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Loader2, FileText, Video } from 'lucide-react';

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [results, setResults] = useState<{ articles: any[]; videos: any[] }>({ articles: [], videos: [] });
  const [loading, setLoading] = useState(false);

  // Debounce the input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      if (query !== searchParams.get('q')) {
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        router.replace(`/search?${params.toString()}`);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [query, router, searchParams]);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults({ articles: [], videos: [] });
      return;
    }

    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        setResults({ articles: data.articles || [], videos: data.videos || [] });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [debouncedQuery]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-[60vh]">
      <div className="relative mb-12">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for articles, news, videos..."
          className="block w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-100 rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all shadow-sm placeholder-gray-400 font-medium"
        />
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Loader2 className="h-10 w-10 animate-spin mb-4" />
          <p>Searching through our archives...</p>
        </div>
      )}

      {!loading && query && results.articles.length === 0 && results.videos.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl">No results found for "{query}"</p>
          <p className="mt-2 text-sm">Try using different keywords or check spelling.</p>
        </div>
      )}

      {!loading && (results.articles.length > 0 || results.videos.length > 0) && (
        <div className="space-y-12">
          {results.articles.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center border-b pb-2">
                <FileText className="mr-2 text-red-600" /> Articles
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {results.articles.map((article: any) => (
                  <Link
                    key={article._id}
                    href={`/${article.category?.slug || 'news'}/${article.slug}`}
                    className="block group"
                  >
                    <div className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                      <div className="w-24 h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden relative">
                        <img
                          src={article.coverImage || '/placeholder.jpg'}
                          alt={article.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 group-hover:text-red-600 line-clamp-2 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{article.excerpt}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.videos.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center border-b pb-2">
                <Video className="mr-2 text-red-600" /> Videos
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {results.videos.map((video: any) => (
                  <Link
                    key={video._id}
                    href={`/video/${video.slug}`}
                    className="block group"
                  >
                    <div className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                      <div className="w-32 h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden relative">
                        <img
                          src={video.thumbnailUrl || '/placeholder.jpg'}
                          alt={video.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                            <div className="w-0 h-0 border-t-4 border-t-transparent border-l-[6px] border-l-white border-b-4 border-b-transparent ml-1" />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 py-1">
                        <h3 className="font-bold text-gray-900 group-hover:text-red-600 line-clamp-2 transition-colors">
                          {video.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>}>
      <SearchResults />
    </Suspense>
  );
}
