'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Home, 
  FileText, 
  LayoutDashboard, 
  Video, 
  LogOut, 
  Grid, 
  ExternalLink, 
  Menu, 
  X,
  Plus,
  ShieldCheck,
  Mail,
  Users,
  Crown,
  Shield
} from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) setAdminUser(data.user);
      })
      .catch(() => {});
  }, []);

  // Auto-close mobile sidebar when pathname changes
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  // Handle escape key to close mobile sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileSidebarOpen) {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileSidebarOpen]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileSidebarOpen]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isOwner = adminUser?.role === 'owner';

  const navItems = [
    { label: 'डैशबोर्ड (Dashboard)', href: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'लेख प्रबंधन (Articles)', href: '/admin/articles', icon: FileText, exact: false },
    { label: 'न्यूज़लेटर (Newsletter)', href: '/admin/newsletters', icon: Mail, exact: false },
    { label: 'राज्य (States)', href: '/admin/categories', icon: Grid, exact: false },
    { label: 'वीडियो (Videos)', href: '/admin/videos', icon: Video, exact: false },
  ];

  // Map route segment to Hindi/English title
  const currentSection = pathname.split('/')[2];
  const sectionTitleMap: Record<string, string> = {
    articles: 'लेख',
    categories: 'राज्य',
    videos: 'वीडियो',
    newsletters: 'न्यूज़लेटर',
    users: 'भूमिका व सदस्य',
  };
  const sectionTitle = currentSection ? (sectionTitleMap[currentSection] || currentSection) : 'डैशबोर्ड';

  return (
    <div className="flex h-screen bg-neutral-50 font-sans overflow-hidden">
      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-2xs z-40 md:hidden transition-opacity duration-300"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Admin Sidebar (White & Red Central Lens Theme) */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white text-neutral-800 flex flex-col transition-transform duration-300 ease-in-out border-r border-neutral-200/80 shadow-lg md:shadow-xs ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between">
          <Link href="/admin" className="flex items-center space-x-3 group">
            <img 
              src="https://res.cloudinary.com/idhgjmqi/image/upload/v1789294779/Central_Lens_Logo_Transparent_1.png" 
              alt="Central Lens" 
              className="h-9 w-9 sm:h-10 sm:w-10 object-contain transform group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black text-neutral-900 tracking-tight leading-none font-sans">
                CENTRAL <span className="text-red-600 group-hover:text-red-700 transition-colors">LENS</span>
              </span>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1 font-sans flex items-center space-x-1">
                <span>Admin Newsroom</span>
                {isOwner && <Crown size={11} className="text-amber-500 fill-amber-500" />}
              </span>
            </div>
          </Link>
          <button 
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="क्लोज़ साइडबार"
            className="md:hidden p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="px-4 pt-4 sm:pt-5 pb-2">
          <Link
            href="/admin/articles/new"
            onClick={() => setMobileSidebarOpen(false)}
            className="flex items-center justify-center space-x-2 w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-sm transition-all font-devanagari"
          >
            <Plus size={16} />
            <span>नया लेख लिखें</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-sans">
            कंटेंट प्रबंधन
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact 
              ? pathname === item.href 
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all font-devanagari ${
                  isActive 
                    ? 'bg-red-600 text-white shadow-sm' 
                    : 'text-neutral-600 hover:text-red-600 hover:bg-red-50/60'
                }`}
              >
                <Icon size={17} className={isActive ? 'text-white' : 'text-neutral-500'} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Owner-Exclusive Role Management Section */}
          {isOwner && (
            <>
              <div className="pt-4 px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-600 font-sans flex items-center space-x-1">
                <Crown size={12} className="text-amber-500 fill-amber-500" />
                <span>ओनर कंट्रोल (Owner Controls)</span>
              </div>
              <Link
                href="/admin/users"
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all font-devanagari ${
                  pathname.startsWith('/admin/users')
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-amber-900 bg-amber-50/70 hover:bg-amber-100/80 hover:text-amber-900 border border-amber-200/70'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Users size={17} className={pathname.startsWith('/admin/users') ? 'text-white' : 'text-amber-600'} />
                  <span>भूमिका प्रबंधन (Roles & Users)</span>
                </div>
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                  pathname.startsWith('/admin/users') ? 'bg-white/20 text-white' : 'bg-amber-200/80 text-amber-800'
                }`}>
                  PRO
                </span>
              </Link>
            </>
          )}

          <div className="pt-4 sm:pt-6 px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-sans">
            लाइव पोर्टल
          </div>
          <Link 
            href="/" 
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-neutral-600 hover:text-red-600 hover:bg-red-50/60 transition-colors font-devanagari"
          >
            <div className="flex items-center space-x-3">
              <Home size={17} className="text-neutral-500" />
              <span>वेबसाइट देखें (Live Site)</span>
            </div>
            <ExternalLink size={14} className="text-neutral-400" />
          </Link>
        </nav>

        {/* User & Logout Footer */}
        <div className="p-3.5 sm:p-4 border-t border-neutral-100 bg-neutral-50/70">
          <div className="flex items-center space-x-3 mb-2.5 px-1.5">
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full text-white flex items-center justify-center font-black text-xs uppercase flex-shrink-0 ${
              isOwner ? 'bg-gradient-to-br from-amber-500 to-red-600 ring-2 ring-amber-300' : 'bg-red-600'
            }`}>
              {adminUser?.name ? adminUser.name.charAt(0) : 'CL'}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <span className="text-xs font-bold text-neutral-900 block truncate flex items-center space-x-1 font-devanagari">
                <span className="truncate">{adminUser?.name || 'एडमिन डेस्क'}</span>
                {isOwner ? (
                  <Crown size={13} className="text-amber-500 fill-amber-500 flex-shrink-0" />
                ) : (
                  <ShieldCheck size={13} className="text-blue-600 flex-shrink-0" />
                )}
              </span>
              <div className="flex items-center space-x-1.5 mt-0.5 min-w-0">
                <span className={`inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider whitespace-nowrap flex-shrink-0 ${
                  isOwner 
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold' 
                    : 'bg-neutral-200 text-neutral-700 font-medium'
                }`}>
                  <span>{isOwner ? '👑' : adminUser?.role === 'admin' ? '🛡️' : '✏️'}</span>
                  <span>{isOwner ? 'OWNER' : adminUser?.role === 'admin' ? 'ADMIN' : 'EDITOR'}</span>
                </span>
                <span className="text-[10px] text-neutral-400 truncate font-mono">
                  {adminUser?.email}
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center space-x-2 p-2 w-full hover:bg-red-50 text-neutral-500 hover:text-red-600 rounded-xl text-xs font-bold transition-colors font-devanagari cursor-pointer"
          >
            <LogOut size={15} />
            <span>लॉग आउट (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-14 sm:h-16 bg-white border-b border-neutral-200/80 px-3.5 sm:px-6 flex items-center justify-between shadow-xs z-10">
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="ओपन मेनू"
              className="md:hidden text-neutral-600 hover:text-neutral-900 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors flex-shrink-0"
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs text-neutral-500 min-w-0">
              <span className="font-bold text-neutral-900 font-sans tracking-tight truncate">
                <span className="hidden sm:inline">CENTRAL </span><span className="text-red-600">LENS</span> <span className="text-neutral-400 font-semibold text-[11px] uppercase tracking-wider ml-0.5">Admin</span>
              </span>
              <span>/</span>
              <span className="font-semibold text-neutral-800 capitalize truncate font-devanagari">
                {sectionTitle}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {isOwner && (
              <span className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-800 border border-amber-300">
                <Crown size={12} className="text-amber-500 fill-amber-500" />
                <span>ओनर मोड (Full Access)</span>
              </span>
            )}
            <Link
              href="/"
              target="_blank"
              title="लाइव साइट देखें"
              className="flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-red-50 hover:text-red-600 transition"
            >
              <span className="hidden xs:inline">लाइव साइट</span>
              <span className="xs:hidden">साइट</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8 bg-neutral-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}
