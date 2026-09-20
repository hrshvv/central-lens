'use client';

import Link from 'next/link';
import { 
  Search, Menu, User, X, Home, ChevronRight, Calendar, MapPin, TrendingUp,
  LogIn, UserPlus, Landmark, Cpu, Trophy, Film, Globe, Car, Sparkles, Shield, Tv,
  ChevronDown, LogOut, LayoutDashboard, PlusCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface NavCategory {
  name: string;
  slug: string;
}

const CATEGORY_META: Record<string, { en: string; icon: React.ComponentType<{ size?: number; className?: string }>; color: string; bg: string }> = {
  politics: { en: 'Politics', icon: Landmark, color: 'text-blue-600', bg: 'bg-blue-50' },
  sports: { en: 'Sports', icon: Trophy, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  technology: { en: 'Tech', icon: Cpu, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  entertainment: { en: 'Entertainment', icon: Film, color: 'text-pink-600', bg: 'bg-pink-50' },
  business: { en: 'Business', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
  national: { en: 'National', icon: MapPin, color: 'text-red-600', bg: 'bg-red-50' },
  world: { en: 'World', icon: Globe, color: 'text-violet-600', bg: 'bg-violet-50' },
  auto: { en: 'Auto', icon: Car, color: 'text-slate-600', bg: 'bg-slate-50' },
  lifestyle: { en: 'Lifestyle', icon: Sparkles, color: 'text-teal-600', bg: 'bg-teal-50' },
};

const DEFAULT_CATEGORIES: NavCategory[] = [
  { name: 'राजनीति', slug: 'politics' },
  { name: 'खेल', slug: 'sports' },
  { name: 'टेक्नोलॉजी', slug: 'technology' },
  { name: 'मनोरंजन', slug: 'entertainment' },
  { name: 'बिज़नेस', slug: 'business' },
  { name: 'देश', slug: 'national' },
  { name: 'विदेश', slug: 'world' },
  { name: 'ऑटो', slug: 'auto' },
  { name: 'लाइफस्टाइल', slug: 'lifestyle' },
];

interface BreakingItem {
  title: string;
  slug?: string;
  categorySlug?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [breakingNews, setBreakingNews] = useState<BreakingItem[]>([]);
  const [categories, setCategories] = useState<NavCategory[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  // Fetch current user session
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => setCurrentUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setCurrentUser(null);
      setIsUserMenuOpen(false);
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    // Current date in Hindi
    try {
      const now = new Date();
      const formatted = now.toLocaleDateString('hi-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      setCurrentDate(formatted);
    } catch {
      setCurrentDate('आज का मुख्य समाचार');
    }

    // Fetch categories
    fetch('/api/articles/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      })
      .catch(() => {});

    // Fetch breaking news
    fetch('/api/articles/breaking')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setBreakingNews(data.map((a: any) => ({
            title: a.title,
            slug: a.slug,
            categorySlug: a.category?.slug || 'national',
          })));
        } else {
          // Fallback to recent articles
          fetch('/api/articles?limit=5')
            .then(res => res.json())
            .then(articles => {
              if (Array.isArray(articles) && articles.length > 0) {
                setBreakingNews(articles.map((a: any) => ({
                  title: a.title,
                  slug: a.slug,
                  categorySlug: a.category?.slug || 'news',
                })));
              } else {
                setBreakingNews([{ title: 'Central Lens - निष्पक्ष और सटीक पत्रकारिता' }]);
              }
            })
            .catch(() => setBreakingNews([{ title: 'Central Lens - निष्पक्ष और सटीक पत्रकारिता' }]));
        }
      })
      .catch(() => setBreakingNews([{ title: 'Central Lens - निष्पक्ष और सटीक पत्रकारिता' }]));
  }, []);

  const displayCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
        {/* Top Edition & Date Bar (Desktop) */}
        <div className="hidden md:block bg-neutral-50 text-neutral-600 text-[11px] py-1.5 px-4 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center font-sans tracking-wide">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5 text-neutral-700 font-medium">
              <Calendar size={13} className="text-red-600 flex-shrink-0" />
              <span>{currentDate || 'आज का समाचार'}</span>
            </span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center space-x-1 text-neutral-500">
              <MapPin size={13} className="text-red-600 flex-shrink-0" />
              <span>नई दिल्ली • राष्ट्रीय संस्करण</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/about" className="hover:text-red-600 transition-colors text-neutral-600">हमारे बारे में</Link>
            <span className="text-neutral-300">•</span>
            <Link href="/contact" className="hover:text-red-600 transition-colors text-neutral-600">संपर्क करें</Link>
          </div>
        </div>
      </div>

      {/* Main Brand & Action Bar */}
      <div className="flex justify-between items-center px-4 sm:px-6 py-3.5 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3.5">
          <button 
            onClick={() => setIsMenuOpen(true)} 
            className="md:hidden text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-100 active:scale-95 transition"
            aria-label="Open navigation menu"
          >
            <Menu size={24} />
          </button>
          
          <Link href="/" className="flex items-center space-x-3 group">
            <img 
              src="https://res.cloudinary.com/idhgjmqi/image/upload/v1789294779/Central_Lens_Logo_Transparent_1.png" 
              alt="Central Lens Logo" 
              className="h-10 w-10 sm:h-11 sm:w-11 object-contain transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight leading-none font-sans">
                CENTRAL <span className="text-red-600 group-hover:text-red-700 transition-colors">LENS</span>
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-neutral-500 tracking-normal font-devanagari mt-1 leading-tight">
                सत्य, सटीकता और निष्पक्ष पत्रकारिता
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <Link 
            href="/videos" 
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border transition font-bold text-xs shadow-2xs group ${
              pathname.startsWith('/videos') || pathname.startsWith('/video')
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200'
            }`}
            aria-label="Videos"
          >
            <Tv size={15} className={`group-hover:scale-110 transition-transform ${
              pathname.startsWith('/videos') || pathname.startsWith('/video') ? 'text-white' : 'text-red-600'
            }`} />
            <span className="font-devanagari">वीडियो</span>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
              pathname.startsWith('/videos') || pathname.startsWith('/video') ? 'bg-white' : 'bg-red-600'
            }`} />
          </Link>

          <Link 
            href="/search" 
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border transition font-bold text-xs shadow-2xs group ${
              pathname === '/search'
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200'
            }`}
            aria-label="Search articles"
          >
            <Search size={14} className={`group-hover:scale-110 transition-transform ${
              pathname === '/search' ? 'text-white' : 'text-red-600'
            }`} />
            <span className="font-devanagari">खोजें</span>
          </Link>
          
          {/* User Auth Section */}
          {currentUser ? (
            <div className="relative">
              <div className="flex items-center space-x-2">
                {(currentUser.role === 'admin' || currentUser.role === 'editor') && (
                  <Link
                    href="/admin"
                    className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-full text-xs font-bold border border-red-200/80 shadow-2xs transition"
                  >
                    <Shield size={13} className="text-red-600" />
                    <span>डैशबोर्ड</span>
                  </Link>
                )}

                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-full transition text-xs font-bold border border-neutral-200 cursor-pointer"
                  aria-label="User profile menu"
                >
                  <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-black uppercase">
                    {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                  </div>
                  <span className="max-w-[80px] sm:max-w-[120px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={12} className="text-neutral-500" />
                </button>
              </div>

              {/* Profile Dropdown Menu */}
              {isUserMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsUserMenuOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-neutral-200/90 py-2 z-50 text-xs font-sans">
                    <div className="px-4 py-2 border-b border-neutral-100">
                      <p className="font-bold text-neutral-900 truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-neutral-400 truncate mt-0.5">{currentUser.email}</p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 uppercase tracking-wider">
                        {currentUser.role === 'admin' ? 'एडमिन (Admin)' : currentUser.role === 'editor' ? 'संपादक (Editor)' : 'पाठक (Reader)'}
                      </span>
                    </div>

                    {(currentUser.role === 'admin' || currentUser.role === 'editor') && (
                      <div className="py-1 border-b border-neutral-100 font-devanagari">
                        <Link
                          href="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-neutral-700 hover:bg-neutral-50 hover:text-red-600 font-semibold transition"
                        >
                          <LayoutDashboard size={14} className="text-neutral-400" />
                          <span>एडमिन डैशबोर्ड</span>
                        </Link>
                        <Link
                          href="/admin/articles/new"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-neutral-700 hover:bg-neutral-50 hover:text-red-600 font-semibold transition"
                        >
                          <PlusCircle size={14} className="text-neutral-400" />
                          <span>नया लेख प्रकाशित करें</span>
                        </Link>
                      </div>
                    )}

                    <div className="pt-1 font-devanagari">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 font-bold transition text-left cursor-pointer"
                      >
                        <LogOut size={14} />
                        <span>लॉग आउट (Logout)</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link 
              href="/login" 
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-neutral-100 hover:bg-red-600 hover:text-white text-neutral-800 rounded-full transition text-xs font-semibold shadow-2xs border border-neutral-200 hover:border-red-600" 
              aria-label="Account"
            >
              <User size={14} />
              <span className="hidden sm:inline">लॉगिन / अकाउंट</span>
            </Link>
          )}
        </div>
      </div>

      {/* Desktop Category Navigation */}
      <nav className="hidden md:flex overflow-x-auto whitespace-nowrap bg-neutral-50/80 border-t border-neutral-100 px-4 max-w-7xl mx-auto space-x-1 scrollbar-hide font-devanagari">
        <Link 
          href="/" 
          className={`text-sm font-bold px-3.5 py-2.5 transition-colors border-b-2 ${
            pathname === '/' 
              ? 'text-red-600 border-red-600 bg-white' 
              : 'text-neutral-700 hover:text-red-600 border-transparent hover:border-red-400'
          }`}
        >
          होम
        </Link>
        {displayCategories.map(cat => {
          const isActive = pathname === `/${cat.slug}`;
          return (
            <Link 
              key={cat.slug} 
              href={`/${cat.slug}`} 
              className={`text-sm font-bold px-3.5 py-2.5 transition-colors border-b-2 ${
                isActive 
                  ? 'text-red-600 border-red-600 bg-white' 
                  : 'text-neutral-700 hover:text-red-600 border-transparent hover:border-red-400'
              }`}
            >
              {cat.name}
            </Link>
          );
        })}
      </nav>

      {/* Editorial Ruby Broadcast Breaking News Ticker */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white border-y border-red-800/40 shadow-xs relative z-30 group overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-stretch h-10 px-4 sm:px-6">
          {/* Pulsing Live Pill Badge */}
          <div className="flex-shrink-0 flex items-center pr-3 z-20">
            <div className="bg-white text-red-700 px-3 sm:px-4 py-1 rounded-full flex items-center space-x-2 shadow-[0_2px_8px_rgba(0,0,0,0.18)] select-none">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-80"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              <span className="text-[11px] sm:text-xs tracking-wider uppercase whitespace-nowrap font-sans font-black flex items-center space-x-1.5 text-red-700">
                <span>BREAKING</span>
                <span className="hidden sm:inline font-devanagari font-bold text-red-600">| ताज़ा खबर</span>
              </span>
            </div>
          </div>

          {/* Scrolling Headlines with Hover Pause */}
          <div className="flex-1 overflow-hidden relative flex items-center px-4">
            <div className="whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused] flex space-x-10 font-devanagari text-xs sm:text-[13px] font-semibold tracking-wide">
              {/* Render items duplicated to maintain smooth looping */}
              {[...breakingNews, ...breakingNews].map((news, idx) => (
                <div key={idx} className="inline-flex items-center space-x-4">
                  {news.slug ? (
                    <Link
                      href={`/${news.categorySlug || 'news'}/${news.slug}`}
                      className="text-white hover:text-amber-200 hover:underline transition-colors"
                    >
                      {news.title}
                    </Link>
                  ) : (
                    <span className="text-white/95">{news.title}</span>
                  )}
                  <span className="text-amber-300 text-[10px] select-none font-sans drop-shadow-xs">◆</span>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Hover Hint */}
          <div className="hidden xl:flex items-center px-3.5 text-[11px] text-red-100/80 font-devanagari border-l border-red-500/50 select-none">
            रोकने के लिए माउस लाएं
          </div>
        </div>
      </div>
    </header>

    {/* Mobile Slide-out Drawer Backdrop */}
    {isMenuOpen && (
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[99] transition-opacity duration-300 md:hidden"
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />
    )}

    {/* Mobile Slide-out Drawer Panel */}
    <aside
      className={`fixed top-0 bottom-0 left-0 z-[100] w-80 max-w-[85vw] h-full h-dvh bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out md:hidden font-devanagari ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
      }`}
      aria-label="Mobile Navigation"
    >
      {/* Drawer Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 bg-neutral-50/80">
        <Link 
          href="/" 
          onClick={() => setIsMenuOpen(false)} 
          className="flex items-center space-x-2.5 group"
        >
          <img 
            src="https://res.cloudinary.com/idhgjmqi/image/upload/v1789294779/Central_Lens_Logo_Transparent_1.png" 
            alt="Central Lens Logo" 
            className="h-9 w-9 object-contain transform group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="text-xl font-black text-neutral-900 tracking-tight leading-none font-sans">
              CENTRAL <span className="text-red-600">LENS</span>
            </span>
            <span className="text-[10px] font-medium text-neutral-500 tracking-normal font-devanagari mt-0.5">
              सत्य, सटीकता और निष्पक्ष पत्रकारिता
            </span>
          </div>
        </Link>
        <button
          onClick={() => setIsMenuOpen(false)}
          className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/70 transition"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Search shortcut */}
      <div className="p-3.5 border-b border-neutral-100 bg-white">
        <Link
          href="/search"
          onClick={() => setIsMenuOpen(false)}
          className="flex items-center space-x-2.5 w-full px-3.5 py-2.5 text-sm text-neutral-500 bg-neutral-50 hover:bg-neutral-100 rounded-xl border border-neutral-200 transition group"
        >
          <Search size={16} className="text-neutral-400 group-hover:text-red-600 transition-colors" />
          <span className="text-xs font-sans">खबरें खोजें (Search)...</span>
        </Link>
      </div>

      {/* Categories List (Scrollable, full height) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {/* Top Quick Links: Home & Video */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl border font-sans transition ${
              pathname === '/'
                ? 'bg-red-50 text-red-600 border-red-200 font-bold shadow-2xs'
                : 'bg-white text-neutral-800 border-neutral-200 hover:bg-neutral-50 font-semibold'
            }`}
          >
            <Home size={16} className="text-red-600" />
            <span className="font-devanagari text-sm">होम</span>
          </Link>

          <Link
            href="/videos"
            onClick={() => setIsMenuOpen(false)}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl border font-sans transition ${
              pathname.startsWith('/videos') || pathname.startsWith('/video')
                ? 'bg-red-50 text-red-600 border-red-200 font-bold shadow-2xs'
                : 'bg-white text-neutral-800 border-neutral-200 hover:bg-neutral-50 font-semibold'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Tv size={16} className="text-red-600" />
              <span className="font-devanagari text-sm">वीडियो</span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
          </Link>
        </div>

        <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-3 pt-2 pb-1.5 font-sans flex items-center justify-between border-t border-neutral-100">
          <span>कैटेगरी (Categories)</span>
          <span className="text-[10px] text-neutral-400/80 font-normal">अनुभाग</span>
        </div>

        {/* Dynamic / Default Categories */}
        {displayCategories.map(cat => {
          const meta = CATEGORY_META[cat.slug.toLowerCase()] || {
            en: cat.slug,
            icon: ChevronRight,
            color: 'text-neutral-600',
            bg: 'bg-neutral-100',
          };
          const IconComp = meta.icon;
          const isActive = pathname === `/${cat.slug}`;

          return (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition font-sans ${
                isActive
                  ? 'bg-red-50 text-red-600 font-bold border-l-4 border-red-600 shadow-2xs'
                  : 'text-neutral-800 hover:bg-neutral-50 hover:text-red-600 font-semibold'
              }`}
            >
              <span className="flex items-center space-x-3">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.bg} ${meta.color}`}>
                  <IconComp size={16} />
                </span>
                <span className="flex items-baseline space-x-2">
                  <span className="font-devanagari text-[15px] font-bold">{cat.name}</span>
                  <span className="text-[11px] text-neutral-400 font-medium">{meta.en}</span>
                </span>
              </span>
              <ChevronRight size={16} className={isActive ? 'text-red-600' : 'text-neutral-300'} />
            </Link>
          );
        })}
      </div>

      {/* Drawer Footer: User Profile / Login & Signup Buttons */}
      <div className="p-4 border-t border-neutral-200/80 bg-neutral-50/95 space-y-2.5 font-sans">
        {currentUser ? (
          <div className="space-y-2.5">
            <div className="flex items-center space-x-3 p-2.5 bg-white rounded-xl border border-neutral-200 shadow-2xs">
              <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-sm uppercase">
                {currentUser.name ? currentUser.name.charAt(0) : 'U'}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-bold text-neutral-900 truncate">{currentUser.name}</p>
                <p className="text-[10px] text-neutral-400 truncate">{currentUser.email}</p>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-50 text-red-700 uppercase">
                  {currentUser.role === 'admin' ? 'एडमिन (Admin)' : currentUser.role === 'editor' ? 'संपादक (Editor)' : 'पाठक (Reader)'}
                </span>
              </div>
            </div>

            {(currentUser.role === 'admin' || currentUser.role === 'editor') && (
              <Link
                href="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center space-x-1.5 w-full py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold rounded-xl shadow-2xs transition font-devanagari"
              >
                <Shield size={14} className="text-red-600" />
                <span>एडमिन डैशबोर्ड (Admin CMS)</span>
              </Link>
            )}

            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center justify-center space-x-1.5 w-full py-2 px-3 bg-white hover:bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-200 transition font-devanagari cursor-pointer"
            >
              <LogOut size={14} />
              <span>लॉग आउट (Logout)</span>
            </button>
          </div>
        ) : (
          <>
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-0.5">
              खाता व एक्सेस (Account & Access)
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center space-x-1.5 py-2.5 px-3 bg-white hover:bg-neutral-100 active:scale-95 text-neutral-800 text-xs sm:text-sm font-bold rounded-xl border border-neutral-300 shadow-2xs transition"
              >
                <LogIn size={15} className="text-neutral-600" />
                <span>लॉग इन</span>
              </Link>

              <Link
                href="/register"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center space-x-1.5 py-2.5 px-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition"
              >
                <UserPlus size={15} />
                <span>साइन अप</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </aside>
  </>
);
}
