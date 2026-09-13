'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminArticles() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      .catch(console.error);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to archive this article?')) {
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
        alert('Failed to update status');
      }
    } catch (error) {
      console.error(error);
      alert('Error updating status');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Articles</h1>
        <Link href="/admin/articles/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
          <Plus size={20} />
          <span>New Article</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Views</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading articles...</td></tr>
              ) : articles.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">No articles found.</td></tr>
              ) : articles.map((article: any) => (
                <tr key={article._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium">{article.title}</td>
                  <td className="p-4">{article.category?.name || '-'}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleToggleStatus(article)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors border ${
                        article.status === 'published' 
                          ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                          : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                      }`}
                      title="Click to toggle status"
                    >
                      {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                    </button>
                  </td>
                  <td className="p-4 text-gray-600">{article.views || 0}</td>
                  <td className="p-4 text-gray-500 text-sm">{new Date(article.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 flex justify-end space-x-2">
                    <Link href={`/admin/articles/${article._id}/edit`} className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                      <Edit size={18} />
                    </Link>
                    <button onClick={() => handleDelete(article._id)} className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
