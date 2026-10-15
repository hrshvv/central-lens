'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FileText, 
  CheckCircle2, 
  Layers, 
  Plus, 
  ArrowUpRight, 
  Sparkles, 
  Crown,
  Users,
  Mail,
  Video,
  ShieldCheck,
  Clock
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          router.push('/login?error=session_expired');
          return null;
        }
        return res.json();
      })
      .then(d => {
        if (d) setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [router]);

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

  const isOwner = data?.isOwner === true;
  const stats = data?.stats || {};

  const statCards = isOwner ? [
    {
      title: 'कुल लेख (All Articles)',
      value: stats.totalArticles || 0,
      icon: FileText,
      accent: 'border-t-4 border-t-red-600',
      iconColor: 'bg-red-50 text-red-600',
      badge: 'संपूर्ण पोर्टल',
      href: '/admin/articles',
    },
    {
      title: 'प्रकाशित लेख (Published)',
      value: stats.publishedArticles || 0,
      icon: CheckCircle2,
      accent: 'border-t-4 border-t-emerald-600',
      iconColor: 'bg-emerald-50 text-emerald-600',
      badge: 'लाइव',
      href: '/admin/articles?status=published',
    },
    {
      title: '⏰ शेड्यूल लेख (Scheduled)',
      value: stats.scheduledArticles || 0,
      icon: Clock,
      accent: 'border-t-4 border-t-purple-600',
      iconColor: 'bg-purple-50 text-purple-600',
      badge: 'ऑटो-पब्लिश NEW',
      href: '/admin/articles?status=scheduled',
    },
    {
      title: 'सदस्य व टीम (Users & Roles)',
      value: stats.totalUsers || 0,
      icon: Users,
      accent: 'border-t-4 border-t-amber-500',
      iconColor: 'bg-amber-50 text-amber-600',
      badge: 'ओनर कंट्रोल',
      href: '/admin/users'
    },
  ] : [
    {
      title: 'आपके कुल लेख (My Articles)',
      value: stats.totalArticles || 0,
      icon: FileText,
      accent: 'border-t-4 border-t-red-600',
      iconColor: 'bg-red-50 text-red-600',
      badge: 'आपके द्वारा',
      href: '/admin/articles',
    },
    {
      title: 'आपके प्रकाशित लेख (My Live)',
      value: stats.publishedArticles || 0,
      icon: CheckCircle2,
      accent: 'border-t-4 border-t-emerald-600',
      iconColor: 'bg-emerald-50 text-emerald-600',
      badge: 'लाइव',
      href: '/admin/articles?status=published',
    },
    {
      title: '⏰ शेड्यूल लेख (Scheduled)',
      value: stats.scheduledArticles || 0,
      icon: Clock,
      accent: 'border-t-4 border-t-purple-600',
      iconColor: 'bg-purple-50 text-purple-600',
      badge: 'ऑटो-पब्लिश NEW',
      href: '/admin/articles?status=scheduled',
    },
    {
      title: 'आपके ड्राफ्ट्स (My Drafts)',
      value: stats.draftArticles || 0,
      icon: Sparkles,
      accent: 'border-t-4 border-t-amber-500',
      iconColor: 'bg-amber-50 text-amber-600',
      badge: 'अप्रकाशित',
      href: '/admin/articles?status=draft',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 font-sans">
      {/* Central Lens Branded Welcome Banner */}
      <div className={`bg-white rounded-2xl p-4 sm:p-6 lg:p-8 border shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 border-l-4 ${
        isOwner ? 'border-amber-200/90 border-l-amber-500 bg-gradient-to-r from-amber-50/40 via-white to-red-50/30' : 'border-neutral-200/80 border-l-red-600'
      }`}>
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider mb-1.5 font-sans">
            {isOwner ? (
              <>
                <Crown size={14} className="text-amber-600 fill-amber-500" />
                <span className="text-amber-900 font-black tracking-tight font-sans">
                  CENTRAL <span className="text-red-600">LENS</span> <span className="text-amber-800 font-semibold font-devanagari ml-1">ओनर कंट्रोल डेस्क</span>
                </span>
              </>
            ) : (
              <>
                <ShieldCheck size={14} className="text-blue-600" />
                <span className="text-neutral-900 font-black tracking-tight font-sans">
                  CENTRAL <span className="text-red-600">LENS</span> <span className="text-neutral-600 font-semibold font-devanagari ml-1">एडमिन डेस्क</span>
                </span>
              </>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-neutral-900 font-devanagari">
            {isOwner ? 'ओनर डैशबोर्ड ओवरव्यू (Full Access)' : 'व्यक्तिगत एडमिन डैशबोर्ड (My Content)'}
          </h1>
          <p className="text-neutral-500 text-xs sm:text-sm mt-1 max-w-xl font-devanagari">
            {isOwner
              ? 'ओनर स्तर पर आप पोर्टल के सभी लेख, वीडियो, न्यूज़लेटर और एडमिन भूमिकाओं को नियंत्रित कर सकते हैं।'
              : 'यहाँ आप अपने द्वारा जोड़े गए समाचार लेख, वीडियो व न्यूज़लेटर देख और प्रबंधित कर सकते हैं।'}
          </p>
        </div>

        <div className="flex items-center space-x-2.5 sm:space-x-3 w-full md:w-auto">
          <Link
            href="/admin/articles/new"
            className="flex-1 md:flex-initial flex items-center justify-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-5 py-2.5 sm:py-3 bg-red-600 hover:bg-red-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-sm transition-all font-devanagari text-center"
          >
            <Plus size={16} className="flex-shrink-0" />
            <span>नया लेख लिखें</span>
          </Link>
          {isOwner ? (
            <Link
              href="/admin/users"
              className="flex-1 md:flex-initial flex items-center justify-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-5 py-2.5 sm:py-3 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold border border-amber-300 transition font-devanagari text-center"
            >
              <Users size={16} />
              <span>भूमिकाएं प्रबंधित करें</span>
            </Link>
          ) : (
            <Link
              href="/admin/newsletters"
              className="flex-1 md:flex-initial flex items-center justify-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-5 py-2.5 sm:py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold border border-neutral-200 transition font-devanagari text-center"
            >
              <Mail size={15} />
              <span>न्यूज़लेटर</span>
            </Link>
          )}
        </div>
      </div>

      {/* Scheduled Publishing Feature Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-neutral-900 rounded-2xl p-4 sm:p-5 text-white shadow-md border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 flex-shrink-0">
            <Clock size={22} className="animate-pulse text-purple-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full font-sans">
                NEW FEATURE
              </span>
              <h3 className="text-sm sm:text-base font-bold font-devanagari text-white">
                समय तय करके प्रकाशन (Scheduled Publishing)
              </h3>
            </div>
            <p className="text-xs text-purple-200/90 mt-1 font-devanagari">
              अब आप लेख और वीडियो का भविष्य का प्रकाशन समय सेट कर सकते हैं। समय आते ही कंटेंट अपने-आप लाइव हो जाएगा।
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Link
            href="/admin/articles/new"
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-sm font-devanagari text-center whitespace-nowrap"
          >
            ⏰ लेख शेड्यूल करें
          </Link>
          <Link
            href="/admin/videos"
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/20 font-devanagari text-center whitespace-nowrap"
          >
            🎬 वीडियो स्टूडियो
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {statCards.map((card: any, idx: number) => {
          const Icon = card.icon;
          const CardContent = (
            <div 
              className={`bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-neutral-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${card.accent}`}
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="text-[10px] sm:text-xs font-bold text-neutral-500 uppercase tracking-wider line-clamp-1">
                  {card.title}
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 flex-shrink-0">
                  {card.badge}
                </span>
              </div>
              <div className="flex items-end justify-between mt-1 sm:mt-2">
                <span className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                  {card.value}
                </span>
                <div className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl ${card.iconColor}`}>
                  <Icon size={18} className="sm:w-5 sm:h-5" />
                </div>
              </div>
            </div>
          );

          return card.href ? (
            <Link key={idx} href={card.href} className="block transition-transform hover:-translate-y-0.5">
              {CardContent}
            </Link>
          ) : (
            <div key={idx}>{CardContent}</div>
          );
        })}
      </div>

      {/* Recent Articles Section */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-5 sm:h-6 bg-red-600 rounded-full inline-block flex-shrink-0"></span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight font-devanagari">
                {isOwner ? 'हालिया प्रकाशित लेख (All Admins)' : 'आपके हालिया लेख (My Recent Articles)'}
              </h2>
              <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
                {isOwner ? 'वेबसाइट पर सभी एडमिन्स द्वारा लाइव और ड्राफ्ट लेख' : 'केवल आपके द्वारा बनाए गए लेख'}
              </p>
            </div>
          </div>
          <Link 
            href="/admin/articles" 
            className="self-start sm:self-auto flex items-center space-x-1 text-xs font-bold text-red-600 hover:text-red-700 font-devanagari"
          >
            <span>सभी {stats.totalArticles || 0} लेख देखें</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Articles List / Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[640px]">
            <thead>
              <tr className="bg-neutral-50/80 text-neutral-500 text-xs uppercase tracking-wider border-b border-neutral-100">
                <th className="py-4 px-6 font-bold">शीर्षक (Title)</th>
                {isOwner && <th className="py-4 px-6 font-bold">लेखक / एडमिन</th>}
                <th className="py-4 px-6 font-bold">राज्य</th>
                <th className="py-4 px-6 font-bold">स्थिति</th>
                <th className="py-4 px-6 font-bold">दिनांक</th>
                <th className="py-4 px-6 font-bold text-right">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-sm">
              {!data?.recentArticles || data.recentArticles.length === 0 ? (
                <tr>
                  <td colSpan={isOwner ? 6 : 5} className="py-12 text-center text-neutral-400 text-xs font-devanagari">
                    कोई हालिया लेख नहीं मिला।
                  </td>
                </tr>
              ) : (
                data.recentArticles.map((article: any) => (
                  <tr key={article._id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-4 px-6 max-w-md">
                      <span className="font-bold text-neutral-900 block truncate font-devanagari">
                        {article.title}
                      </span>
                      <span className="text-[11px] text-neutral-400 block font-mono mt-0.5">
                        /{article.slug}
                      </span>
                    </td>
                    {isOwner && (
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-bold bg-neutral-100 text-neutral-800">
                          <span>{article.createdBy?.name || article.author?.name || 'अज्ञात'}</span>
                        </span>
                      </td>
                    )}
                    <td className="py-4 px-6">
                      <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-neutral-100 text-neutral-700 font-devanagari">
                        {article.category?.name || 'सामान्य'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        article.status === 'published' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : article.status === 'scheduled'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          article.status === 'published' 
                            ? 'bg-emerald-500' 
                            : article.status === 'scheduled'
                              ? 'bg-purple-500'
                              : 'bg-amber-500'
                        }`}></span>
                        <span>{article.status === 'published' ? 'लाइव' : article.status === 'scheduled' ? '⏰ शेड्यूल' : 'ड्राफ्ट'}</span>
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
