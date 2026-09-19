import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import dbConnect from '@/lib/db/connect';
import { Video } from '@/lib/db/models/Video';
import '@/lib/db/models/Category';
import VideoPlayer from '@/components/video/VideoPlayer';
import ShareButtons from '@/components/article/ShareButtons';
import { 
  Clock, 
  Calendar, 
  ArrowLeft, 
  Eye, 
  ShieldCheck, 
  Play, 
  Film, 
  Smartphone, 
  Radio,
  Tag,
  Sparkles
} from 'lucide-react';
import { formatDuration } from '@/lib/utils/video';

interface VideoPageProps {
  params: Promise<{ slug: string }>;
}

async function getVideo(slug: string) {
  try {
    await dbConnect();
    const video = await Video.findOneAndUpdate(
      { slug, status: 'published' },
      { $inc: { views: 1 } },
      { returnDocument: 'after' }
    )
      .populate('category', 'name slug color')
      .lean();
    return video;
  } catch (error) {
    console.error('Error fetching video:', error);
    return null;
  }
}

async function getRelatedVideos(categoryId: any, currentSlug: string) {
  try {
    await dbConnect();
    const related = await Video.find({
      category: categoryId,
      slug: { $ne: currentSlug },
      status: 'published',
    })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(6)
      .populate('category', 'name slug color')
      .lean();
    return JSON.parse(JSON.stringify(related));
  } catch {
    return [];
  }
}

