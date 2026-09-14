'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  CheckCircle2, 
  Layers, 
  Plus, 
  ArrowUpRight, 
  Sparkles,
  Eye,
  ExternalLink
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-neutral-500 font-devanagari">डैशबोर्ड लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'कुल लेख (Total Articles)',
      value: stats?.stats?.totalArticles || 0,
      icon: FileText,
      accent: 'border-t-4 border-t-red-600',
      iconColor: 'bg-red-50 text-red-600',
      badge: 'लाइब्रेरी',
    },
    {
      title: 'प्रकाशित लेख (Published)',
      value: stats?.stats?.publishedArticles || 0,
      icon: CheckCircle2,
      accent: 'border-t-4 border-t-emerald-600',
      iconColor: 'bg-emerald-50 text-emerald-600',
      badge: 'लाइव',
    },
    {
      title: 'ड्राफ्ट्स (Drafts)',
      value: stats?.stats?.draftArticles || 0,
      icon: Sparkles,
      accent: 'border-t-4 border-t-amber-500',
      iconColor: 'bg-amber-50 text-amber-600',
      badge: 'अप्रकाशित',
    },
    {
      title: 'कैटेगरी (Categories)',
      value: stats?.stats?.totalCategories || 0,
      icon: Layers,
      accent: 'border-t-4 border-t-neutral-900',
      iconColor: 'bg-neutral-100 text-neutral-900',
      badge: 'सक्रिय',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans">
      {/* Central Lens Branded Welcome Banner (White & Red Theme) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-l-4 border-l-red-600">
        <div>
          <div className="flex items-center space-x-2 text-red-600 text-xs font-bold uppercase tracking-wider mb-1.5 font-sans">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            <span>Central Lens एडमिन न्यूज़ रूम</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 font-devanagari">
            डैशबोर्ड ओवरव्यू (Dashboard Overview)
          </h1>
          <p className="text-neutral-500 text-xs sm:text-sm mt-1 max-w-xl font-devanagari">
            यहाँ से आप नए समाचार प्रकाशित कर सकते हैं, श्रेणियों का प्रबंधन कर सकते हैं और लाइव पोर्टल का संचालन कर सकते हैं।
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <Link
            href="/admin/articles/new"
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-3 bg-red-600 hover:bg-red-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-sm transition-all font-devanagari"
          >
            <Plus size={16} />
            <span>नया लेख लिखें</span>
          </Link>
          <Link
            href="/admin/categories"
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold border border-neutral-200 transition font-devanagari"
          >
            <span>कैटेगरी जोड़ें</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx} 
              className={`bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${card.accent}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                  {card.badge}
                </span>
              </div>
              <div className="flex items-end justify-between mt-2">
                <span className="text-3xl font-black text-neutral-900 tracking-tight">
                  {card.value}
                </span>
                <div className={`p-2.5 rounded-xl ${card.iconColor}`}>
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Articles Section */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-6 bg-red-600 rounded-full inline-block"></span>
            <div>
              <h2 className="text-lg font-black text-neutral-900 tracking-tight font-devanagari">
                हालिया प्रकाशित लेख (Recent Articles)
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">वेबसाइट पर लाइव और ड्राफ्ट लेख</p>
            </div>
          </div>
          <Link 
            href="/admin/articles" 
            className="flex items-center space-x-1 text-xs font-bold text-red-600 hover:text-red-700 font-devanagari"
          >
            <span>सभी {stats?.stats?.totalArticles || 0} लेख देखें</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50/80 text-neutral-500 text-xs uppercase tracking-wider border-b border-neutral-100">
                <th className="py-4 px-6 font-bold">शीर्षक (Title)</th>
                <th className="py-4 px-6 font-bold">कैटेगरी</th>
                <th className="py-4 px-6 font-bold">स्थिति</th>
                <th className="py-4 px-6 font-bold">दिनांक</th>
                <th className="py-4 px-6 font-bold text-right">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-sm">
              {stats?.recentArticles?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-400 text-xs">
                    कोई हालिया लेख नहीं मिला।
                  </td>
                </tr>
              ) : (
                stats?.recentArticles?.map((article: any) => (
                  <tr key={article._id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-4 px-6 max-w-md">
                      <span className="font-bold text-neutral-900 block truncate font-devanagari">
                        {article.title}
                      </span>
                      <span className="text-[11px] text-neutral-400 block font-mono mt-0.5">
                        /{article.slug}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-neutral-100 text-neutral-700 font-devanagari">
                        {article.category?.name || 'सामान्य'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        article.status === 'published' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${article.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        <span>{article.status === 'published' ? 'लाइव' : 'ड्राफ्ट'}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-neutral-500 font-sans">
                      {new Date(article.createdAt).toLocaleDateString('hi-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link 
                        href={`/admin/articles/${article._id}/edit`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-red-50 hover:text-red-600 transition font-devanagari"
                      >
                        <span>संपादित करें</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
