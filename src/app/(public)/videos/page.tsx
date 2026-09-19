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
    <div className="bg-neutral-50 min-h-screen font-devanagari pb-24">
      {/* Hero Banner Header */}
      <section className="relative overflow-hidden bg-white border-b border-neutral-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-50/50 via-white to-white pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="z-10">
            <div className="flex items-center space-x-3 mb-4">
              <span className="p-2.5 rounded-2xl bg-red-50 text-red-600 border border-red-100 shadow-sm">
                <Tv size={24} className="animate-pulse" />
              </span>
              <span className="text-sm font-extrabold uppercase tracking-[0.2em] text-red-600 font-sans">
                Central Lens Multimedia
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-neutral-900 tracking-tight leading-tight">
              वीडियो बुलेटिन <br className="hidden sm:block" />
              <span className="text-red-600">एवं पॉडकास्ट</span>
            </h1>
            <p className="text-neutral-500 text-base sm:text-lg mt-4 max-w-xl font-medium leading-relaxed">
              ग्राउंड रिपोर्ट, त्वरित शॉर्ट्स एवं विशेषज्ञों के साथ विशेष साक्षात्कार — आपका वीडियो-फर्स्ट न्यूज़ डेस्टिनेशन।
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="z-10 flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white/80 backdrop-blur-md border border-neutral-200/60 rounded-3xl p-2 shadow-xl shadow-neutral-200/50">
            <div className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-default">
              <Film size={18} className="text-blue-600" />
              <span className="text-sm font-bold text-neutral-700">लॉन्ग बुलेटिन</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-purple-50/50 hover:bg-purple-50 transition-colors cursor-default">
              <Smartphone size={18} className="text-purple-600" />
              <span className="text-sm font-bold text-neutral-700">शॉर्ट्स रील्स</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-amber-50/50 hover:bg-amber-50 transition-colors cursor-default">
              <Radio size={18} className="text-amber-600" />
              <span className="text-sm font-bold text-neutral-700">पॉडकास्ट</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 space-y-16">
        {/* Featured Video Spotlight */}
        {featuredVideo && currentType === 'all' && currentCategory === 'all' && (
          <section className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative rounded-3xl overflow-hidden bg-white border border-neutral-200 shadow-2xl shadow-neutral-200/50 flex flex-col lg:flex-row">
              {/* Thumbnail / Video Preview on Left */}
              <div className="lg:w-7/12 relative aspect-video bg-neutral-100 overflow-hidden isolate">
                <img
                  src={featuredVideo.thumbnailUrl}
                  alt={featuredVideo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/20 to-transparent" />

                <Link
                  href={`/video/${featuredVideo.slug}`}
                  className="absolute inset-0 flex items-center justify-center group/play"
                >
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-2xl transition-all duration-300 group-hover/play:scale-110 group-hover/play:bg-red-600 group-hover/play:border-red-500">
                    <Play size={32} className="fill-current translate-x-1" />
                  </div>
                </Link>

                {featuredVideo.duration > 0 && (
                  <span className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md font-mono text-xs text-white px-3 py-1.5 rounded-xl font-bold border border-white/10">
                    {formatDuration(featuredVideo.duration)}
                  </span>
                )}
              </div>

              {/* Story Details on Right */}
              <div className="lg:w-5/12 p-8 sm:p-10 flex flex-col justify-center bg-white z-10">
                <div>
                  <div className="flex items-center flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-red-50 text-red-600 border border-red-100">
                      <Sparkles size={14} className="fill-current" />
                      <span>विशेष कवरेज</span>
                    </span>
                    <span
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm"
                      style={{ backgroundColor: featuredVideo.category?.color || '#DC2626' }}
                    >
                      {featuredVideo.category?.name || 'समाचार'}
                    </span>
                  </div>

                  <Link href={`/video/${featuredVideo.slug}`} className="block group/title">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 group-hover/title:text-red-600 transition-colors leading-tight line-clamp-3">
                      {featuredVideo.title}
                    </h2>
                  </Link>

                  {featuredVideo.description && (
                    <p className="mt-4 text-base text-neutral-500 line-clamp-3 leading-relaxed font-medium">
                      {featuredVideo.description}
                    </p>
                  )}
                </div>

                <div className="pt-8 mt-8 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-neutral-500 font-sans">
                    <span className="flex items-center space-x-1.5">
                      <Eye size={16} className="text-neutral-400" />
                      <span className="font-bold text-neutral-700">{featuredVideo.views || 0}</span>
                    </span>
                    <span className="w-1 h-1 rounded-full bg-neutral-300" />
                    <span className="flex items-center space-x-1.5">
                      <Clock size={16} className="text-neutral-400" />
                      <span className="font-medium">
                        {new Date(featuredVideo.publishedAt || featuredVideo.createdAt).toLocaleDateString('hi-IN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </span>
                  </div>

                  <Link
                    href={`/video/${featuredVideo.slug}`}
                    className="inline-flex items-center space-x-2 w-10 h-10 bg-neutral-100 hover:bg-red-600 text-neutral-600 hover:text-white rounded-full justify-center transition-all shadow-sm hover:shadow-md hover:shadow-red-600/30"
                  >
                    <ChevronRight size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Central Lens Shorts / Reels Shelf */}
        {shorts.length > 0 && currentType !== 'podcast' && currentCategory === 'all' && (
          <section className="relative">
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <span className="p-1.5 rounded-xl bg-purple-100 text-purple-700">
                    <Smartphone size={20} />
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                    ट्रेंडिंग शॉर्ट्स
                  </h2>
                </div>
                <p className="text-neutral-500 text-sm font-medium ml-11">60 सेकंड में पूरी खबर</p>
              </div>
              <div className="hidden sm:flex items-center space-x-2 text-sm font-bold text-neutral-400">
                <span>स्क्रॉल करें</span>
                <ChevronRight size={16} />
              </div>
            </div>

            {/* Horizontal Reels Shelf */}
            <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-6 pt-2 px-2 -mx-2 snap-x snap-mandatory hide-scrollbar">
              {shorts.map((shortVid: any) => (
                <Link
                  key={shortVid._id}
                  href={`/video/${shortVid.slug}`}
                  className="group relative rounded-[2rem] overflow-hidden aspect-[9/16] bg-neutral-900 shadow-lg shadow-neutral-200/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 block flex-shrink-0 w-40 sm:w-48 snap-center hover:-translate-y-2 border-4 border-white"
                >
                  <img
                    src={shortVid.thumbnailUrl}
                    alt={shortVid.title}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4 flex flex-col justify-between">
                    <div className="flex justify-end">
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:bg-purple-600 group-hover:border-purple-500">
                        <Play size={12} className="fill-current translate-x-0.5" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white line-clamp-3 leading-snug drop-shadow-md">
                        {shortVid.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-2 text-xs text-neutral-300 font-sans font-medium">
                        <Eye size={12} className="text-purple-400" />
                        <span>{shortVid.views || 0}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Main Content with Sidebar Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start relative">
          
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-[90px] bg-white rounded-3xl border border-neutral-200/80 p-5 shadow-sm">
            <div className="mb-8">
              <h3 className="text-sm font-black text-neutral-900 uppercase tracking-widest mb-4">वीडियो फॉर्मेट</h3>
              <div className="flex flex-col gap-2">
                <Link
                  href={`/videos?type=all&category=${currentCategory}`}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    currentType === 'all'
                      ? 'bg-neutral-900 text-white shadow-md'
                      : 'bg-neutral-50 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border border-neutral-200/60'
                  }`}
                >
                  <Filter size={18} />
                  <span>सभी वीडियो</span>
                </Link>

                <Link
                  href={`/videos?type=long&category=${currentCategory}`}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    currentType === 'long'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'bg-neutral-50 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border border-neutral-200/60'
                  }`}
                >
                  <Film size={18} />
                  <span>लॉन्ग बुलेटिन</span>
                </Link>

                <Link
                  href={`/videos?type=short&category=${currentCategory}`}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    currentType === 'short'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                      : 'bg-neutral-50 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border border-neutral-200/60'
                  }`}
                >
                  <Smartphone size={18} />
                  <span>शॉर्ट्स / रील्स</span>
                </Link>

                <Link
                  href={`/videos?type=podcast&category=${currentCategory}`}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    currentType === 'podcast'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                      : 'bg-neutral-50 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border border-neutral-200/60'
                  }`}
                >
                  <Radio size={18} />
                  <span>पॉडकास्ट</span>
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black text-neutral-900 uppercase tracking-widest mb-4">विषय श्रेणी</h3>
              <div className="flex flex-col gap-2">
                <Link
                  href={`/videos?type=${currentType}&category=all`}
                  className={`px-4 py-3 rounded-2xl text-sm transition-all font-bold ${
                    currentCategory === 'all'
                      ? 'bg-red-50 text-red-600 border border-red-200 shadow-sm'
                      : 'bg-transparent text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
                  }`}
                >
                  सभी विषय
                </Link>
                {categories.map((cat: any) => (
                  <Link
                    key={cat.slug}
                    href={`/videos?type=${currentType}&category=${cat.slug}`}
                    className={`px-4 py-3 rounded-2xl text-sm transition-all font-bold ${
                      currentCategory === cat.slug
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                        : 'bg-transparent text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Video Grid */}
          <div className="flex-1 w-full">
            {videos.length === 0 ? (
              <div className="py-24 text-center bg-white rounded-[2rem] border border-neutral-200 shadow-sm flex flex-col items-center">
                <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
                  <Tv size={40} className="text-neutral-300" />
                </div>
                <h3 className="text-xl font-black text-neutral-900 mb-2">कोई वीडियो नहीं मिला</h3>
                <p className="text-sm font-medium text-neutral-500 mb-6">इस फिल्टर में वर्तमान में कोई वीडियो उपलब्ध नहीं है।</p>
                <Link href="/videos" className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-md transition-colors">
                  सभी वीडियो देखें
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {videos.map((vid: any) => {
                  const isVidShort = vid.videoType === 'short';
                  const isVidPodcast = vid.videoType === 'podcast';

                  return (
                    <Link
                      key={vid._id}
                      href={`/video/${vid.slug}`}
                      className="group bg-white rounded-3xl overflow-hidden border border-neutral-200/60 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-neutral-200/80 hover:-translate-y-1"
                    >
                      <div>
                        {/* Thumbnail Container */}
                        <div className="relative aspect-video w-full bg-neutral-100 overflow-hidden p-1.5 pb-0">
                          <div className="relative w-full h-full rounded-2xl overflow-hidden">
                            <img
                              src={vid.thumbnailUrl}
                              alt={vid.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />

                            {/* Hover Play Icon */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="w-14 h-14 rounded-full bg-white/90 text-red-600 flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                <Play size={24} className="fill-current translate-x-1" />
                              </div>
                            </div>

                            {/* Category Tag Top Left */}
                            <span
                              className="absolute top-3 left-3 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-white shadow-md backdrop-blur-md"
                              style={{ backgroundColor: vid.category?.color ? `${vid.category.color}e6` : '#DC2626e6' }}
                            >
                              {vid.category?.name || 'समाचार'}
                            </span>

                            {/* Duration Badge Bottom Right */}
                            {vid.duration > 0 && (
                              <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md font-mono text-[10px] text-white px-2 py-1 rounded-md font-bold">
                                {formatDuration(vid.duration)}
                              </span>
                            )}

                            {/* Type Icon Badge Bottom Left */}
                            {isVidShort && (
                              <span className="absolute bottom-3 left-3 bg-purple-600/90 backdrop-blur-md text-white px-2 py-1 rounded-md text-[10px] font-bold flex items-center space-x-1.5 shadow-sm">
                                <Smartphone size={12} />
                                <span>Shorts</span>
                              </span>
                            )}
                            {isVidPodcast && (
                              <span className="absolute bottom-3 left-3 bg-amber-600/90 backdrop-blur-md text-white px-2 py-1 rounded-md text-[10px] font-bold flex items-center space-x-1.5 shadow-sm">
                                <Radio size={12} />
                                <span>Podcast</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <h3 className="font-bold text-lg text-neutral-900 group-hover:text-red-600 line-clamp-2 leading-snug transition-colors">
                            {vid.title}
                          </h3>
                          {vid.description && (
                            <p className="text-sm text-neutral-500 mt-2 line-clamp-2 leading-relaxed font-medium">
                              {vid.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Footer Stats */}
                      <div className="px-5 pb-5 mt-2 flex items-center justify-between text-xs text-neutral-400 font-sans font-medium">
                        <span className="flex items-center space-x-1.5">
                          <Eye size={14} className="text-neutral-300 group-hover:text-red-400 transition-colors" />
                          <span className="group-hover:text-neutral-600 transition-colors">{vid.views || 0}</span>
                        </span>

                        <span className="flex items-center space-x-1.5">
                          <Clock size={14} className="text-neutral-300" />
                          <span>
                            {new Date(vid.publishedAt || vid.createdAt).toLocaleDateString('hi-IN', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
