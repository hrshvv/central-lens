'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import ArticleEditor from '@/components/admin/ArticleEditor';

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/articles/${resolvedParams.id}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'लेख लोड करने में विफल');
        }
        return data;
      })
      .then(data => {
        setArticle(data);
        setLoading(false);
      })
      .catch((err) => {
        setErrorMsg(err.message || 'त्रुटि हुई');
        setLoading(false);
      });
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-neutral-500 font-devanagari">लेख लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || !article) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white rounded-2xl border border-red-200 p-8 text-center shadow-xs space-y-4 font-devanagari">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert size={24} />
        </div>
        <h2 className="text-lg font-bold text-neutral-900">पहुंच अस्वीकृत (Access Denied)</h2>
        <p className="text-xs sm:text-sm text-neutral-600">
          {errorMsg || 'लेख नहीं मिला या आपको इसे देखने/संपादित करने की अनुमति नहीं है।'}
        </p>
        <div>
          <Link
            href="/admin/articles"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition"
          >
            <ArrowLeft size={14} />
            <span>लेख सूची पर वापस जाएं</span>
          </Link>
        </div>
      </div>
    );
  }

  return <ArticleEditor initialData={article} />;
}
