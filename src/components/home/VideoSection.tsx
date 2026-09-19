'use client';

import Link from 'next/link';
import { Play, Tv, ChevronRight, Smartphone, Eye, Sparkles, Clock, Film } from 'lucide-react';
import { formatDuration } from '@/lib/utils/video';

interface VideoItem {
  _id: string;
  title: string;
  slug: string;
  thumbnailUrl: string;
  videoUrl: string;
  videoType: 'long' | 'short' | 'podcast';
  duration: number;
  category?: {
    name: string;
    slug: string;
    color?: string;
  };
  views?: number;
  publishedAt?: string;
  createdAt?: string;
  description?: string;
}

interface VideoSectionProps {
  featuredVideo?: VideoItem | null;
  recentVideos: VideoItem[];
  shorts: VideoItem[];
}

function formatVideoDate(date?: string | Date | null): string {
  if (!date) return 'हाल ही में';
  return new Date(date).toLocaleDateString('hi-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatVideoShortDate(date?: string | Date | null): string {
  if (!date) return 'हाल ही में';
  return new Date(date).toLocaleDateString('hi-IN', {
    month: 'short',
    day: 'numeric',
  });
}

export default function VideoSection({
  featuredVideo,
  recentVideos,
  shorts,
}: VideoSectionProps) {
  if (!featuredVideo && recentVideos.length === 0 && shorts.length === 0) {
    return null;
  }

  const spotlight = featuredVideo || recentVideos[0];
  const sideVideos = recentVideos.filter((v) => v._id !== spotlight?._id).slice(0, 3);

  return (
    <section className="my-14 font-devanagari">
      <div className="bg-neutral-50/70 rounded-3xl p-5 sm:p-8 border border-neutral-200/90 shadow-2xs text-neutral-900">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center">
              <Tv size={20} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider font-sans">
                  MULTIMEDIA DESK
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">
                वीडियो बुलेटिन &amp; स्पेशल रिपोर्ट्स
              </h2>
            </div>
          </div>

          <Link
            href="/videos"
            className="inline-flex items-center space-x-2 text-xs font-bold text-neutral-700 hover:text-red-600 transition-colors self-start sm:self-auto bg-white px-4 py-2 rounded-xl border border-neutral-200 hover:border-red-200 shadow-2xs"
          >
            <span>सभी वीडियो देखें</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Top Grid: Spotlight on Left, Rail on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Spotlight Hero Video */}
          {spotlight && (
            <div className="lg:col-span-7 flex flex-col justify-between">
              <Link
                href={`/video/${spotlight.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-video bg-neutral-100 border border-neutral-200/80 block shadow-sm"
              >
                <img
                  src={spotlight.thumbnailUrl}
                  alt={spotlight.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Big Center Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-600 group-hover:bg-red-700 text-white flex items-center justify-center shadow-xl shadow-red-600/40 group-hover:scale-110 transition-transform">
                    <Play size={24} className="fill-current translate-x-0.5" />
                  </div>
                </div>

                {/* Category Badge */}
                <span
                  className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-xs font-black text-white shadow-md"
                  style={{ backgroundColor: spotlight.category?.color || '#DC2626' }}
                >
                  {spotlight.category?.name || 'समाचार'}
                </span>

                {/* Duration Badge */}
                {spotlight.duration > 0 && (
                  <span className="absolute bottom-3 right-3 bg-black/80 font-mono text-xs text-white px-2.5 py-1 rounded-lg font-bold">
                    {formatDuration(spotlight.duration)}
                  </span>
                )}
              </Link>

              <div className="mt-4">
                <Link href={`/video/${spotlight.slug}`}>
                  <h3 className="text-lg sm:text-xl font-black text-neutral-900 hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                    {spotlight.title}
                  </h3>
                </Link>
                {spotlight.description && (
                  <p className="text-xs sm:text-sm text-neutral-600 mt-2 line-clamp-2 leading-relaxed">
                    {spotlight.description}
                  </p>
                )}
                <div className="flex items-center space-x-3 text-xs text-neutral-500 font-sans mt-3">
                  <span className="flex items-center space-x-1 text-neutral-600">
                    <Eye size={12} className="text-red-600" />
                    <span>{spotlight.views || 0} व्यूज</span>
                  </span>
                  <span>•</span>
                  <span>{formatVideoDate(spotlight.publishedAt || spotlight.createdAt)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Right Rail: 3 Side Video Stories */}
          <div className="lg:col-span-5 space-y-3.5 flex flex-col justify-between">
            {sideVideos.map((vid) => (
              <Link
                key={vid._id}
                href={`/video/${vid.slug}`}
                className="group flex space-x-3.5 p-3 rounded-2xl bg-white hover:bg-neutral-50 border border-neutral-200/80 hover:border-neutral-300 shadow-2xs hover:shadow-xs transition-all"
              >
                {/* Thumbnail */}
                <div className="relative w-32 sm:w-36 h-20 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                  <img
                    src={vid.thumbnailUrl}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow">
                      <Play size={12} className="fill-current translate-x-0.2" />
                    </div>
                  </div>
                  {vid.duration > 0 && (
                    <span className="absolute bottom-1 right-1 bg-black/80 font-mono text-[9px] text-white px-1 py-0.5 rounded font-bold">
                      {formatDuration(vid.duration)}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: vid.category?.color || '#DC2626' }}
                  >
                    {vid.category?.name || 'समाचार'}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-red-600 line-clamp-2 leading-snug transition-colors">
                    {vid.title}
                  </h4>
                  <div className="flex items-center space-x-2 text-[10px] text-neutral-500 font-sans mt-1">
                    <span>{vid.views || 0} व्यूज</span>
                    <span>•</span>
                    <span>{formatVideoShortDate(vid.publishedAt || vid.createdAt)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Shelf: Central Lens Shorts Strip */}
        {shorts.length > 0 && (
          <div className="mt-8 pt-6 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Smartphone size={16} className="text-purple-600" />
                <h3 className="text-base font-black text-neutral-900">
                  सेंट्रल लेंस शॉर्ट्स (60s Quick News)
                </h3>
              </div>
              <Link
                href="/videos?type=short"
                className="text-xs font-bold text-purple-600 hover:text-purple-700"
              >
                सभी शॉर्ट्स →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {shorts.slice(0, 4).map((shortVid) => (
                <Link
                  key={shortVid._id}
                  href={`/video/${shortVid.slug}`}
                  className="group relative rounded-2xl overflow-hidden aspect-[9/16] bg-neutral-900 border border-neutral-200 shadow-xs hover:shadow-md hover:border-purple-400 transition-all block"
                >
                  <img
                    src={shortVid.thumbnailUrl}
                    alt={shortVid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-3 flex flex-col justify-between">
                    <div className="flex justify-end">
                      <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shadow">
                        <Play size={10} className="fill-current translate-x-0.2" />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-3 leading-snug">
                        {shortVid.title}
                      </h4>
                      <span className="text-[10px] text-neutral-300 mt-1 font-sans block">
                        {shortVid.views || 0} व्यूज
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
