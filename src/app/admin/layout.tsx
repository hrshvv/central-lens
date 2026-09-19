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
  ShieldCheck
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

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { label: 'डैशबोर्ड (Dashboard)', href: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'लेख प्रबंधन (Articles)', href: '/admin/articles', icon: FileText, exact: false },
    { label: 'कैटेगरी (Categories)', href: '/admin/categories', icon: Grid, exact: false },
    { label: 'वीडियो (Videos)', href: '/admin/videos', icon: Video, exact: false },
  ];

  return (
    <div className="flex h-screen bg-neutral-50 font-sans overflow-hidden">
      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar (White & Red Central Lens Theme) */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white text-neutral-800 flex flex-col transition-transform duration-300 ease-in-out border-r border-neutral-200/80 shadow-xs ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <Link href="/admin" className="flex items-center space-x-3 group">
            <img 
              src="https://res.cloudinary.com/idhgjmqi/image/upload/v1789294779/Central_Lens_Logo_Transparent_1.png" 
              alt="Central Lens" 
              className="h-10 w-10 object-contain transform group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="text-xl font-black text-red-600 tracking-tighter leading-none">
                CENTRAL LENS
              </span>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">
                Admin Newsroom
              </span>
            </div>
          </Link>
          <button 
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden text-neutral-500 hover:text-neutral-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="px-4 pt-5 pb-2">
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
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-sans">
            नेविगेशन
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

          <div className="pt-6 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-sans">
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
        <div className="p-4 border-t border-neutral-100 bg-neutral-50/70">
          <div className="flex items-center space-x-3 mb-3 px-2">
            <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-xs uppercase">
              {adminUser?.name ? adminUser.name.charAt(0) : 'CL'}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <span className="text-xs font-bold text-neutral-900 block truncate flex items-center space-x-1 font-devanagari">
                <span>{adminUser?.name || 'एडमिन डेस्क'}</span>
                <ShieldCheck size={13} className="text-blue-600 flex-shrink-0" />
              </span>
              <span className="text-[10px] text-neutral-400 block truncate">
                {adminUser?.email || 'admin@centrallens.in'}
              </span>
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
        <header className="h-16 bg-white border-b border-neutral-200/80 px-6 flex items-center justify-between shadow-xs z-10">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden text-neutral-600 hover:text-neutral-900 p-1.5 rounded-lg hover:bg-neutral-100"
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center space-x-2 text-xs text-neutral-500">
              <span className="font-bold text-red-600 font-devanagari">Central Lens Admin</span>
              <span>/</span>
              <span className="font-semibold text-neutral-800 capitalize">
                {pathname.split('/')[2] || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-red-50 hover:text-red-600 transition"
            >
              <span>लाइव साइट देखें</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-neutral-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}
