'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, X, Check, Globe, Palette, ArrowUpDown } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<any>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [color, setColor] = useState('#DC2626');
  const [order, setOrder] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    setLoading(true);
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const openModal = (category: any = null) => {
    if (category) {
      setEditCategory(category);
      setName(category.name);
      setSlug(category.slug);
      setColor(category.color || '#DC2626');
      setOrder(category.order || 0);
    } else {
      setEditCategory(null);
      setName('');
      setSlug('');
      setColor('#DC2626');
      setOrder(categories.length + 1);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `cat-${Date.now()}`;
    const payload = { name, slug: finalSlug, color, order: Number(order) };
    
    const url = editCategory ? `/api/admin/categories/${editCategory._id}` : '/api/admin/categories';
    const method = editCategory ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        closeModal();
        fetchCategories();
      } else {
        const error = await res.json();
        alert(`त्रुटि: ${error.error || 'कैटेगरी सहेजने में विफल'}`);
      }
    } catch {
      alert('तकनीकी समस्या आई');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('क्या आप इस श्रेणी को हटाना चाहते हैं?')) {
      await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      fetchCategories();
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight font-devanagari">
            कैटेगरी प्रबंधन (Categories)
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-devanagari">
            पोर्टल पर समाचारों के वर्गीकरण एवं नेविगेशन बार का क्रम निर्धारित करें
          </p>
        </div>
        <button 
          onClick={() => openModal()} 
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 active:scale-98 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition font-devanagari"
        >
          <Plus size={16} />
          <span>नई कैटेगरी जोड़ें</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50/80 text-neutral-500 text-xs uppercase tracking-wider border-b border-neutral-100">
                <th className="py-4 px-6 font-semibold">नाम (Name)</th>
                <th className="py-4 px-6 font-semibold">URL Slug</th>
                <th className="py-4 px-6 font-semibold">क्रम (Order)</th>
                <th className="py-4 px-6 font-semibold">थीम रंग (Color)</th>
                <th className="py-4 px-6 font-semibold text-right">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-neutral-400">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-6 h-6 border-3 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs">कैटेगरी लोड हो रही हैं...</span>
                    </div>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-neutral-400 text-xs">
                    कोई कैटेगरी नहीं मिली।
                  </td>
                </tr>
              ) : (
                categories.map((cat: any) => (
                  <tr key={cat._id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <span 
                          className="w-3 h-3 rounded-full flex-shrink-0 shadow-xs" 
                          style={{ backgroundColor: cat.color || '#DC2626' }}
                        />
                        <span className="font-bold text-neutral-900 font-devanagari text-base">
                          {cat.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-neutral-500">
                      /{cat.slug}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-2.5 py-1 bg-neutral-100 rounded-md text-xs font-bold text-neutral-700">
                        {cat.order || 0}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <span 
                          className="w-5 h-5 rounded-lg border border-neutral-200 shadow-xs" 
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-xs font-mono text-neutral-600 uppercase">{cat.color}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => openModal(cat)} 
                          className="p-2 text-neutral-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                          title="संपादित करें"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(cat._id)} 
                          className="p-2 text-neutral-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                          title="हटाएं"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Styled Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-neutral-100 transform transition-all">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100">
              <h2 className="text-lg font-black text-neutral-900 font-devanagari">
                {editCategory ? 'कैटेगरी संपादित करें' : 'नई कैटेगरी जोड़ें'}
              </h2>
              <button 
                onClick={closeModal}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5 font-devanagari">
                  कैटेगरी का नाम (Hindi Name) *
                </label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  placeholder="उदा. खेल, तकनीक, राजनीति..."
                  className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-devanagari" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                  <Globe size={13} />
                  <span>URL Slug (English) *</span>
                </label>
                <input 
                  type="text" 
                  value={slug} 
                  onChange={(e) => setSlug(e.target.value)} 
                  required 
                  placeholder="e.g. sports, tech, politics"
                  className="w-full border border-neutral-200 rounded-xl p-3 text-xs font-mono text-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-500" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                    <Palette size={13} />
                    <span>थीम रंग (Color)</span>
                  </label>
                  <div className="flex items-center space-x-2 border border-neutral-200 rounded-xl p-2">
                    <input 
                      type="color" 
                      value={color} 
                      onChange={(e) => setColor(e.target.value)} 
                      className="w-8 h-8 rounded-lg border-0 cursor-pointer p-0 bg-transparent" 
                    />
                    <span className="text-xs font-mono text-neutral-600 uppercase">{color}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                    <ArrowUpDown size={13} />
                    <span>नेविगेशन क्रम (Order)</span>
                  </label>
                  <input 
                    type="number" 
                    value={order} 
                    onChange={(e) => setOrder(Number(e.target.value))} 
                    className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" 
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-neutral-100">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition"
                >
                  रद्द करें
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-1.5"
                >
                  <Check size={14} />
                  <span>सहेजें (Save)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
