'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import { parseVideoUrl } from '@/lib/utils/video';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  thumbnailUrl?: string;
  videoType?: 'long' | 'short' | 'podcast';
}

export default function VideoPlayer({
  videoUrl,
  title,
  thumbnailUrl,
  videoType = 'long',
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const parsed = parseVideoUrl(videoUrl);
  const isShort = videoType === 'short' || parsed.isShort;

  // Append autoplay param when user clicks play
  const embedSrc = isPlaying
    ? `${parsed.embedUrl}${parsed.embedUrl.includes('?') ? '&' : '?'}autoplay=1`
    : parsed.embedUrl;

  const posterImage =
    thumbnailUrl ||
    parsed.thumbnailUrl ||
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80';

  return (
    <div className="relative w-full flex justify-center">
      {/* Ambient background glow for rich aesthetic */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-20 scale-105 pointer-events-none rounded-3xl"
        style={{ backgroundImage: `url(${posterImage})` }}
      />

      <div
        className={`relative z-10 w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-black shadow-xl border border-neutral-200 ${
          isShort
            ? 'max-w-[380px] aspect-[9/16] mx-auto ring-4 ring-neutral-200'
            : 'aspect-video max-w-5xl'
        }`}
      >
        {isPlaying ? (
          parsed.provider === 'direct' ? (
            <video
              src={parsed.embedUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            >
              आपका ब्राउज़र वीडियो टैग को सपोर्ट नहीं करता।
            </video>
          ) : (
            <iframe
              src={embedSrc}
              title={title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )
        ) : (
          <div
            onClick={() => setIsPlaying(true)}
            className="group relative w-full h-full cursor-pointer flex items-center justify-center bg-neutral-950"
          >
            {/* Poster Thumbnail */}
            <img
              src={posterImage}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
            />
            {/* Dark vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 group-hover:from-black/70 group-hover:via-black/10 transition-colors" />

            {/* Glowing Big Play Button */}
            <div className="relative z-10 flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600 group-hover:bg-red-700 text-white flex items-center justify-center shadow-xl shadow-red-600/50 group-hover:scale-110 transition-all duration-300">
                <Play size={28} className="fill-current translate-x-0.5" />
              </div>
            </div>

            {/* Tap to play prompt */}
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xs text-white text-xs px-3.5 py-1.5 rounded-full font-bold opacity-0 group-hover:opacity-100 transition-opacity font-devanagari">
              वीडियो चलाने के लिए क्लिक करें
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
