'use client';

import { use, useEffect, useState } from 'react';
import ArticleEditor from '@/components/admin/ArticleEditor';

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/articles/${resolvedParams.id}`)
      .then(res => res.json())
      .then(data => {
        setArticle(data);
        setLoading(false);
      })
      .catch(console.error);
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

  if (!article) {
    return (
      <div className="p-8 text-center text-red-600 font-devanagari font-bold">
        लेख नहीं मिला (Article not found)
      </div>
    );
  }

  return <ArticleEditor initialData={article} />;
}
