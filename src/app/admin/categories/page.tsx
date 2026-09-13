'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<any>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [color, setColor] = useState('#000000');
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
      .catch(console.error);
  };

  const openModal = (category: any = null) => {
    if (category) {
      setEditCategory(category);
      setName(category.name);
      setColor(category.color);
      setOrder(category.order);
    } else {
      setEditCategory(null);
      setName('');
      setColor('#000000');
      setOrder(0);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), color, order };
    
    const url = editCategory ? `/api/admin/categories/${editCategory._id}` : '/api/admin/categories';
    const method = editCategory ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    closeModal();
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this category?')) {
      await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      fetchCategories();
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Categories</h1>
        <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
          <Plus size={20} />
          <span>New Category</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Slug</th>
              <th className="p-4 font-medium">Order</th>
              <th className="p-4 font-medium">Color</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading categories...</td></tr>
            ) : categories.map((cat: any) => (
              <tr key={cat._id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-4 font-medium">{cat.name}</td>
                <td className="p-4 text-gray-500">{cat.slug}</td>
                <td className="p-4">{cat.order}</td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }}></div>
                    <span className="text-sm text-gray-500">{cat.color}</span>
                  </div>
                </td>
                <td className="p-4 flex justify-end space-x-2">
                  <button onClick={() => openModal(cat)} className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(cat._id)} className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Basic Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editCategory ? 'Edit Category' : 'New Category'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full border-gray-300 rounded-lg p-2 border focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 border-gray-300 rounded-lg border cursor-pointer p-1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value))} className="w-full border-gray-300 rounded-lg p-2 border focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={closeModal} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
