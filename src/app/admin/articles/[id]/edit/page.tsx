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

  if (loading) return <div className="p-8">Loading article...</div>;
  if (!article) return <div className="p-8 text-red-600">Article not found</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Edit Article</h1>
      <ArticleEditor initialData={article} />
    </div>
  );
}