async function getTrendingShorts(currentSlug: string) {
  try {
    await dbConnect();
    const shorts = await Video.find({
      videoType: 'short',
      slug: { $ne: currentSlug },
      status: 'published',
    })
      .sort({ views: -1, createdAt: -1 })
      .limit(4)
      .populate('category', 'name slug color')
      .lean();
    return JSON.parse(JSON.stringify(shorts));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: VideoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const video: any = await getVideo(slug);
  if (!video) return { title: 'वीडियो नहीं मिला | Central Lens' };

  return {
    title: `${video.title} | Central Lens वीडियो`,
    description: video.description || 'Central Lens पर नवीनतम वीडियो रिपोर्ट देखें।',
    openGraph: {
      title: video.title,
      description: video.description,
      images: video.thumbnailUrl ? [{ url: video.thumbnailUrl }] : [],
    },
  };
}

export default async function VideoWatchPage({ params }: VideoPageProps) {
  const { slug } = await params;
  const video: any = await getVideo(slug);

  if (!video) {
    notFound();
  }

  const categoryId = video.category?._id || video.category;
  const [relatedVideos, trendingShorts] = await Promise.all([
    getRelatedVideos(categoryId, slug),
    getTrendingShorts(slug),
  ]);

  const catName = video.category?.name || 'समाचार';
  const catColor = video.category?.color || '#DC2626';
  const isShort = video.videoType === 'short';
  const isPodcast = video.videoType === 'podcast';

  const publishedDateFormatted = new Date(video.publishedAt || video.createdAt).toLocaleDateString('hi-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white text-neutral-900 min-h-screen font-devanagari pb-20">
      {/* Top Navigation Strip */}
      <div className="border-b border-neutral-200 bg-neutral-50/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between text-xs">
          <Link
            href="/videos"
            className="inline-flex items-center space-x-2 text-neutral-600 hover:text-red-600 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>वीडियो हब (All Videos)</span>
          </Link>

          <div className="flex items-center space-x-2">
            <span
              className="w-2 h-2 rounded-full shadow-xs"
              style={{ backgroundColor: catColor }}
            />
            <span className="text-neutral-700 font-bold">{catName}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {/* Main Grid: Player on Left, Rail on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Main Video Column */}
          <div className={`${isShort ? 'lg:col-span-7 flex flex-col items-center' : 'lg:col-span-8'}`}>
            {/* Player Container */}
            <div className="w-full">
              <VideoPlayer
                videoUrl={video.videoUrl}
                title={video.title}
                thumbnailUrl={video.thumbnailUrl}
                videoType={video.videoType}
              />
            </div>

            {/* Title & Metadata Info */}
            <div className="mt-6 w-full">
              {/* Category & Format Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className="px-3 py-1 rounded-full text-xs font-black text-white shadow-2xs"
                  style={{ backgroundColor: catColor }}
                >
                  {catName}
                </span>

                {isShort ? (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    <Smartphone size={12} />
                    <span>शॉर्ट्स (Reel)</span>
                  </span>
                ) : isPodcast ? (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    <Radio size={12} />
                    <span>पॉडकास्ट</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    <Film size={12} />
                    <span>लॉन्ग वीडियो</span>
                  </span>
                )}

                {video.isFeatured && (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-200">
                    <Sparkles size={11} className="fill-current" />
                    <span>मुख्य बुलेटिन</span>
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 leading-tight tracking-tight mb-4">
                {video.title}
              </h1>

              {/* Author & Stats Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 border-t border-b border-neutral-200 text-xs text-neutral-500 font-sans">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-sm shadow-2xs">
                    {video.author?.name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900 block font-devanagari text-sm">
                      {video.author?.name || 'Central Lens Bureau'}
                    </span>
                    <span className="text-[11px] text-neutral-500">सेंट्रल लेंस वीडियो टीम</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1 text-neutral-700 font-medium">
                    <Eye size={14} className="text-red-600" />
                    <span>{video.views || 1} व्यूज</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1 text-neutral-500">
                    <Calendar size={13} className="text-neutral-400" />
                    <span>{publishedDateFormatted}</span>
                  </span>
                  {video.duration > 0 && (
                    <>
                      <span>•</span>
                      <span className="flex items-center space-x-1 text-neutral-500">
                        <Clock size={13} className="text-neutral-400" />
                        <span>{formatDuration(video.duration)}</span>
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Share Controls */}
              <div className="pt-2">
                <ShareButtons title={video.title} />
              </div>

              {/* Description Box */}
              {video.description && (
                <div className="mt-4 p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                    विवरण (Video Overview)
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-800 leading-relaxed whitespace-pre-line font-medium">
                    {video.description}
                  </p>
                </div>
              )}

              {/* Tags */}
              {video.tags && video.tags.length > 0 && (
                <div className="mt-6">
                  <div className="flex flex-wrap gap-2">
                    {video.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="bg-neutral-100 border border-neutral-200 text-neutral-700 font-medium px-3.5 py-1.5 rounded-full text-xs hover:border-red-600 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Editorial Guarantee Card */}
              <div className="mt-8 p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 text-sm">Central Lens वीडियो डेस्क</h4>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    यह वीडियो रिपोर्ट हमारे डिजिटल न्यूजरूम द्वारा सत्यापित स्रोतों और ग्राउंड इनपुट्स के आधार पर तैयार की गई है।
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Related Videos & Shorts Strip */}
          <div className={`${isShort ? 'lg:col-span-5' : 'lg:col-span-4'} space-y-8`}>
            {/* Related Videos List */}
            <div>
              <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-neutral-200">
                <span className="w-2 h-5 bg-red-600 rounded-full inline-block"></span>
                <h3 className="text-base sm:text-lg font-black text-neutral-900">
                  संबंधित वीडियो (Related Videos)
                </h3>
              </div>

              {relatedVideos.length === 0 ? (
                <div className="text-xs text-neutral-500 p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
                  इस श्रेणी में अन्य वीडियो जल्द आ रहे हैं।
                </div>
              ) : (
                <div className="space-y-3.5">
                  {relatedVideos.map((rel: any) => {
                    const isRelShort = rel.videoType === 'short';
                    return (
                      <Link
                        key={rel._id}
                        href={`/video/${rel.slug}`}
                        className="group flex space-x-3 p-2.5 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-200/80 hover:border-neutral-300 shadow-2xs transition-all"
                      >
                        {/* Thumbnail */}
                        <div
                          className={`relative rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0 ${
                            isRelShort ? 'w-14 h-20' : 'w-28 h-18 sm:w-32 sm:h-20'
                          }`}
                        >
                          <img
                            src={rel.thumbnailUrl}
                            alt={rel.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 flex items-center justify-center transition">
                            <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow">
                              <Play size={10} className="fill-current translate-x-0.5" />
                            </div>
                          </div>
                          {rel.duration > 0 && (
                            <span className="absolute bottom-1 right-1 bg-black/80 font-mono text-[9px] text-white px-1 py-0.5 rounded font-bold">
                              {formatDuration(rel.duration)}
                            </span>
                          )}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <h4 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-red-600 line-clamp-2 leading-snug transition-colors">
                            {rel.title}
                          </h4>
                          <div className="flex items-center space-x-2 text-[10px] text-neutral-500 font-sans mt-1">
                            <span>{rel.views || 0} व्यूज</span>
                            <span>•</span>
                            <span>
                              {new Date(rel.publishedAt || rel.createdAt).toLocaleDateString('hi-IN', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Trending Shorts Quick Strip */}
            {trendingShorts.length > 0 && (
              <div className="pt-4 border-t border-neutral-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Smartphone size={16} className="text-purple-600" />
                    <h3 className="text-sm font-black text-neutral-900">
                      ट्रेंडिंग शॉर्ट्स (Reels)
                    </h3>
                  </div>
                  <Link href="/videos?type=short" className="text-[11px] text-purple-600 hover:text-purple-700 font-bold">
                    सभी देखें →
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {trendingShorts.map((shortVid: any) => (
                    <Link
                      key={shortVid._id}
                      href={`/video/${shortVid.slug}`}
                      className="group relative rounded-xl overflow-hidden aspect-[9/16] bg-neutral-900 border border-neutral-200 shadow-2xs hover:shadow-md block transition-all"
                    >
                      <img
                        src={shortVid.thumbnailUrl}
                        alt={shortVid.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-2.5 flex flex-col justify-end">
                        <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center mb-1.5 shadow">
                          <Play size={8} className="fill-current translate-x-0.2" />
                        </div>
                        <h5 className="text-[11px] font-bold text-white line-clamp-2 leading-tight">
                          {shortVid.title}
                        </h5>
                        <span className="text-[9px] text-neutral-300 mt-1 font-sans">
                          {shortVid.views || 0} व्यूज
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
