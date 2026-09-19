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
        style={
          isShort
            ? {
                width: 'min(280px, calc((100vh - 270px) * 9 / 16))',
                height: 'min(498px, calc(100vh - 270px))',
                maxWidth: '85vw',
                aspectRatio: '9 / 16',
              }
            : undefined
        }
        className={`relative z-10 overflow-hidden bg-black shadow-2xl ${
          isShort
            ? 'rounded-[2rem] border-[6px] border-neutral-900 ring-1 ring-neutral-300 mx-auto'
            : 'w-full rounded-2xl sm:rounded-3xl border border-neutral-200 aspect-video max-w-5xl'
        }`}
      >
        {/* Smartphone top pill notch for shorts */}
        {isShort && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-2.5 bg-neutral-900 rounded-full z-30 pointer-events-none flex items-center justify-end pr-1.5">
            <span className="w-1 h-1 rounded-full bg-neutral-700" />
          </div>
        )}

        {isPlaying ? (
          parsed.provider === 'direct' ? (
            <video
              src={parsed.embedUrl}
              controls
              autoPlay
              playsInline
              className={`w-full h-full ${isShort ? 'object-cover' : 'object-contain'}`}
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
            className="group relative w-full h-full cursor-pointer overflow-hidden bg-neutral-950"
          >
            {/* Poster Thumbnail */}
            <img
              src={posterImage}
              alt={title}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              className="group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100"
            />
            {/* Dark vignette overlay */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
              className="bg-gradient-to-t from-black/80 via-black/25 to-black/20 group-hover:from-black/70 group-hover:via-black/10 transition-colors pointer-events-none"
            />

            {/* Glowing Big Play Button - DEAD CENTER */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 20,
              }}
              className="pointer-events-none flex items-center justify-center"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-600 group-hover:bg-red-700 text-white flex items-center justify-center shadow-2xl shadow-red-600/60 group-hover:scale-110 transition-all duration-300">
                <Play size={26} className="fill-current translate-x-0.5" />
              </div>
            </div>

            {/* Tap to play prompt */}
            <span
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 20,
              }}
              className="bg-black/75 backdrop-blur-xs text-white text-[11px] px-3.5 py-1.5 rounded-full font-bold opacity-0 group-hover:opacity-100 transition-opacity font-devanagari whitespace-nowrap shadow-md pointer-events-none"
            >
              वीडियो चलाने के लिए क्लिक करें
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
