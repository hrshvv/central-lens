'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Crown, 
  ShieldCheck, 
  Shield, 
  BookOpen, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  FileText, 
  Video, 
  Calendar,
  UserCheck,
  ChevronDown
} from 'lucide-react';

interface UserRecord {
  _id: string;
  name: string;
  email: string;
  role: 'reader' | 'editor' | 'admin' | 'owner';
  avatar?: string;
  createdAt: string;
  articlesCount: number;
  videosCount: number;
}

export default function AdminUsersManagement() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'owner' | 'admin' | 'editor' | 'reader'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [counts, setCounts] = useState({ owners: 0, admins: 0, editors: 0, readers: 0 });

  // 1. Fetch current logged-in user to ensure owner status
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) {
          setCurrentUser(data.user);
          if (data.user.role !== 'owner') {
            // Non-owner redirected away
            router.replace('/admin');
          }
        } else {
          router.replace('/login');
        }
      })
      .catch(() => router.replace('/admin'));
  }, [router]);

  // 2. Fetch users list
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (roleFilter !== 'all') params.set('role', roleFilter);
      params.set('limit', '100');

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      if (res.status === 403) {
        setMessage({ type: 'error', text: 'केवल ओनर (Owner) ही भूमिकाओं का प्रबंधन कर सकते हैं।' });
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (data.data) {
        setUsers(data.data);
        if (data.meta?.counts) {
          setCounts(data.meta.counts);
        }
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'उपयोगकर्ताओं को लोड करने में असमर्थ।' });
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => {
    if (currentUser?.role === 'owner') {
      fetchUsers();
    }
  }, [fetchUsers, currentUser]);

  // 3. Update user role
  const handleRoleChange = async (userId: string, newRole: string, userName: string) => {
    if (!confirm(`क्या आप ${userName} की भूमिका को बदलकर '${newRole.toUpperCase()}' करना चाहते हैं?`)) {
      return;
    }

    setUpdatingId(userId);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ 
          type: 'success', 
          text: data.message || `सफलता पूर्वक भूमिका '${newRole}' में बदल दी गई!` 
        });
        // Update locally
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole as any } : u));
        fetchUsers();
      } else {
        setMessage({ type: 'error', text: data.error || 'भूमिका बदलने में त्रुटि हुई।' });
      }
    } catch {
      setMessage({ type: 'error', text: 'सर्वर से संपर्क करने में समस्या आई।' });
    } finally {
      setUpdatingId(null);
    }
  };

  const roleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
            <Crown size={12} className="text-amber-600 fill-amber-500" />
            <span>ओनर (Owner)</span>
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <ShieldCheck size={12} className="text-blue-600" />
            <span>एडमिन (Admin)</span>
          </span>
        );
      case 'editor':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span>संपादक (Editor)</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700 border border-neutral-200">
            <BookOpen size={12} className="text-neutral-500" />
            <span>पाठक (Reader)</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 font-sans">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-red-50 rounded-2xl p-4 sm:p-6 lg:p-8 border border-amber-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-l-4 border-l-amber-500">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider mb-1.5 font-sans">
            <Crown size={15} className="text-amber-600 fill-amber-500" />
            <span className="text-amber-900 font-black tracking-tight">
              ओनर विशेषाधिकार (Owner Privilege)
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-neutral-900 font-devanagari">
            भूमिका व सदस्य प्रबंधन (Role & Team Management)
          </h1>
          <p className="text-neutral-600 text-xs sm:text-sm mt-1 max-w-2xl font-devanagari">
            यहाँ से आप पोर्टल के सभी पाठकों एवं एडमिन्स की भूमिकाएं नियंत्रित कर सकते हैं। केवल ओनर ही किसी सदस्य को एडमिन बना सकते हैं या भूमिका बदल सकते हैं।
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-bold rounded-xl border border-neutral-200 transition shadow-2xs cursor-pointer font-devanagari"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>रिफ्रेश सूची</span>
        </button>
      </div>

      {/* Alert Message */}
      {message && (
        <div className={`p-4 rounded-xl text-xs sm:text-sm font-devanagari flex items-center justify-between ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            <span>{message.text}</span>
          </div>
          <button 
            onClick={() => setMessage(null)}
            className="text-neutral-400 hover:text-neutral-900 text-xs font-bold px-2 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs">
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">कुल सदस्य</span>
          <span className="text-2xl sm:text-3xl font-black text-neutral-900 mt-1 block">
            {users.length}
          </span>
          <span className="text-[10px] text-neutral-400 mt-0.5 block">पंजीकृत उपयोगकर्ता</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs border-t-4 border-t-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">ओनर (Owners)</span>
            <Crown size={15} className="text-amber-500 fill-amber-500" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-amber-900 mt-1 block">
            {counts.owners}
          </span>
          <span className="text-[10px] text-amber-600 mt-0.5 block">पूर्ण नियंत्रण धारक</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-2xs border-t-4 border-t-blue-600">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">एडमिन (Admins)</span>
            <ShieldCheck size={15} className="text-blue-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-blue-900 mt-1 block">
            {counts.admins}
          </span>
          <span className="text-[10px] text-blue-500 mt-0.5 block">स्वयं का कंटेंट नियंत्रक</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs border-t-4 border-t-neutral-400">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider">पाठक (Readers)</span>
            <BookOpen size={15} className="text-neutral-500" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-neutral-900 mt-1 block">
            {counts.readers}
          </span>
          <span className="text-[10px] text-neutral-400 mt-0.5 block">सार्वजनिक पाठक</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="नाम या ईमेल से खोजें..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 focus:bg-white text-xs text-neutral-800 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition font-devanagari"
          />
        </div>

        {/* Role Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {(['all', 'owner', 'admin', 'editor', 'reader'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize font-devanagari ${
                roleFilter === r
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {r === 'all' ? 'सभी' : r === 'owner' ? 'ओनर' : r === 'admin' ? 'एडमिन' : r === 'editor' ? 'संपादक' : 'पाठक'}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table / List */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-neutral-400 text-xs font-devanagari">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            सदस्यों की सूची लोड हो रही है...
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-neutral-400 text-xs font-devanagari">
            कोई सदस्य नहीं मिला।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="bg-neutral-50/80 text-neutral-500 text-xs uppercase tracking-wider border-b border-neutral-100">
                  <th className="py-4 px-6 font-bold">सदस्य (User)</th>
                  <th className="py-4 px-6 font-bold">वर्तमान भूमिका (Current Role)</th>
                  <th className="py-4 px-6 font-bold">कंटेंट योगदान</th>
                  <th className="py-4 px-6 font-bold">पंजीकरण दिनांक</th>
                  <th className="py-4 px-6 font-bold text-right">भूमिका बदलें (Change Role)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-sm">
                {users.map((u) => {
                  const isCurrent = currentUser?.id === u._id;
                  return (
                    <tr key={u._id} className="hover:bg-neutral-50/60 transition-colors">
                      {/* User Info */}
                      <td className="py-4 px-6 max-w-xs">
                        <div className="flex items-center space-x-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs uppercase flex-shrink-0 text-white ${
                            u.role === 'owner' 
                              ? 'bg-gradient-to-br from-amber-500 to-red-600 ring-2 ring-amber-300' 
                              : u.role === 'admin' 
                              ? 'bg-blue-600' 
                              : 'bg-neutral-600'
                          }`}>
                            {u.name ? u.name.charAt(0) : 'U'}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-neutral-900 block truncate font-devanagari text-xs sm:text-sm">
                              {u.name} {isCurrent && <span className="text-[10px] text-amber-600 font-bold ml-1">(आप / You)</span>}
                            </span>
                            <span className="text-[11px] text-neutral-400 block truncate font-mono">
                              {u.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Current Role Badge */}
                      <td className="py-4 px-6">
                        {roleBadge(u.role)}
                      </td>

                      {/* Contributions */}
                      <td className="py-4 px-6 text-xs text-neutral-600">
                        <div className="flex items-center space-x-3">
                          <span className="inline-flex items-center space-x-1" title="कुल लेख">
                            <FileText size={13} className="text-neutral-400" />
                            <span className="font-bold">{u.articlesCount || 0} लेख</span>
                          </span>
                          <span className="inline-flex items-center space-x-1" title="कुल वीडियो">
                            <Video size={13} className="text-neutral-400" />
                            <span className="font-bold">{u.videosCount || 0} वीडियो</span>
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 text-xs text-neutral-500 font-sans">
                        {new Date(u.createdAt).toLocaleDateString('hi-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Change Role Selector */}
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center space-x-2">
                          <select
                            value={u.role}
                            disabled={updatingId === u._id}
                            onChange={(e) => handleRoleChange(u._id, e.target.value, u.name)}
                            className="bg-neutral-50 hover:bg-neutral-100 text-neutral-900 font-bold text-xs py-1.5 px-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer font-devanagari transition"
                          >
                            <option value="owner">👑 ओनर (Owner)</option>
                            <option value="admin">🛡️ एडमिन (Admin)</option>
                            <option value="editor">✏️ संपादक (Editor)</option>
                            <option value="reader">📖 पाठक (Reader)</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
