'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Mail, 
  Plus, 
  Send, 
  FileText, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  Search, 
  Users, 
  X, 
  Sparkles,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface NewsletterItem {
  _id: string;
  subject: string;
  previewText?: string;
  content: string;
  status: 'draft' | 'sent';
  sentAt?: string;
  recipientsCount?: number;
  authorName?: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  createdAt: string;
}

export default function AdminNewslettersPage() {
  const [newsletters, setNewsletters] = useState<NewsletterItem[]>([]);
  const [subscribersCount, setSubscribersCount] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsletterItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [subject, setSubject] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'draft' | 'sent'>('draft');

  // Subscribers Modal
  const [isSubscribersModalOpen, setIsSubscribersModalOpen] = useState(false);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) setCurrentUser(data.user);
      })
      .catch(() => {});

    // Fetch subscriber count
    fetch('/api/admin/newsletters/subscribers')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.meta?.total !== undefined) {
          setSubscribersCount(data.meta.total);
        }
      })
      .catch(() => {});
  }, []);

  const fetchNewsletters = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/newsletters?limit=100');
      const data = await res.json();
      setNewsletters(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNewsletters();
  }, [fetchNewsletters]);

  const openNewModal = () => {
    setEditingItem(null);
    setSubject('');
    setPreviewText('');
    setContent('');
    setStatus('draft');
    setIsModalOpen(true);
  };

  const openEditModal = (item: NewsletterItem) => {
    setEditingItem(item);
    setSubject(item.subject);
    setPreviewText(item.previewText || '');
    setContent(item.content);
    setStatus(item.status);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) {
      alert('कृपया विषय (Subject) और सामग्री भरें।');
      return;
    }

    setSubmitting(true);
    const payload = {
      subject: subject.trim(),
      previewText: previewText.trim(),
      content: content.trim(),
      status,
    };

    const url = editingItem ? `/api/admin/newsletters/${editingItem._id}` : '/api/admin/newsletters';
    const method = editingItem ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        closeModal();
        fetchNewsletters();
      } else {
        const data = await res.json();
        alert(`त्रुटि: ${data.error || 'सहेजने में विफल'}`);
      }
    } catch {
      alert('सर्वर से संपर्क करने में समस्या आई।');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('क्या आप इस न्यूज़लेटर को हटाना चाहते हैं?')) {
      try {
        const res = await fetch(`/api/admin/newsletters/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchNewsletters();
        } else {
          const data = await res.json();
          alert(data.error || 'हटाने में विफल');
        }
      } catch {
        alert('त्रुटि हुई');
      }
    }
  };

  const viewSubscribers = async () => {
    setIsSubscribersModalOpen(true);
    setLoadingSubs(true);
    try {
      const res = await fetch('/api/admin/newsletters/subscribers');
      const data = await res.json();
      setSubscribers(data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSubs(false);
    }
  };

  const isOwner = currentUser?.role === 'owner';

  const filteredNewsletters = newsletters.filter((item) => {
    const matchesSearch = item.subject?.toLowerCase().includes(search.toLowerCase()) ||
                          item.previewText?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'published' ? item.status === 'sent' : item.status === 'draft');
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 font-sans">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 border border-neutral-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-l-4 border-l-red-600">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider mb-1.5 font-sans">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span className="text-neutral-900 font-black tracking-tight font-sans">
              CENTRAL <span className="text-red-600">LENS</span> <span className="text-neutral-600 font-semibold font-devanagari ml-1">न्यूज़लेटर डेस्क</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-neutral-900 font-devanagari">
            न्यूज़लेटर प्रबंधन (Newsletters Desk)
          </h1>
          <p className="text-neutral-500 text-xs sm:text-sm mt-1 max-w-xl font-devanagari">
            {isOwner 
              ? 'ओनर मोड: आप सभी एडमिन्स द्वारा बनाए गए न्यूज़लेटर देख सकते हैं, संपादित कर सकते हैं और भेज सकते हैं।'
              : 'एडमिन मोड: आप केवल अपने द्वारा बनाए गए न्यूज़लेटर देख और प्रबंधित कर सकते हैं।'}
          </p>
        </div>

        <div className="flex items-center space-x-2.5 sm:space-x-3 w-full md:w-auto">
          <button
            onClick={openNewModal}
            className="flex-1 md:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm transition active:scale-98 font-devanagari cursor-pointer"
          >
            <Plus size={16} />
            <span>नया न्यूज़लेटर लिखें</span>
          </button>
          <button
            onClick={viewSubscribers}
            className="flex-1 md:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold border border-neutral-200 transition font-devanagari cursor-pointer"
          >
            <Users size={15} />
            <span>सब्सक्राइबर्स ({subscribersCount})</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-2xs border-t-4 border-t-red-600">
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">कुल न्यूज़लेटर</span>
          <span className="text-2xl sm:text-3xl font-black text-neutral-900 mt-1 block">
            {newsletters.length}
          </span>
          <span className="text-[10px] text-neutral-400 mt-0.5 block">{isOwner ? 'सभी एडमिन्स' : 'केवल आपके द्वारा'}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-2xs border-t-4 border-t-emerald-600">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">भेजे गए (Sent)</span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-800 mt-1 block">
            {newsletters.filter(n => n.status === 'sent').length}
          </span>
          <span className="text-[10px] text-emerald-600 mt-0.5 block">सफलतापूर्वक प्रसारित</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-2xs border-t-4 border-t-amber-500">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">ड्राफ्ट्स (Drafts)</span>
          <span className="text-2xl sm:text-3xl font-black text-amber-800 mt-1 block">
            {newsletters.filter(n => n.status === 'draft').length}
          </span>
          <span className="text-[10px] text-amber-600 mt-0.5 block">अप्रकाशित संकलन</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-2xs border-t-4 border-t-neutral-900">
          <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider block">सक्रिय पाठक (Readers)</span>
          <span className="text-2xl sm:text-3xl font-black text-neutral-900 mt-1 block">
            {subscribersCount}
          </span>
          <span className="text-[10px] text-neutral-400 mt-0.5 block">ईमेल सब्सक्राइबर्स</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="विषय या सामग्री खोजें..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 focus:bg-white text-xs text-neutral-800 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition font-devanagari"
          />
        </div>

        <div className="flex items-center space-x-2">
          {(['all', 'published', 'draft'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition font-devanagari ${
                statusFilter === s
                  ? 'bg-red-600 text-white shadow-2xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {s === 'all' ? 'सभी' : s === 'published' ? 'भेजे गए' : 'ड्राफ्ट'}
            </button>
          ))}
        </div>
      </div>

      {/* Newsletters List */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-neutral-400 text-xs font-devanagari">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            न्यूज़लेटर लोड हो रहे हैं...
          </div>
        ) : filteredNewsletters.length === 0 ? (
          <div className="py-16 text-center text-neutral-400 text-xs font-devanagari">
            कोई न्यूज़लेटर नहीं मिला। ऊपर दिए गए बटन से नया न्यूज़लेटर लिखें।
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {filteredNewsletters.map((item) => (
              <div key={item._id} className="p-4 sm:p-5 hover:bg-neutral-50/60 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'sent' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'sent' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                      <span>{item.status === 'sent' ? 'प्रसारित' : 'ड्राफ्ट'}</span>
                    </span>

                    {/* Show creator info to owner */}
                    {isOwner && item.createdBy && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-neutral-100 text-neutral-700">
                        <span>लेखक: {item.createdBy.name}</span>
                        <span className="text-neutral-400">({item.createdBy.role})</span>
                      </span>
                    )}

                    <span className="text-[11px] text-neutral-400 font-sans flex items-center space-x-1">
                      <Calendar size={12} />
                      <span>{new Date(item.createdAt).toLocaleDateString('hi-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-neutral-900 font-devanagari">
                    {item.subject}
                  </h3>

                  {item.previewText && (
                    <p className="text-xs text-neutral-500 line-clamp-2 font-devanagari">
                      {item.previewText}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 self-end md:self-center flex-shrink-0">
                  <button
                    onClick={() => openEditModal(item)}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition font-devanagari cursor-pointer"
                  >
                    <Edit3 size={14} />
                    <span>संपादित करें</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition cursor-pointer"
                    title="हटाएं"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Compose / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-2xs overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl border border-neutral-200 shadow-2xl p-5 sm:p-7 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="text-base sm:text-lg font-black text-neutral-900 font-devanagari">
                {editingItem ? 'न्यूज़लेटर संपादित करें' : 'नया न्यूज़लेटर लिखें'}
              </h2>
              <button onClick={closeModal} className="text-neutral-400 hover:text-neutral-700 p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-devanagari">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  विषय / शीर्षक (Subject) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा: आज की 10 बड़ी खबरें | सेंट्रल लेंस वीकली"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs text-neutral-800 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  संक्षिप्त पूर्वावलोकन (Preview Excerpt)
                </label>
                <input
                  type="text"
                  placeholder="ईमेल इनबॉक्स में दिखने वाला संक्षिप्त विवरण"
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs text-neutral-800 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  मुख्य संदेश (Body Content) *
                </label>
                <textarea
                  required
                  rows={8}
                  placeholder="यहाँ न्यूज़लेटर की विस्तृत सामग्री लिखें..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs text-neutral-800 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-red-600 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">स्थिति (Status)</label>
                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-2 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={status === 'draft'}
                      onChange={() => setStatus('draft')}
                      className="text-red-600"
                    />
                    <span>ड्राफ्ट (Draft)</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={status === 'sent'}
                      onChange={() => setStatus('sent')}
                      className="text-red-600"
                    />
                    <span>प्रसारित (Sent/Published)</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-100 rounded-xl"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm transition disabled:opacity-50"
                >
                  {submitting ? 'सहेज रहे हैं...' : editingItem ? 'अपडेट करें' : 'न्यूज़लेटर सहेजें'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subscribers Modal */}
      {isSubscribersModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-2xs overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-xl border border-neutral-200 shadow-2xl p-5 sm:p-7 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center space-x-2">
                <Users size={18} className="text-red-600" />
                <h2 className="text-base font-black text-neutral-900 font-devanagari">
                  ईमेल सब्सक्राइबर्स सूची ({subscribers.length})
                </h2>
              </div>
              <button onClick={() => setIsSubscribersModalOpen(false)} className="text-neutral-400 hover:text-neutral-700 p-1">
                <X size={20} />
              </button>
            </div>

            {loadingSubs ? (
              <div className="py-8 text-center text-xs text-neutral-400">लोड हो रहा है...</div>
            ) : subscribers.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-400 font-devanagari">कोई सब्सक्राइबर नहीं मिला।</div>
            ) : (
              <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100 text-xs">
                {subscribers.map((s) => (
                  <div key={s._id} className="py-2.5 flex items-center justify-between">
                    <span className="font-mono text-neutral-800">{s.email}</span>
                    <span className="text-[10px] text-neutral-400 font-sans">
                      {new Date(s.subscribedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
