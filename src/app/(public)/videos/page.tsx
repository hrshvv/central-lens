import Link from 'next/link';
import type { Metadata } from 'next';
import dbConnect from '@/lib/db/connect';
import { Video } from '@/lib/db/models/Video';
import { Category } from '@/lib/db/models/Category';
import '@/lib/db/models/Category';
import { 
  Play, 
  Sparkles, 
  Smartphone, 
  Film, 
  Radio, 
  Eye, 
  Clock, 
  Tv, 
  Flame,
  ChevronRight,
  Filter
} from 'lucide-react';
import { formatDuration } from '@/lib/utils/video';

export const metadata: Metadata = {
  title: 'वीडियो समाचार एवं विश्लेषण (Videos) | Central Lens',
  description: 'सेंट्रल लेंस पर देश, राजनीति, खेल, बिज़नेस और तकनीक के ताजा वीडियो बुलेटिन, शॉर्ट्स और पॉडकास्ट देखें।',
};

interface VideosPageProps {
  searchParams: Promise<{
    type?: string;
    category?: string;
  }>;
}

async function getVideosData(typeFilter?: string, categorySlug?: string) {
  try {
    await dbConnect();

    // 1. Featured Spotlight Video
    const featuredVideo = await Video.findOne({ status: 'published', isFeatured: true })
      .populate('category', 'name slug color')
      .lean();

    // 2. Shorts / Reels for dedicated shelf
    const shorts = await Video.find({ status: 'published', videoType: 'short' })
      .sort({ views: -1, createdAt: -1 })
      .limit(6)
      .populate('category', 'name slug color')
      .lean();

    // 3. Filtered Videos Query
    const query: Record<string, any> = { status: 'published' };
    if (typeFilter && typeFilter !== 'all') {
      query.videoType = typeFilter;
    }
    if (categorySlug && categorySlug !== 'all') {
      const cat = await Category.findOne({ slug: categorySlug }).lean();
      if (cat) {
        query.category = cat._id;
      }
    }

    const videos = await Video.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(30)
      .populate('category', 'name slug color')
      .lean();

    // 4. Categories list
    const categories = await Category.find().sort({ order: 1 }).lean();

    const featured = featuredVideo || videos[0] || null;

    return {
      featuredVideo: featured ? JSON.parse(JSON.stringify(featured)) : null,
      shorts: JSON.parse(JSON.stringify(shorts)),
      videos: JSON.parse(JSON.stringify(videos)),
      categories: JSON.parse(JSON.stringify(categories)),
    };
  } catch (error) {
    console.error('Error in getVideosData:', error);
    return { featuredVideo: null, shorts: [], videos: [], categories: [] };
  }
}

