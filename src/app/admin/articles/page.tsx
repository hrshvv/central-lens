'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Eye, 
  ExternalLink,
  Sparkles,
  Calendar,
  Crown,
  User,
  Clock,
  X,
  Check
} from 'lucide-react';

export default function AdminArticles() {
  const [articles, setArticles] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'scheduled' | 'draft'>('all');

  // Quick Schedule Modal State
  const [scheduleModalArticle, setScheduleModalArticle] = useState<any>(null);
  const [quickScheduleTime, setQuickScheduleTime] = useState('');
  const [savingSchedule, setSavingSchedule] = useState(false);

  const formatDatetimeLocal = (date?: string | Date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const openScheduleModal = (article: any) => {
    setScheduleModalArticle(article);
    if (article.scheduledAt) {
      setQuickScheduleTime(formatDatetimeLocal(article.scheduledAt));
    } else {
      const d = new Date(Date.now() + 2 * 3600 * 1000);
      setQuickScheduleTime(formatDatetimeLocal(d));
    }
  };

  const applyArticlePreset = (hoursFromNow: number) => {
    const target = new Date(Date.now() + hoursFromNow * 3600 * 1000);
    setQuickScheduleTime(formatDatetimeLocal(target));
  };

  const applyArticleTomorrow = (hour: number) => {
    const target = new Date();
    target.setDate(target.getDate() + 1);
    target.setHours(hour, 0, 0, 0);
    setQuickScheduleTime(formatDatetimeLocal(target));
  };

  const handleSaveSchedule = async (targetStatus: 'scheduled' | 'published' | 'draft') => {
    if (!scheduleModalArticle) return;
    if (targetStatus === 'scheduled' && !quickScheduleTime) {
      alert('कृपया प्रकाशन का समय चुनें');
      return;
    }

    setSavingSchedule(true);
    try {
      const payload: any = { status: targetStatus };
      if (targetStatus === 'scheduled') {
        payload.scheduledAt = new Date(quickScheduleTime).toISOString();
      }
      const res = await fetch(`/api/admin/articles/${scheduleModalArticle._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setScheduleModalArticle(null);
        fetchArticles();
      } else {
        const data = await res.json();
        alert(data.error || 'अद्यतन विफल');
      }
    } catch {
      alert('सर्वर त्रुटि हुई');
    } finally {
      setSavingSchedule(false);
    }
  };

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) setCurrentUser(data.user);
      })
      .catch(() => {});

    fetchArticles();
  }, []);

  const fetchArticles = () => {
    setLoading(true);
    fetch('/api/admin/articles?limit=100')
      .then(res => res.json())
      .then(data => {
        setArticles(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleDelete = async (id: string) => {
    if (confirm('क्या आप इस लेख को हटाना चाहते हैं?')) {
      const res = await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchArticles();
      } else {
        const data = await res.json();
        alert(data.error || 'हटाने में विफल');
      }
    }
  };

  const handleToggleStatus = async (article: any) => {
    const newStatus = article.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/admin/articles/${article._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchArticles();
      } else {
        const data = await res.json();
        alert(data.error || 'स्थिति बदलने में विफल');
      }
    } catch (error) {
      console.error(error);
      alert('त्रुटि हुई');
    }
  };

  const isOwner = currentUser?.role === 'owner';

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.slug?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 sm:gap-4">
        <div>
          <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider mb-1">
            {isOwner ? (
              <span className="text-amber-600 flex items-center space-x-1 font-bold">
                <Crown size={13} className="fill-amber-500" />
                <span>ओनर मोड (सभी एडमिन्स के लेख)</span>
              </span>
            ) : (
              <span className="text-neutral-500 font-semibold font-devanagari">
                व्यक्तिगत एडमिन सूची (केवल आपके लेख)
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-neutral-900 tracking-tight font-devanagari">
            {isOwner ? 'लेख प्रबंधन (All Articles)' : 'मेरे लेख (My Articles)'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-devanagari">
            कुल {articles.length} लेख उपलब्ध हैं • प्रकाशित अथवा ड्राफ्ट प्रबंधित करें
          </p>
        </div>
        <Link 
          href="/admin/articles/new" 
          className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 font-devanagari"
        >
          <Plus size={16} />
          <span>नया लेख जोड़ें</span>
        </Link>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
        {/* Search Box */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="लेख का शीर्षक खोजें..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500 font-devanagari"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1 p-1 bg-neutral-100 rounded-xl overflow-x-auto w-full md:w-auto text-xs font-semibold">
          <button
            onClick={() => setStatusFilter('all')}
            className={`flex-1 md:flex-initial px-3 py-1.5 rounded-lg transition whitespace-nowrap text-center ${
              statusFilter === 'all' ? 'bg-white text-neutral-900 shadow-xs font-bold' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            सभी ({articles.length})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`flex-1 md:flex-initial px-3 py-1.5 rounded-lg transition whitespace-nowrap text-center ${
              statusFilter === 'published' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            लाइव ({articles.filter(a => a.status === 'published').length})
          </button>
          <button
            onClick={() => setStatusFilter('scheduled')}
            className={`flex-1 md:flex-initial px-3 py-1.5 rounded-lg transition whitespace-nowrap text-center ${
              statusFilter === 'scheduled' ? 'bg-white text-neutral-900 shadow-xs font-bold' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            शेड्यूल ({articles.filter(a => a.status === 'scheduled').length})
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`flex-1 md:flex-initial px-3 py-1.5 rounded-lg transition whitespace-nowrap text-center ${
              statusFilter === 'draft' ? 'bg-white text-amber-700 shadow-xs font-bold' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            ड्राफ्ट्स ({articles.filter(a => a.status === 'draft').length})
          </button>
        </div>
      </div>

      {/* Articles Container */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        {loading && (
          <div className="py-20 text-center text-xs text-neutral-400 font-devanagari">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            लेख लोड हो रहे हैं...
          </div>
        )}

        {!loading && filteredArticles.length === 0 && (
          <div className="py-16 text-center text-neutral-400 text-xs font-devanagari">
            कोई लेख नहीं मिला।
          </div>
        )}

        {/* Mobile Cards View (< md) */}
        {!loading && filteredArticles.length > 0 && (
          <div className="block md:hidden divide-y divide-neutral-100">
            {filteredArticles.map((article: any) => {
              const catSlug = article.category?.slug || 'news';
              return (
                <div key={article._id} className="p-3.5 space-y-3 hover:bg-neutral-50/60 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="w-14 h-14 rounded-xl bg-neutral-100 overflow-hidden flex-shrink-0 border border-neutral-200/60">
                      {article.coverImage ? (
                        <img src={article.coverImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400 text-[10px]">No Pic</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-neutral-900 block font-devanagari text-xs sm:text-sm line-clamp-2">
                        {article.title}
                      </span>
                      <div className="flex items-center space-x-2 text-[11px] text-neutral-400 font-mono mt-1">
                        <span className="truncate">/{article.slug}</span>
                        <Link 
                          href={`/${catSlug}/${article.slug}`} 
                          target="_blank"
                          className="text-neutral-400 hover:text-red-600"
                          title="लाइव देखें"
                        >
                          <ExternalLink size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Creator tag if owner */}
                  {isOwner && article.createdBy && (
                    <div className="text-[11px] text-neutral-500 font-sans flex items-center space-x-1">
                      <span className="font-semibold text-neutral-700">लेखक:</span>
                      <span className="bg-neutral-100 px-2 py-0.5 rounded text-neutral-800 font-bold">{article.createdBy.name}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-neutral-100/80 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-neutral-100 text-neutral-700 font-devanagari">
                        {article.category?.name || 'सामान्य'}
                      </span>
                      {article.status === 'scheduled' ? (
                        <button 
                          onClick={() => handleToggleStatus(article)}
                          className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider transition-colors border bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200 cursor-pointer"
                          title="तुरंत लाइव करने के लिए क्लिक करें"
                        >
                          <Clock size={11} className="text-neutral-500 flex-shrink-0" />
                          <span>शेड्यूल</span>
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleToggleStatus(article)}
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors border ${
                            article.status === 'published' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                          title="स्थिति बदलने के लिए क्लिक करें"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${article.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                          <span>{article.status === 'published' ? 'लाइव' : 'ड्राफ्ट'}</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 text-neutral-400 text-[11px]">
                      <span className="flex items-center space-x-1">
                        <Eye size={12} />
                        <span>{article.views || 0}</span>
                      </span>
                      <span>
                        {new Date(article.createdAt).toLocaleDateString('hi-IN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-1">
                    <button 
                      onClick={() => openScheduleModal(article)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-lg transition-colors font-devanagari cursor-pointer"
                      title="प्रकाशन समय तय करें (Schedule Article)"
                    >
                      <Clock size={13} className="text-neutral-500" />
                      <span>शेड्यूल</span>
                    </button>
                    <Link 
                      href={`/admin/articles/${article._id}/edit`} 
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors font-devanagari"
                    >
                      <Edit3 size={14} />
                      <span>संपादित करें</span>
                    </Link>
                    <button 
                      onClick={() => handleDelete(article._id)} 
                      className="p-1.5 text-neutral-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="हटाएं"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Desktop Table View (>= md) */}
        {!loading && filteredArticles.length > 0 && (
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left min-w-[720px]">
              <thead>
                <tr className="bg-neutral-50/80 text-neutral-500 text-xs uppercase tracking-wider border-b border-neutral-100">
                  <th className="py-4 px-6 font-semibold">लेख (Article)</th>
                  {isOwner && <th className="py-4 px-6 font-semibold">लेखक / एडमिन</th>}
                  <th className="py-4 px-6 font-semibold">राज्य</th>
                  <th className="py-4 px-6 font-semibold">स्थिति (Status)</th>
                  <th className="py-4 px-6 font-semibold">व्यूज</th>
                  <th className="py-4 px-6 font-semibold">दिनांक</th>
                  <th className="py-4 px-6 font-semibold text-right">कार्रवाई</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-sm">
                {filteredArticles.map((article: any) => {
                  const catSlug = article.category?.slug || 'news';
                  return (
                    <tr key={article._id} className="hover:bg-neutral-50/60 transition-colors">
                      {/* Title & Cover */}
                      <td className="py-4 px-6 max-w-sm sm:max-w-md">
                        <div className="flex items-center space-x-3.5">
                          <div className="w-12 h-12 rounded-xl bg-neutral-100 overflow-hidden flex-shrink-0 border border-neutral-200/60">
                            {article.coverImage ? (
                              <img src={article.coverImage} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-400 text-[10px]">No Pic</div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-neutral-900 block truncate font-devanagari text-sm">
                              {article.title}
                            </span>
                            <div className="flex items-center space-x-2 text-[11px] text-neutral-400 font-mono mt-0.5">
                              <span className="truncate">/{article.slug}</span>
                              <Link 
                                href={`/${catSlug}/${article.slug}`} 
                                target="_blank"
                                className="text-neutral-400 hover:text-red-600"
                                title="लाइव देखें"
                              >
                                <ExternalLink size={12} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Author Column if Owner */}
                      {isOwner && (
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-neutral-900 text-xs">
                              {article.createdBy?.name || article.author?.name || 'अज्ञात'}
                            </span>
                            {article.createdBy?.email && (
                              <span className="text-[10px] text-neutral-400 font-mono">
                                {article.createdBy.email}
                              </span>
                            )}
                          </div>
                        </td>
                      )}

                      {/* Category */}
                      <td className="py-4 px-6">
                        <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-neutral-100 text-neutral-700 font-devanagari">
                          {article.category?.name || 'सामान्य'}
                        </span>
                      </td>

                      {/* Status Toggle Button */}
                      <td className="py-4 px-6">
                        {article.status === 'scheduled' ? (
                          <div className="flex flex-col items-start gap-1">
                            <button 
                              onClick={() => openScheduleModal(article)}
                              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider transition-colors border bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200 cursor-pointer"
                              title="शेड्यूल बदलने या लाइव करने के लिए क्लिक करें"
                            >
                              <Clock size={13} className="text-neutral-500 flex-shrink-0" />
                              <span>शेड्यूल</span>
                            </button>
                            {article.scheduledAt && (
                              <span className="text-[10px] text-neutral-500 font-mono font-medium pl-1">
                                {new Date(article.scheduledAt).toLocaleDateString('hi-IN', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            )}
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleToggleStatus(article)}
                            className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors border cursor-pointer ${
                              article.status === 'published' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            }`}
                            title="स्थिति बदलने के लिए क्लिक करें"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${article.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                            <span>{article.status === 'published' ? 'लाइव' : 'ड्राफ्ट'}</span>
                          </button>
                        )}
                      </td>

                      {/* Views */}
                      <td className="py-4 px-6 text-xs text-neutral-600 font-sans">
                        <span className="flex items-center space-x-1">
                          <Eye size={13} className="text-neutral-400" />
                          <span>{article.views || 0}</span>
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 text-xs text-neutral-500 font-sans">
                        {new Date(article.createdAt).toLocaleDateString('hi-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => openScheduleModal(article)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-lg transition-colors font-devanagari cursor-pointer"
                            title="प्रकाशन समय तय करें (Schedule Article)"
                          >
                            <Clock size={13} className="text-neutral-500" />
                            <span>शेड्यूल</span>
                          </button>
                          <Link 
                            href={`/admin/articles/${article._id}/edit`} 
                            className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors font-devanagari"
                          >
                            <Edit3 size={14} />
                            <span>संपादित करें</span>
                          </Link>
                          <button 
                            onClick={() => handleDelete(article._id)} 
                            className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            title="हटाएं"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Schedule Modal */}
      {scheduleModalArticle && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-2xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-2xl border border-neutral-100 space-y-4 font-devanagari">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center space-x-2">
                <span className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-100">
                  <Clock size={18} />
                </span>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">
                    प्रकाशन समय तय करें (Schedule)
                  </h3>
                  <span className="text-[10px] text-neutral-500 font-semibold font-sans">
                    AUTOMATIC PUBLISH
                  </span>
                </div>
              </div>
              <button
                onClick={() => setScheduleModalArticle(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Article Title */}
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block font-sans mb-1">
                चयनित लेख:
              </span>
              <p className="text-xs font-bold text-neutral-800 line-clamp-2">
                {scheduleModalArticle.title}
              </p>
            </div>

            {/* DateTime Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700">
                तारीख और समय चुनें (Date & Time): *
              </label>
              <input
                type="datetime-local"
                value={quickScheduleTime}
                onChange={(e) => setQuickScheduleTime(e.target.value)}
                className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 text-xs font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-sans shadow-xs"
              />
            </div>

            {/* Quick 1-click Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block font-sans">
                त्वरित विकल्प (Presets):
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => applyArticlePreset(1)}
                  className="px-2.5 py-1.5 text-xs font-semibold bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 rounded-xl transition cursor-pointer text-center"
                >
                  1 घंटा बाद
                </button>
                <button
                  type="button"
                  onClick={() => applyArticlePreset(3)}
                  className="px-2.5 py-1.5 text-xs font-semibold bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 rounded-xl transition cursor-pointer text-center"
                >
                  3 घंटे बाद
                </button>
                <button
                  type="button"
                  onClick={() => applyArticleTomorrow(9)}
                  className="px-2.5 py-1.5 text-xs font-semibold bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 rounded-xl transition cursor-pointer text-center"
                >
                  कल सुबह 9:00
                </button>
                <button
                  type="button"
                  onClick={() => applyArticleTomorrow(18)}
                  className="px-2.5 py-1.5 text-xs font-semibold bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 rounded-xl transition cursor-pointer text-center"
                >
                  कल शाम 6:00
                </button>
              </div>
            </div>

            {/* Info Message */}
            {quickScheduleTime && (
              <p className="text-[11px] text-neutral-600 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 leading-relaxed">
                निर्धारित समय आते ही यह लेख स्वतः वेबसाइट पर लाइव हो जाएगा।
              </p>
            )}

            {/* Modal Actions */}
            <div className="pt-2 border-t border-neutral-100 flex flex-col sm:flex-row gap-2 justify-end">
              <button
                type="button"
                onClick={() => handleSaveSchedule('published')}
                disabled={savingSchedule}
                className="px-3.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition cursor-pointer text-center"
              >
                तुरंत लाइव करें
              </button>
              <button
                type="button"
                onClick={() => handleSaveSchedule('scheduled')}
                disabled={savingSchedule}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:scale-98 rounded-xl transition shadow-xs cursor-pointer text-center"
              >
                {savingSchedule ? 'सहेज रहे हैं...' : 'शेड्यूल सेट करें'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
