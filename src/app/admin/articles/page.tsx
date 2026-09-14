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
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight font-devanagari">
            लेख प्रबंधन (Articles Management)
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            कुल {articles.length} लेख उपलब्ध हैं • प्रकाशित अथवा ड्राफ्ट प्रबंधित करें
          </p>
        </div>
        <Link 
          href="/admin/articles/new" 
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 font-devanagari"
        >
          <Plus size={16} />
          <span>नया लेख जोड़ें</span>
        </Link>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Box */}
        <div className="relative w-full sm:w-80">
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
        <div className="flex items-center space-x-1.5 p-1 bg-neutral-100 rounded-xl w-full sm:w-auto text-xs font-semibold">
          <button
            onClick={() => setStatusFilter('all')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg transition ${
              statusFilter === 'all' ? 'bg-white text-neutral-900 shadow-xs font-bold' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            सभी ({articles.length})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg transition ${
              statusFilter === 'published' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            लाइव ({articles.filter(a => a.status === 'published').length})
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg transition ${
              statusFilter === 'draft' ? 'bg-white text-amber-700 shadow-xs font-bold' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            ड्राफ्ट्स ({articles.filter(a => a.status === 'draft').length})
          </button>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-neutral-400">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-6 h-6 border-3 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs">लेख लोड हो रहे हैं...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-neutral-400 text-xs">
                    कोई लेख नहीं मिला।
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article: any) => {
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
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
