'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  Eye,
  ExternalLink,
  Play,
  Video as VideoIcon,
  Film,
  Radio,
  Smartphone,
  Sparkles,
  Clock,
  X,
  Check,
  Globe,
  Tag,
  Share2,
  Tv,
  CheckCircle2
} from 'lucide-react';
import { parseVideoUrl, formatDuration } from '@/lib/utils/video';

export default function AdminVideos() {
  const [videos, setVideos] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'long' | 'short' | 'podcast'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<any>(null);
  const [previewModalVideo, setPreviewModalVideo] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [videoType, setVideoType] = useState<'long' | 'short' | 'podcast'>('long');
  const [duration, setDuration] = useState<number>(0);
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [authorName, setAuthorName] = useState('Central Lens Bureau');
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [isFeatured, setIsFeatured] = useState(false);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/videos?limit=100');
      const data = await res.json();
      setVideos(data.data || []);
    } catch (err) {
      console.error('Failed to fetch videos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data);
        if (data.length > 0 && !categoryId) {
          setCategoryId(data[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchVideos();
    fetchCategories();
  }, [fetchVideos, fetchCategories]);

  // Video URL auto-detection
  const handleVideoUrlChange = (url: string) => {
    setVideoUrl(url);
    if (!url.trim()) return;

    const parsed = parseVideoUrl(url);
    if (parsed.thumbnailUrl && (!thumbnailUrl || editingVideo?.thumbnailUrl === thumbnailUrl)) {
      setThumbnailUrl(parsed.thumbnailUrl);
    }
    if (parsed.isShort && videoType !== 'short') {
      setVideoType('short');
    }
  };

  // Auto-generate slug from Hindi/English title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingVideo) {
      const generated = val
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\u0900-\u097F]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated || `video-${Date.now().toString(36)}`);
    }
  };

  const openCreateModal = () => {
    setEditingVideo(null);
    setTitle('');
    setSlug('');
    setVideoUrl('');
    setThumbnailUrl('');
    setVideoType('long');
    setDuration(180);
    setDescription('');
    setTagsInput('');
    setAuthorName('Central Lens Bureau');
    setStatus('published');
    setIsFeatured(false);
    if (categories.length > 0) setCategoryId(categories[0]._id);
    setIsModalOpen(true);
  };

  const openEditModal = (video: any) => {
    setEditingVideo(video);
    setTitle(video.title || '');
    setSlug(video.slug || '');
    setVideoUrl(video.videoUrl || '');
    setThumbnailUrl(video.thumbnailUrl || '');
    setVideoType(video.videoType || 'long');
    setDuration(video.duration || 0);
    setCategoryId(video.category?._id || video.category || (categories[0]?._id ?? ''));
    setDescription(video.description || '');
    setTagsInput(Array.isArray(video.tags) ? video.tags.join(', ') : '');
    setAuthorName(video.author?.name || 'Central Lens Bureau');
    setStatus(video.status || 'published');
    setIsFeatured(!!video.isFeatured);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVideo(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) {
      alert('कृपया वीडियो URL दर्ज करें');
      return;
    }
    if (!title) {
      alert('कृपया वीडियो का शीर्षक दर्ज करें');
      return;
    }

    setSubmitting(true);
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const cleanSlug = (slug || title)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\u0900-\u097F]+/g, '-')
      .replace(/(^-|-$)+/g, '') || `video-${Date.now().toString(36)}`;

    const payload = {
      title,
      slug: cleanSlug,
      videoUrl,
      thumbnailUrl:
        thumbnailUrl ||
        parseVideoUrl(videoUrl).thumbnailUrl ||
        'https://images.unsplash.com/photo-1578022761797-b8636ac1773c?w=1000&auto=format&fit=crop&q=80',
      videoType,
      duration: Number(duration) || 0,
      category: categoryId || categories[0]?._id,
      description,
      tags,
      author: {
        name: authorName || 'Central Lens Bureau',
      },
      status,
      isFeatured,
      publishedAt: status === 'published' ? new Date() : undefined,
    };

    const url = editingVideo ? `/api/admin/videos/${editingVideo._id}` : '/api/admin/videos';
    const method = editingVideo ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        closeModal();
        fetchVideos();
      } else {
        const data = await res.json();
        alert(`त्रुटि: ${data.error || 'सहेजने में विफल'}`);
      }
    } catch {
      alert('सर्वर से संपर्क करने में समस्या आई');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('क्या आप वाकई इस वीडियो को हटाना चाहते हैं?')) {
      try {
        const res = await fetch(`/api/admin/videos/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchVideos();
        } else {
          alert('हटाने में विफल');
        }
      } catch (err) {
        console.error(err);
        alert('त्रुटि हुई');
      }
    }
  };

  const handleToggleStatus = async (video: any) => {
    const newStatus = video.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/admin/videos/${video._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchVideos();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered list
  const filteredVideos = useMemo(() => {
    return videos.filter((v) => {
      const matchesSearch =
        v.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(v.tags) && v.tags.some((t: string) => t.toLowerCase().includes(searchTerm.toLowerCase())));

      const matchesType = typeFilter === 'all' || v.videoType === typeFilter;
      const matchesStatus = statusFilter === 'all' || v.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [videos, searchTerm, typeFilter, statusFilter]);

  // Quick stats
  const stats = useMemo(() => {
    return {
      total: videos.length,
      published: videos.filter((v) => v.status === 'published').length,
      draft: videos.filter((v) => v.status === 'draft').length,
      shorts: videos.filter((v) => v.videoType === 'short').length,
      podcasts: videos.filter((v) => v.videoType === 'podcast').length,
    };
  }, [videos]);

  // Live parsed info for modal form
  const parsedActiveUrl = parseVideoUrl(videoUrl);

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-red-100 text-red-600">
              <Tv size={22} />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight font-devanagari">
              वीडियो स्टूडियो (Video Management)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 font-devanagari">
            यूट्यूब, शॉर्ट्स एवं पॉडकास्ट वीडियो बुलेटिन प्रबंधित करें • कुल {stats.total} वीडियो
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 active:scale-98 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-red-600/20 transition-all font-devanagari"
        >
          <Plus size={16} />
          <span>नया वीडियो जोड़ें</span>
        </button>
      </div>

      {/* Quick Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center font-bold">
            <VideoIcon size={18} />
          </div>
          <div>
            <div className="text-xl font-black text-neutral-900">{stats.total}</div>
            <div className="text-[11px] font-semibold text-neutral-400 font-devanagari">कुल वीडियो</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <div className="text-xl font-black text-emerald-700">{stats.published}</div>
            <div className="text-[11px] font-semibold text-neutral-400 font-devanagari">लाइव / प्रकाशित</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Smartphone size={18} />
          </div>
          <div>
            <div className="text-xl font-black text-purple-700">{stats.shorts}</div>
            <div className="text-[11px] font-semibold text-neutral-400 font-devanagari">शॉर्ट्स / रील्स</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Radio size={18} />
          </div>
          <div>
            <div className="text-xl font-black text-amber-700">{stats.podcasts}</div>
            <div className="text-[11px] font-semibold text-neutral-400 font-devanagari">पॉडकास्ट / वार्ता</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="वीडियो का शीर्षक या टैग खोजें..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500 font-devanagari"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Format Tabs */}
          <div className="flex items-center space-x-1 p-1 bg-neutral-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition font-devanagari ${
                typeFilter === 'all'
                  ? 'bg-white text-neutral-900 shadow-xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              सभी
            </button>
            <button
              onClick={() => setTypeFilter('long')}
              className={`px-3 py-1.5 rounded-lg transition font-devanagari ${
                typeFilter === 'long'
                  ? 'bg-white text-blue-600 shadow-xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              लॉन्ग
            </button>
            <button
              onClick={() => setTypeFilter('short')}
              className={`px-3 py-1.5 rounded-lg transition font-devanagari ${
                typeFilter === 'short'
                  ? 'bg-white text-purple-600 shadow-xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              शॉर्ट्स
            </button>
            <button
              onClick={() => setTypeFilter('podcast')}
              className={`px-3 py-1.5 rounded-lg transition font-devanagari ${
                typeFilter === 'podcast'
                  ? 'bg-white text-amber-600 shadow-xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              पॉडकास्ट
            </button>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center space-x-1 p-1 bg-neutral-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition font-devanagari ${
                statusFilter === 'all'
                  ? 'bg-white text-neutral-900 shadow-xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              सभी स्थिति
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1.5 rounded-lg transition font-devanagari ${
                statusFilter === 'published'
                  ? 'bg-white text-emerald-700 shadow-xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              लाइव
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1.5 rounded-lg transition font-devanagari ${
                statusFilter === 'draft'
                  ? 'bg-white text-amber-700 shadow-xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              ड्राफ्ट
            </button>
          </div>
        </div>
      </div>

      {/* Video Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50/80 text-neutral-500 text-xs uppercase tracking-wider border-b border-neutral-100">
                <th className="py-4 px-6 font-semibold">वीडियो (Media)</th>
                <th className="py-4 px-6 font-semibold">प्रारूप (Format)</th>
                <th className="py-4 px-6 font-semibold">कैटेगरी</th>
                <th className="py-4 px-6 font-semibold">स्थिति (Status)</th>
                <th className="py-4 px-6 font-semibold">व्यूज</th>
                <th className="py-4 px-6 font-semibold text-right">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-neutral-400">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-6 h-6 border-3 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs font-devanagari">वीडियो लाइब्रेरी लोड हो रही है...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredVideos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-neutral-400 text-xs font-devanagari">
                    कोई वीडियो नहीं मिला। नया वीडियो जोड़ने के लिए ऊपर दिए गए बटन पर क्लिक करें।
                  </td>
                </tr>
              ) : (
                filteredVideos.map((video: any) => {
                  const isShort = video.videoType === 'short';
                  const isPodcast = video.videoType === 'podcast';

                  return (
                    <tr key={video._id} className="hover:bg-neutral-50/60 transition-colors">
                      {/* Video Thumbnail & Title */}
                      <td className="py-4 px-6 max-w-sm sm:max-w-md">
                        <div className="flex items-center space-x-3.5">
                          {/* Thumbnail with Play trigger */}
                          <div
                            onClick={() => setPreviewModalVideo(video)}
                            className={`relative rounded-xl overflow-hidden bg-neutral-900 flex-shrink-0 cursor-pointer group shadow-xs border border-neutral-200 ${
                              isShort ? 'w-10 h-16 sm:w-12 sm:h-18' : 'w-20 h-12 sm:w-24 sm:h-14'
                            }`}
                          >
                            <img
                              src={
                                video.thumbnailUrl ||
                                'https://images.unsplash.com/photo-1578022761797-b8636ac1773c?w=400&auto=format&fit=crop&q=80'
                              }
                              alt=""
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 flex items-center justify-center transition">
                              <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform">
                                <Play size={10} className="fill-current translate-x-0.5" />
                              </div>
                            </div>

                            {/* Duration Badge */}
                            {video.duration > 0 && (
                              <span className="absolute bottom-1 right-1 bg-black/80 text-[9px] font-mono text-white px-1 py-0.2 rounded font-bold">
                                {formatDuration(video.duration)}
                              </span>
                            )}
                          </div>

                          {/* Title & Slug */}
                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              {video.isFeatured && (
                                <span className="inline-flex items-center space-x-0.5 px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md uppercase">
                                  <Sparkles size={10} className="fill-current" />
                                  <span>Featured</span>
                                </span>
                              )}
                              <span className="font-bold text-neutral-900 block truncate font-devanagari text-sm">
                                {video.title}
                              </span>
                            </div>

                            <div className="flex items-center space-x-2 text-[11px] text-neutral-400 font-mono mt-0.5">
                              <span className="truncate">/video/{video.slug}</span>
                              <Link
                                href={`/video/${video.slug}`}
                                target="_blank"
                                className="text-neutral-400 hover:text-red-600 transition"
                                title="लाइव देखें"
                              >
                                <ExternalLink size={12} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Format Badge */}
                      <td className="py-4 px-6">
                        {isShort ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200/60 font-devanagari">
                            <Smartphone size={12} />
                            <span>शॉर्ट्स (9:16)</span>
                          </span>
                        ) : isPodcast ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/60 font-devanagari">
                            <Radio size={12} />
                            <span>पॉडकास्ट</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/60 font-devanagari">
                            <Film size={12} />
                            <span>लॉन्ग (16:9)</span>
                          </span>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6">
                        <span
                          className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold font-devanagari shadow-2xs"
                          style={{
                            backgroundColor: `${video.category?.color || '#DC2626'}15`,
                            color: video.category?.color || '#DC2626',
                          }}
                        >
                          {video.category?.name || 'सामान्य'}
                        </span>
                      </td>

                      {/* Status Toggle Button */}
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleStatus(video)}
                          className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors border ${
                            video.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                          }`}
                          title="स्थिति बदलने के लिए क्लिक करें"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              video.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                          ></span>
                          <span className="font-devanagari">{video.status === 'published' ? 'लाइव' : 'ड्राफ्ट'}</span>
                        </button>
                      </td>

                      {/* Views */}
                      <td className="py-4 px-6 text-xs text-neutral-600 font-sans">
                        <span className="flex items-center space-x-1">
                          <Eye size={13} className="text-neutral-400" />
                          <span>{video.views || 0}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setPreviewModalVideo(video)}
                            className="p-2 text-neutral-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                            title="प्रीव्यू देखें"
                          >
                            <Play size={15} />
                          </button>
                          <button
                            onClick={() => openEditModal(video)}
                            className="p-2 text-neutral-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                            title="संपादित करें"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(video._id)}
                            className="p-2 text-neutral-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                            title="हटाएं"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Video Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl border border-neutral-100 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-neutral-100">
              <div className="flex items-center space-x-2">
                <span className="p-2 rounded-xl bg-red-100 text-red-600">
                  <VideoIcon size={20} />
                </span>
                <h2 className="text-lg font-black text-neutral-900 font-devanagari">
                  {editingVideo ? 'वीडियो संपादित करें (Edit Video)' : 'नया वीडियो जोड़ें (Add Video)'}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Video URL with Smart Detection */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span className="font-devanagari">वीडियो URL (यूट्यूब / शॉर्ट्स / MP4 लिंक) *</span>
                  {parsedActiveUrl.provider === 'youtube' && (
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                      ✓ YouTube पहचान लिया गया ({parsedActiveUrl.isShort ? 'Shorts' : 'Standard'})
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => handleVideoUrlChange(e.target.value)}
                  required
                  placeholder="उदा. https://www.youtube.com/watch?v=... अथवा https://www.youtube.com/shorts/..."
                  className="w-full border border-neutral-200 rounded-xl p-3 text-xs font-mono text-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Live Embed Preview if valid */}
              {parsedActiveUrl.embedUrl && videoUrl.trim().length > 10 && (
                <div className="p-3 bg-neutral-900 rounded-xl text-white">
                  <div className="text-[11px] font-bold text-neutral-400 mb-2 flex items-center space-x-1">
                    <Play size={12} className="text-red-500 fill-current" />
                    <span>लाइव प्रीव्यू टेस्ट</span>
                  </div>
                  <div
                    className={`rounded-lg overflow-hidden bg-black mx-auto ${
                      videoType === 'short' ? 'max-w-[240px] aspect-[9/16]' : 'aspect-video w-full'
                    }`}
                  >
                    <iframe
                      src={parsedActiveUrl.embedUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Format Selector */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5 font-devanagari">
                  वीडियो प्रारूप (Video Format) *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setVideoType('long')}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      videoType === 'long'
                        ? 'border-red-600 bg-red-50/50 text-red-700 ring-2 ring-red-500/20'
                        : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
                    }`}
                  >
                    <Film size={18} className={videoType === 'long' ? 'text-red-600' : 'text-neutral-400'} />
                    <div className="mt-2">
                      <div className="font-bold text-xs font-devanagari">लॉन्ग (16:9)</div>
                      <div className="text-[10px] text-neutral-400">न्यूज बुलेटिन, रिपोर्ट</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVideoType('short')}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      videoType === 'short'
                        ? 'border-purple-600 bg-purple-50/50 text-purple-700 ring-2 ring-purple-500/20'
                        : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
                    }`}
                  >
                    <Smartphone
                      size={18}
                      className={videoType === 'short' ? 'text-purple-600' : 'text-neutral-400'}
                    />
                    <div className="mt-2">
                      <div className="font-bold text-xs font-devanagari">शॉर्ट्स (9:16)</div>
                      <div className="text-[10px] text-neutral-400">रील्स, 60s क्विक न्यूज</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVideoType('podcast')}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      videoType === 'podcast'
                        ? 'border-amber-600 bg-amber-50/50 text-amber-700 ring-2 ring-amber-500/20'
                        : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
                    }`}
                  >
                    <Radio size={18} className={videoType === 'podcast' ? 'text-amber-600' : 'text-neutral-400'} />
                    <div className="mt-2">
                      <div className="font-bold text-xs font-devanagari">पॉडकास्ट</div>
                      <div className="text-[10px] text-neutral-400">विशेष साक्षात्कार, चर्चा</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Title & Slug */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5 font-devanagari">
                  वीडियो शीर्षक (Title) *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  placeholder="उदा. सुप्रीम कोर्ट का बड़ा फैसला: डिजिटल सुरक्षा पर अहम दिशा-निर्देश..."
                  className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-devanagari"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                  <Globe size={13} />
                  <span>URL Slug *</span>
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  placeholder="supreme-court-digital-security-bill"
                  className="w-full border border-neutral-200 rounded-xl p-3 text-xs font-mono text-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Category & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5 font-devanagari">
                    कैटेगरी (Category) *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white font-devanagari"
                  >
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name} ({cat.slug})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                    <Clock size={13} />
                    <span className="font-devanagari">अवधि (Duration - Seconds)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      placeholder="180"
                      className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-400">
                      ≈ {formatDuration(duration)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Thumbnail URL */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5 font-devanagari">
                  थंबनेल इमेज URL (Thumbnail) *
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://img.youtube.com/vi/.../maxresdefault.jpg"
                    className="flex-1 border border-neutral-200 rounded-xl p-3 text-xs font-mono text-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  {thumbnailUrl && (
                    <img
                      src={thumbnailUrl}
                      alt="preview"
                      className="w-12 h-10 rounded-lg object-cover border border-neutral-200 flex-shrink-0"
                    />
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5 font-devanagari">
                  विवरण (Description / Summary)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="वीडियो रिपोर्ट का संक्षिप्त विवरण या सारांश..."
                  className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-devanagari"
                />
              </div>

              {/* Tags & Reporter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                    <Tag size={13} />
                    <span className="font-devanagari">टैग्स (Tags - अल्पविराम द्वारा अलग करें)</span>
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="राजनीति, ब्रेकिंग, भारत"
                    className="w-full border border-neutral-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-red-500 font-devanagari"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5 font-devanagari">
                    रिपोर्टर / लेखक का नाम
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Central Lens Bureau"
                    className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-devanagari"
                  />
                </div>
              </div>

              {/* Featured & Status */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50 p-4 rounded-xl border border-neutral-200/60">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded border-neutral-300 focus:ring-red-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block font-devanagari">
                      मुख्य वीडियो बनाएं (Featured Spotlight)
                    </span>
                    <span className="text-[10px] text-neutral-500 font-devanagari">
                      होमपेज और वीडियो हब के शीर्ष पर प्रदर्शित होगा
                    </span>
                  </div>
                </label>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-neutral-600 font-devanagari">स्थिति:</span>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="border border-neutral-200 rounded-xl px-3 py-1.5 text-xs font-bold bg-white text-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-500 font-devanagari"
                  >
                    <option value="published">लाइव (Published)</option>
                    <option value="draft">ड्राफ्ट (Draft)</option>
                  </select>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 flex justify-end space-x-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition font-devanagari"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/20 transition flex items-center space-x-1.5 font-devanagari disabled:opacity-50"
                >
                  <Check size={14} />
                  <span>{submitting ? 'सहेजा जा रहा है...' : 'सहेजें (Save Video)'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Playback Preview Modal */}
      {previewModalVideo && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewModalVideo(null)}
        >
          <div
            className="bg-neutral-950 text-white rounded-2xl overflow-hidden max-w-3xl w-full border border-neutral-800 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex items-center justify-between border-b border-neutral-800">
              <div className="min-w-0 pr-4">
                <span className="text-xs font-bold uppercase tracking-wider text-red-500 block mb-0.5 font-devanagari">
                  {previewModalVideo.category?.name || 'Central Lens Video'}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white truncate font-devanagari">
                  {previewModalVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewModalVideo(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X size={20} />
              </button>
            </div>

            <div
              className={`bg-black flex items-center justify-center ${
                previewModalVideo.videoType === 'short'
                  ? 'max-w-[340px] aspect-[9/16] mx-auto my-4 rounded-xl overflow-hidden'
                  : 'aspect-video w-full'
              }`}
            >
              <iframe
                src={parseVideoUrl(previewModalVideo.videoUrl).embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-4 bg-neutral-900/60 flex items-center justify-between text-xs text-neutral-400 border-t border-neutral-800 font-devanagari">
              <div className="flex items-center space-x-3">
                <span>अवधि: {formatDuration(previewModalVideo.duration)}</span>
                <span>•</span>
                <span>व्यूज: {previewModalVideo.views || 0}</span>
              </div>
              <Link
                href={`/video/${previewModalVideo.slug}`}
                target="_blank"
                className="text-red-400 hover:text-red-300 font-bold flex items-center space-x-1"
              >
                <span>लाइव पेज खोलें</span>
                <ExternalLink size={12} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
