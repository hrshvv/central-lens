/**
 * Video Helper Utilities for Central Lens
 * Supports YouTube (Standard & Shorts), Vimeo, and direct video URLs.
 */

export interface ParsedVideoInfo {
  provider: 'youtube' | 'vimeo' | 'direct' | 'other';
  videoId?: string;
  isShort: boolean;
  embedUrl: string;
  thumbnailUrl?: string;
}

export function parseVideoUrl(url: string): ParsedVideoInfo {
  const trimmed = url.trim();

  // 1. YouTube Shorts: https://www.youtube.com/shorts/VIDEO_ID
  const shortsMatch = trimmed.match(/(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/i);
  if (shortsMatch && shortsMatch[1]) {
    const videoId = shortsMatch[1];
    return {
      provider: 'youtube',
      videoId,
      isShort: true,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    };
  }

  // 2. YouTube Standard: watch?v=VIDEO_ID, youtu.be/VIDEO_ID, embed/VIDEO_ID
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      provider: 'youtube',
      videoId,
      isShort: false,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    };
  }

  // 3. Vimeo: https://vimeo.com/123456789
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/)([0-9]+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      provider: 'vimeo',
      videoId: vimeoMatch[1],
      isShort: false,
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  // 4. Direct video files (MP4, WebM, Cloudinary video)
  const isDirect = /\.(mp4|webm|ogg|m4v)(\?.*)?$/i.test(trimmed) || trimmed.includes('/video/upload/');
  if (isDirect) {
    return {
      provider: 'direct',
      isShort: false,
      embedUrl: trimmed,
    };
  }

  return {
    provider: 'other',
    isShort: false,
    embedUrl: trimmed,
  };
}

export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hrs > 0) {
    return `${hrs}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}