export default async function VideosHubPage({ searchParams }: VideosPageProps) {
  const { type: currentType = 'all', category: currentCategory = 'all' } = await searchParams;
  const { featuredVideo, shorts, videos, categories }: any = await getVideosData(currentType, currentCategory);


  return (
    <div className="bg-neutral-50/50 text-neutral-900 min-h-screen font-devanagari pb-24">
      {/* Hero Banner Header */}
      <section className="relative border-b border-neutral-200 bg-white px-4 sm:px-6 pt-10 pb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-200">
                <Tv size={22} />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-red-600 font-sans">
                CENTRAL LENS MULTIMEDIA
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-900 tracking-tight">
              वीडियो बुलेटिन एवं पॉडकास्ट
            </h1>
            <p className="text-neutral-600 text-sm sm:text-base mt-2 max-w-2xl font-medium">
              ग्राउंड रिपोर्ट, त्वरित शॉर्ट्स एवं विशेषज्ञों के साथ विशेष साक्षात्कार — वीडियो-फर्स्ट पत्रकारिता।
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center space-x-3 bg-neutral-50 border border-neutral-200 rounded-2xl p-3 text-xs">
            <div className="flex items-center space-x-1.5 text-neutral-700">
              <Film size={14} className="text-blue-600" />
              <span>लॉन्ग बुलेटिन</span>
            </div>
            <span className="text-neutral-300">•</span>
            <div className="flex items-center space-x-1.5 text-neutral-700">
              <Smartphone size={14} className="text-purple-600" />
              <span>शॉर्ट्स रील्स</span>
            </div>
            <span className="text-neutral-300">•</span>
            <div className="flex items-center space-x-1.5 text-neutral-700">
              <Radio size={14} className="text-amber-600" />
              <span>पॉडकास्ट</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 space-y-12">
        {/* Featured Video Spotlight */}
        {featuredVideo && currentType === 'all' && currentCategory === 'all' && (
          <section className="relative rounded-3xl overflow-hidden bg-white border border-neutral-200 shadow-sm group">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Thumbnail / Video Preview on Left */}
              <div className="lg:col-span-7 relative aspect-video bg-neutral-100 overflow-hidden">
                <img
                  src={featuredVideo.thumbnailUrl}
                  alt={featuredVideo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <Link
                  href={`/video/${featuredVideo.slug}`}
                  className="absolute inset-0 flex items-center justify-center group-hover:bg-black/20 transition-colors"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600 group-hover:bg-red-700 text-white flex items-center justify-center shadow-xl shadow-red-600/40 group-hover:scale-110 transition-transform">
                    <Play size={28} className="fill-current translate-x-0.5" />
                  </div>
                </Link>

                {featuredVideo.duration > 0 && (
                  <span className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-xs font-mono text-xs text-white px-2.5 py-1 rounded-lg font-bold">
                    {formatDuration(featuredVideo.duration)}
                  </span>
                )}
              </div>

              {/* Story Details on Right */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white">
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-black bg-red-600 text-white">
                      <Sparkles size={12} className="fill-current" />
                      <span>आज का मुख्य वीडियो</span>
                    </span>
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-2xs"
                      style={{ backgroundColor: featuredVideo.category?.color || '#DC2626' }}
                    >
                      {featuredVideo.category?.name || 'समाचार'}
                    </span>
                  </div>

                  <Link href={`/video/${featuredVideo.slug}`}>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-neutral-900 hover:text-red-600 transition-colors leading-tight line-clamp-3">
                      {featuredVideo.title}
                    </h2>
                  </Link>

                  {featuredVideo.description && (
                    <p className="mt-3 text-sm text-neutral-600 line-clamp-3 leading-relaxed font-medium">
                      {featuredVideo.description}
                    </p>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-between">
                  <div className="text-xs text-neutral-500 font-sans">
                    <span className="font-bold text-neutral-700">{featuredVideo.views || 0} व्यूज</span>
                    <span className="mx-2">•</span>
                    <span>
                      {new Date(featuredVideo.publishedAt || featuredVideo.createdAt).toLocaleDateString('hi-IN', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <Link
                    href={`/video/${featuredVideo.slug}`}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95"
                  >
                    <span>अभी देखें</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Central Lens Shorts / Reels Shelf */}
        {shorts.length > 0 && currentType !== 'podcast' && currentCategory === 'all' && (
          <section className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <span className="p-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
                  <Smartphone size={18} />
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
                  सेंट्रल लेंस शॉर्ट्स (60s Quick News)
                </h2>
              </div>
              <span className="text-xs font-bold text-purple-600">स्वाइप करें →</span>
            </div>

            {/* Horizontal Reels Shelf */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto pb-2">
              {shorts.map((shortVid: any) => (
                <Link
                  key={shortVid._id}
                  href={`/video/${shortVid.slug}`}
                  className="group relative rounded-2xl overflow-hidden aspect-[9/16] bg-neutral-900 border border-neutral-200 hover:border-purple-400 shadow-xs hover:shadow-md transition-all block flex-shrink-0"
                >
                  <img
                    src={shortVid.thumbnailUrl}
                    alt={shortVid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent p-3 flex flex-col justify-between">
                    <div className="flex justify-end">
                      <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shadow">
                        <Play size={10} className="fill-current translate-x-0.2" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-white line-clamp-3 leading-snug">
                        {shortVid.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1.5 text-[10px] text-neutral-300 font-sans">
                        <Eye size={10} className="text-purple-400" />
                        <span>{shortVid.views || 0}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Filter Navigation Bar */}
        <section className="pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
            {/* Format Filter Tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <Link
                href={`/videos?type=all&category=${currentCategory}`}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  currentType === 'all'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 border border-neutral-200'
                }`}
              >
                सभी वीडियो ({videos.length})
              </Link>

              <Link
                href={`/videos?type=long&category=${currentCategory}`}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  currentType === 'long'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 border border-neutral-200'
                }`}
              >
                <Film size={13} />
                <span>लॉन्ग बुलेटिन</span>
              </Link>

              <Link
                href={`/videos?type=short&category=${currentCategory}`}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  currentType === 'short'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 border border-neutral-200'
                }`}
              >
                <Smartphone size={13} />
                <span>शॉर्ट्स / रील्स</span>
              </Link>

              <Link
                href={`/videos?type=podcast&category=${currentCategory}`}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  currentType === 'podcast'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 border border-neutral-200'
                }`}
              >
                <Radio size={13} />
                <span>पॉडकास्ट</span>
              </Link>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto text-xs pb-1 sm:pb-0">
              <Link
                href={`/videos?type=${currentType}&category=all`}
                className={`px-3 py-1.5 rounded-lg transition border ${
                  currentCategory === 'all'
                    ? 'bg-neutral-900 text-white font-bold border-neutral-900'
                    : 'bg-white text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 border-neutral-200 font-medium'
                }`}
              >
                सभी विषय
              </Link>
              {categories.slice(0, 6).map((cat: any) => (
                <Link
                  key={cat.slug}
                  href={`/videos?type=${currentType}&category=${cat.slug}`}
                  className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap border ${
                    currentCategory === cat.slug
                      ? 'bg-red-600 text-white font-bold border-red-600 shadow-2xs'
                      : 'bg-white text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 border-neutral-200 font-medium'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Video Grid */}
        <section>
          {videos.length === 0 ? (
            <div className="py-20 text-center text-neutral-500 bg-white rounded-3xl border border-neutral-200 shadow-2xs">
              <Tv size={36} className="mx-auto mb-3 opacity-40 text-neutral-400" />
              <p className="text-base font-bold text-neutral-700">इस फिल्टर में कोई वीडियो नहीं मिला।</p>
              <Link href="/videos" className="text-xs text-red-600 font-bold hover:underline mt-2 inline-block">
                सभी वीडियो देखें →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((vid: any) => {
                const isVidShort = vid.videoType === 'short';
                const isVidPodcast = vid.videoType === 'podcast';

                return (
                  <Link
                    key={vid._id}
                    href={`/video/${vid.slug}`}
                    className="group bg-white hover:bg-neutral-50/50 rounded-2xl overflow-hidden border border-neutral-200/90 hover:border-neutral-300 transition-all flex flex-col justify-between shadow-2xs hover:shadow-md"
                  >
                    <div>
                      {/* Thumbnail Container */}
                      <div className="relative aspect-video w-full bg-neutral-100 overflow-hidden">
                        <img
                          src={vid.thumbnailUrl}
                          alt={vid.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />

                        {/* Hover Play Icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                            <Play size={18} className="fill-current translate-x-0.5" />
                          </div>
                        </div>

                        {/* Category Tag Top Left */}
                        <span
                          className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[11px] font-bold text-white shadow-2xs"
                          style={{ backgroundColor: vid.category?.color || '#DC2626' }}
                        >
                          {vid.category?.name || 'समाचार'}
                        </span>

                        {/* Duration Badge Bottom Right */}
                        {vid.duration > 0 && (
                          <span className="absolute bottom-3 right-3 bg-black/80 font-mono text-xs text-white px-2 py-0.5 rounded font-bold">
                            {formatDuration(vid.duration)}
                          </span>
                        )}

                        {/* Type Icon Badge Bottom Left */}
                        {isVidShort && (
                          <span className="absolute bottom-3 left-3 bg-purple-900/80 text-purple-200 px-2 py-0.5 rounded text-[10px] font-bold flex items-center space-x-1">
                            <Smartphone size={10} />
                            <span>Shorts</span>
                          </span>
                        )}
                        {isVidPodcast && (
                          <span className="absolute bottom-3 left-3 bg-amber-900/80 text-amber-200 px-2 py-0.5 rounded text-[10px] font-bold flex items-center space-x-1">
                            <Radio size={10} />
                            <span>Podcast</span>
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-bold text-base text-neutral-900 group-hover:text-red-600 line-clamp-2 leading-snug transition-colors">
                          {vid.title}
                        </h3>
                        {vid.description && (
                          <p className="text-xs text-neutral-600 mt-2 line-clamp-2 leading-relaxed">
                            {vid.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Footer Stats */}
                    <div className="p-4 pt-0 border-t border-neutral-100 mt-3 flex items-center justify-between text-xs text-neutral-500 font-sans">
                      <span className="flex items-center space-x-1 text-neutral-600">
                        <Eye size={12} className="text-red-600" />
                        <span>{vid.views || 0} व्यूज</span>
                      </span>

                      <span>
                        {new Date(vid.publishedAt || vid.createdAt).toLocaleDateString('hi-IN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
