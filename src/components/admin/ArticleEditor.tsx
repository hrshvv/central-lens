'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { 
  Upload, 
  Image as ImageIcon, 
  Check, 
  ArrowLeft, 
  Sparkles, 
  Tag, 
  Layers,
  Globe,
  Clock,
  Calendar
} from 'lucide-react';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const formatDatetimeLocal = (date?: string | Date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => n.toString().padStart(2, '0');
  const YYYY = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const DD = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return `${YYYY}-${MM}-${DD}T${hh}:${mm}`;
};

export default function ArticleEditor({ initialData = null }: { initialData?: any }) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || '');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [category, setCategory] = useState(initialData?.category?._id || initialData?.category || '');
  const [status, setStatus] = useState(initialData?.status || 'published');
  const [scheduledAt, setScheduledAt] = useState(
    initialData?.scheduledAt ? formatDatetimeLocal(initialData.scheduledAt) : ''
  );
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(', ') || '');
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [isBreaking, setIsBreaking] = useState(initialData?.isBreaking || false);
  const [isTrending, setIsTrending] = useState(initialData?.isTrending || false);

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const applyPreset = (hoursFromNow: number) => {
    const target = new Date(Date.now() + hoursFromNow * 3600 * 1000);
    setScheduledAt(formatDatetimeLocal(target));
  };

  const applyTomorrow = (hour: number) => {
    const target = new Date();
    target.setDate(target.getDate() + 1);
    target.setHours(hour, 0, 0, 0);
    setScheduledAt(formatDatetimeLocal(target));
  };

  useEffect(() => {
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(console.error);
  }, []);

  // Auto-generate slug if not manually edited
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialData && !slug) {
      // Create slug allowing English or Devanagari or fallback timestamp
      const generated = val
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\u0900-\u097F]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated || `article-${Date.now().toString(36)}`);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setCoverImage(data.url);
      } else {
        alert(data.error || 'तस्वीर अपलोड विफल हुई');
      }
    } catch (err) {
      alert('तस्वीर अपलोड करते समय त्रुटि हुई');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !category) {
      alert('कृपया शीर्षक, मुख्य सामग्री और श्रेणी भरें।');
      return;
    }

    if (status === 'scheduled' && !scheduledAt) {
      alert('कृपया शेड्यूल करने के लिए प्रकाशन की तारीख और समय चुनें।');
      return;
    }

    setLoading(true);

    const safeSlug = slug || title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\u0900-\u097F]+/g, '-')
      .replace(/(^-|-$)+/g, '') || `news-${Date.now()}`;

    const tags = tagsInput
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0);

    const payload: any = {
      title,
      slug: safeSlug,
      subtitle,
      excerpt: subtitle || title,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80',
      content,
      category,
      status,
      scheduledAt: status === 'scheduled' ? new Date(scheduledAt).toISOString() : undefined,
      tags,
      isFeatured,
      isBreaking,
      isTrending,
      author: { name: 'Central Lens Bureau' },
    };

    const url = initialData ? `/api/admin/articles/${initialData._id}` : '/api/admin/articles';
    const method = initialData ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/admin/articles');
        router.refresh();
      } else {
        const error = await res.json();
        alert(`त्रुटि: ${error.error || 'लेख सहेजने में विफल'}`);
      }
    } catch (err) {
      alert('लेख सहेजते समय तकनीकी समस्या आई।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-4 sm:space-y-6 font-sans">
      {/* Top Header & Save Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 sm:gap-4 bg-white p-3.5 sm:p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="वापस जाएं"
            className="p-2 text-neutral-400 hover:text-neutral-900 rounded-xl hover:bg-neutral-100 transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-base sm:text-xl font-black text-neutral-900 font-devanagari">
              {initialData ? 'लेख संपादित करें (Edit Article)' : 'नया लेख लिखें (Create New Article)'}
            </h1>
            <p className="text-[10px] sm:text-xs text-neutral-400 font-sans">Central Lens CMS Content Publisher</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Quick Status Pill Selector */}
          <div className="flex items-center p-1 bg-neutral-100 rounded-xl text-xs font-bold border border-neutral-200/60 font-devanagari">
            <button
              type="button"
              onClick={() => setStatus('published')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                status === 'published'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              🟢 तुरंत लाइव
            </button>
            <button
              type="button"
              onClick={() => {
                setStatus('scheduled');
                if (!scheduledAt) applyPreset(2);
              }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition whitespace-nowrap flex items-center space-x-1 cursor-pointer ${
                status === 'scheduled'
                  ? 'bg-purple-600 text-white shadow-xs font-black'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <span>⏰ शेड्यूल</span>
              <span className="text-[9px] bg-amber-400 text-neutral-900 px-1 py-0.2 rounded font-black font-sans">NEW</span>
            </button>
            <button
              type="button"
              onClick={() => setStatus('draft')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                status === 'draft'
                  ? 'bg-neutral-800 text-white shadow-xs font-black'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              📝 ड्राफ्ट
            </button>
          </div>

          <button
            type="button"
            onClick={() => router.back()}
            className="px-3 sm:px-4 py-2 sm:py-2.5 border border-neutral-300 rounded-xl text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition font-devanagari text-center cursor-pointer"
          >
            रद्द करें
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center justify-center space-x-1.5 px-4 sm:px-6 py-2 sm:py-2.5 active:scale-98 text-white rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50 font-devanagari text-center cursor-pointer ${
              status === 'scheduled'
                ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20'
                : status === 'draft'
                  ? 'bg-neutral-800 hover:bg-neutral-900'
                  : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
            }`}
          >
            <Check size={16} />
            <span>
              {loading
                ? 'सहेजा जा रहा है...'
                : status === 'scheduled'
                  ? '⏰ शेड्यूल सहेजें (Schedule)'
                  : status === 'published'
                    ? 'प्रकाशित करें (Publish Now)'
                    : 'ड्राफ्ट सहेजें (Save Draft)'}
            </span>
          </button>
        </div>
      </div>

      {/* 2-Column Editorial Workspace (Stacks on mobile/tablet) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left Column (8 cols): Main Content */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-6">
          {/* Title & Subtitle */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3.5 sm:space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 sm:mb-2 font-sans">
                मुख्य शीर्षक (Headline) *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                placeholder="आकर्षक और स्पष्ट शीर्षक दर्ज करें..."
                className="w-full text-base sm:text-xl font-bold text-neutral-900 border border-neutral-200 rounded-xl p-3 sm:p-3.5 focus:outline-none focus:ring-2 focus:ring-red-500 font-devanagari placeholder-neutral-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5 sm:mb-2 font-sans">
                उप-शीर्षक / संक्षिप्त विवरण (Subtitle / Excerpt)
              </label>
              <textarea
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                rows={2}
                placeholder="लेख का सार (1-2 पंक्तियों में)..."
                className="w-full text-xs sm:text-sm text-neutral-700 border border-neutral-200 rounded-xl p-2.5 sm:p-3 focus:outline-none focus:ring-2 focus:ring-red-500 font-devanagari placeholder-neutral-300"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 mb-1 font-sans flex items-center space-x-1">
                <Globe size={12} />
                <span>URL Slug (स्वचालित अथवा कस्टम)</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="custom-article-slug"
                className="w-full text-xs text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-lg p-2 font-mono focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Rich Text Editor */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2 sm:mb-3 font-sans">
              लेख की पूरी सामग्री (Article Body) *
            </label>
            <div className="h-[380px] sm:h-[450px] pb-14 sm:pb-16 font-devanagari">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                placeholder="यहाँ लेख विस्तार से लिखें..."
                className="h-full rounded-xl overflow-hidden"
              />
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Publishing Settings & Media */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-6">
          {/* Status & Highlights */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3.5 sm:space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-sans">
              प्रकाशन विकल्प (Publishing)
            </h3>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-2 font-devanagari flex items-center justify-between">
                <span>प्रकाशन स्थिति (Publishing Status) *</span>
                <span className="text-[10px] text-purple-700 font-bold bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                  ⏰ शेड्यूलिंग उपलब्ध
                </span>
              </label>

              <div className="space-y-2">
                {/* Option 1: Live Now */}
                <button
                  type="button"
                  onClick={() => setStatus('published')}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-start space-x-3 cursor-pointer ${
                    status === 'published'
                      ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 shadow-xs'
                      : 'bg-neutral-50/70 hover:bg-neutral-100 border-neutral-200 text-neutral-700'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center flex-shrink-0 ${
                    status === 'published' ? 'border-emerald-600 bg-emerald-600' : 'border-neutral-300 bg-white'
                  }`}>
                    {status === 'published' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-black font-devanagari text-neutral-900">तुरंत लाइव करें (Publish Now)</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded font-sans">LIVE</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5 font-devanagari">सहेजते ही यह लेख तुरंत वेबसाइट पर सभी पाठकों को दिखेगा।</p>
                  </div>
                </button>

                {/* Option 2: Schedule for Later (NEW FEATURE) */}
                <button
                  type="button"
                  onClick={() => {
                    setStatus('scheduled');
                    if (!scheduledAt) applyPreset(2);
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-start space-x-3 cursor-pointer ${
                    status === 'scheduled'
                      ? 'bg-purple-50/80 border-purple-500 ring-2 ring-purple-500/20 text-purple-950 shadow-xs'
                      : 'bg-neutral-50/70 hover:bg-neutral-100 border-neutral-200 text-neutral-700'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center flex-shrink-0 ${
                    status === 'scheduled' ? 'border-purple-600 bg-purple-600' : 'border-neutral-300 bg-white'
                  }`}>
                    {status === 'scheduled' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-black font-devanagari text-purple-950">⏰ समय तय करें (Schedule for Later)</span>
                      <span className="text-[9px] bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-900 font-black px-1.5 py-0.2 rounded font-sans animate-pulse">
                        NEW
                      </span>
                    </div>
                    <p className="text-[11px] text-purple-900/80 mt-0.5 font-devanagari">तय की गई तारीख व समय पर यह लेख अपने-आप लाइव हो जाएगा।</p>
                  </div>
                </button>

                {/* Option 3: Draft */}
                <button
                  type="button"
                  onClick={() => setStatus('draft')}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-start space-x-3 cursor-pointer ${
                    status === 'draft'
                      ? 'bg-neutral-100 border-neutral-600 ring-2 ring-neutral-400/20 text-neutral-900 shadow-xs'
                      : 'bg-neutral-50/70 hover:bg-neutral-100 border-neutral-200 text-neutral-700'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center flex-shrink-0 ${
                    status === 'draft' ? 'border-neutral-700 bg-neutral-700' : 'border-neutral-300 bg-white'
                  }`}>
                    {status === 'draft' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-black font-devanagari text-neutral-900">ड्राफ्ट रखें (Save as Draft)</span>
                      <span className="text-[9px] bg-neutral-200 text-neutral-700 font-bold px-1.5 py-0.2 rounded font-sans">DRAFT</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5 font-devanagari">केवल एडमिन पैनल में रहेगा, सार्वजनिक रूप से छिपा रहेगा।</p>
                  </div>
                </button>
              </div>
            </div>

            {/* If Scheduled: Show Full Time Box with Presets */}
            {status === 'scheduled' && (
              <div className="p-3.5 sm:p-4 rounded-xl bg-purple-50/90 border border-purple-200 space-y-3 font-devanagari">
                <div className="flex items-center justify-between text-purple-950 font-bold text-xs">
                  <div className="flex items-center space-x-1.5">
                    <Clock size={15} className="text-purple-600 flex-shrink-0" />
                    <span>प्रकाशन का समय (Publish Date & Time) *</span>
                  </div>
                </div>

                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  required={status === 'scheduled'}
                  className="w-full bg-white border border-purple-300 rounded-xl p-2.5 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-purple-500 font-sans shadow-xs"
                />

                {/* Quick 1-click Preset Buttons */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block font-sans">
                    त्वरित विकल्प (Quick Presets):
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => applyPreset(1)}
                      className="px-2 py-1.5 text-[11px] font-bold bg-white hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-lg transition text-center cursor-pointer shadow-2xs"
                    >
                      ⚡ 1 घंटा बाद
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset(3)}
                      className="px-2 py-1.5 text-[11px] font-bold bg-white hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-lg transition text-center cursor-pointer shadow-2xs"
                    >
                      ⏱️ 3 घंटे बाद
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTomorrow(9)}
                      className="px-2 py-1.5 text-[11px] font-bold bg-white hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-lg transition text-center cursor-pointer shadow-2xs"
                    >
                      🌅 कल सुबह 9:00
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTomorrow(18)}
                      className="px-2 py-1.5 text-[11px] font-bold bg-white hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-lg transition text-center cursor-pointer shadow-2xs"
                    >
                      🌆 कल शाम 6:00
                    </button>
                  </div>
                </div>

                {scheduledAt && (
                  <div className="p-2 bg-purple-100/70 border border-purple-200/80 rounded-lg text-[11px] text-purple-900 leading-relaxed font-devanagari">
                    💡 <span className="font-bold">ऑटो-पब्लिश:</span> यह लेख{' '}
                    <span className="font-black underline decoration-purple-400">
                      {new Date(scheduledAt).toLocaleString('hi-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>{' '}
                    पर अपने-आप प्रकाशित हो जाएगा।
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1.5 font-sans">राज्य (State) *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-bold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-500 font-devanagari"
              >
                <option value="">राज्य चुनें...</option>
                {categories.map((cat: any) => (
                  <option key={cat._id} value={cat._id}>{cat.name} ({cat.slug})</option>
                ))}
              </select>
            </div>

            <div className="pt-3 border-t border-neutral-100 space-y-2.5 font-devanagari">
              <label className="flex items-center space-x-2.5 text-xs font-medium text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                />
                <span>प्रमुख समाचार (Hero Featured)</span>
              </label>

              <label className="flex items-center space-x-2.5 text-xs font-medium text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBreaking}
                  onChange={(e) => setIsBreaking(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                />
                <span>ब्रेकिंग न्यूज़ टिकर में दिखाएं</span>
              </label>

              <label className="flex items-center space-x-2.5 text-xs font-medium text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTrending}
                  onChange={(e) => setIsTrending(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                />
                <span>ट्रेंडिंग कैरोसेल में शामिल करें</span>
              </label>
            </div>
          </div>

          {/* Cover Photo & Cloudinary */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-sans flex items-center justify-between">
              <span>कवर फोटो (Cover Image)</span>
              <span className="text-[10px] text-emerald-600 font-semibold">Cloudinary CDN</span>
            </h3>

            <div className="relative border-2 border-dashed border-neutral-200 hover:border-red-400 rounded-2xl p-4 text-center bg-neutral-50/60 transition group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center py-2 space-y-2">
                <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition">
                  {uploading ? (
                    <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload size={18} />
                  )}
                </div>
                <div className="text-xs font-bold text-neutral-700">
                  {uploading ? 'अपलोड हो रहा है...' : 'कंप्यूटर से फोटो चुनें'}
                </div>
                <p className="text-[10px] text-neutral-400">JPG, PNG, WebP (Cloudinary द्वारा स्वचालित अनुकूलित)</p>
              </div>
            </div>

            {/* Direct Image URL input */}
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1 font-sans">अथवा सीधा इमेज URL पेस्ट करें:</label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://..."
                className="w-full text-xs text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-red-500 font-mono"
              />
            </div>

            {/* Image Preview */}
            {coverImage && (
              <div className="mt-3 rounded-xl overflow-hidden border border-neutral-200 shadow-xs relative aspect-video bg-neutral-100">
                <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-sans flex items-center space-x-1.5">
              <Tag size={14} />
              <span>टैग्स (Tags)</span>
            </h3>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="भारत, चुनाव, क्रिकेट, तकनीक..."
              className="w-full text-xs text-neutral-700 border border-neutral-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 font-devanagari"
            />
            <p className="text-[10px] text-neutral-400">टैग्स को कॉमा ( , ) लगाकर अलग करें।</p>
          </div>
        </div>
      </div>
    </form>
  );
}
