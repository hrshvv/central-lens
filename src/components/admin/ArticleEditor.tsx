'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function ArticleEditor({ initialData = null }: { initialData?: any }) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || '');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [category, setCategory] = useState(initialData?.category?._id || initialData?.category || '');
  const [status, setStatus] = useState(initialData?.status || 'draft');
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Assuming /api/admin/upload returns { url: string }
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setCoverImage(data.url);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title,
      coverImage,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      content,
      category,
      status,
      author: { name: 'Admin' } // Hardcoded for MVP, ideally fetched from auth context
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
        alert(`Error: ${error.error}`);
      }
    } catch (err) {
      alert('An error occurred while saving the article.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          className="w-full border-gray-300 rounded-lg shadow-sm p-3 border focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter article title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
        <div className="flex items-center space-x-4">
          <input 
            type="text" 
            value={coverImage} 
            onChange={(e) => setCoverImage(e.target.value)} 
            className="flex-1 border-gray-300 rounded-lg shadow-sm p-3 border focus:ring-blue-500 focus:border-blue-500"
            placeholder="Image URL or upload below"
          />
          <div className="relative">
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />
            <button 
              type="button"
              className="px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </div>
        </div>
        {coverImage && (
          <div className="mt-4">
            <img src={coverImage} alt="Cover Preview" className="h-40 object-cover rounded-lg border border-gray-200" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            required
            className="w-full border-gray-300 rounded-lg shadow-sm p-3 border focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a category</option>
            {categories.map((cat: any) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border-gray-300 rounded-lg shadow-sm p-3 border focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <div className="bg-white h-96 pb-12">
          <ReactQuill 
            theme="snow" 
            value={content} 
            onChange={setContent} 
            className="h-full"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-end space-x-4">
        <button 
          type="button" 
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Article'}
        </button>
      </div>
    </form>
  );
}
