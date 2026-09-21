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
  Calendar
} from 'lucide-react';

export default function AdminArticles() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = () => {
    setLoading(true);
    fetch('/api/admin/articles')
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
      await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' });
      fetchArticles();
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
        alert('स्थिति बदलने में विफल');
      }
    } catch (error) {
      console.error(error);
      alert('त्रुटि हुई');
    }
  };

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
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-neutral-900 tracking-tight font-devanagari">
            लेख प्रबंधन (Articles Management)
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

        {/* Status Filter Tabs - scrollable if needed */}
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
            onClick={() => setStatusFilter('draft')}
            className={`flex-1 md:flex-initial px-3 py-1.5 rounded-lg transition whitespace-nowrap text-center ${
              statusFilter === 'draft' ? 'bg-white text-amber-700 shadow-xs font-bold' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            ड्राफ्ट्स ({articles.filter(a => a.status === 'draft').length})
          </button>
        </div>
      </div>

      {/* Articles Container: Dual Mobile Cards + Desktop Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        {/* Loading State */}
        {loading && (
          <div className="py-16 text-center text-neutral-400">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-6 h-6 border-3 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-devanagari">लेख लोड हो रहे हैं...</span>
            </div>
          </div>
        )}

        {/* Empty State */}
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
                  {/* Top: Image + Title + Slug */}
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

                  {/* Middle: Badges Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-neutral-100/80 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-neutral-100 text-neutral-700 font-devanagari">
                        {article.category?.name || 'सामान्य'}
                      </span>
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

                  {/* Bottom: Action Buttons */}
                  <div className="flex items-center justify-end space-x-2 pt-1">
                    <Link 
                      href={`/admin/articles/${article._id}/edit`} 
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors font-devanagari"
                    >
                      <Edit3 size={14} />
                      <span>संपादित करें</span>
                    </Link>
                    <button 
                      onClick={() => handleDelete(article._id)} 
                      className="p-1.5 text-neutral-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
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
                  <th className="py-4 px-6 font-semibold">कैटेगरी</th>
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

                      {/* Category */}
                      <td className="py-4 px-6">
                        <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-neutral-100 text-neutral-700 font-devanagari">
                          {article.category?.name || 'सामान्य'}
                        </span>
                      </td>

                      {/* Status Toggle Button */}
                      <td className="py-4 px-6">
                        <button 
                          onClick={() => handleToggleStatus(article)}
                          className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors border ${
                            article.status === 'published' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                              : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                          }`}
                          title="स्थिति बदलने के लिए क्लिक करें"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${article.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                          <span>{article.status === 'published' ? 'लाइव' : 'ड्राफ्ट'}</span>
                        </button>
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
                          <Link 
                            href={`/admin/articles/${article._id}/edit`} 
                            className="p-2 text-neutral-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="संपादित करें"
                          >
                            <Edit3 size={16} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(article._id)} 
                            className="p-2 text-neutral-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
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
    </div>
  );
}
