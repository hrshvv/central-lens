'use client';

import Link from 'next/link';
import { Search, Menu, User, X, Home, ChevronRight, Calendar, MapPin, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface NavCategory {
  name: string;
  slug: string;
}

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

export default function Navbar() {
  const pathname = usePathname();
  const [breakingNews, setBreakingNews] = useState<string[]>([]);
  const [categories, setCategories] = useState<NavCategory[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

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
          setBreakingNews(data.map((a: any) => a.title));
        } else {
          // Fallback to recent articles
          fetch('/api/articles?limit=5')
            .then(res => res.json())
            .then(articles => {
              if (Array.isArray(articles) && articles.length > 0) {
                setBreakingNews(articles.map((a: any) => a.title));
              } else {
                setBreakingNews(['Central Lens - निष्पक्ष और सटीक पत्रकारिता']);
              }
            })
            .catch(() => setBreakingNews(['Central Lens - निष्पक्ष और सटीक पत्रकारिता']));
        }
      })
      .catch(() => setBreakingNews(['Central Lens - निष्पक्ष और सटीक पत्रकारिता']));
  }, []);

  const displayCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
      {/* Top Edition & Date Bar (Desktop) */}
      <div className="hidden md:block bg-neutral-900 text-neutral-300 text-[11px] py-1.5 px-4 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center font-sans tracking-wide">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5 text-neutral-200">
              <Calendar size={13} className="text-red-500 flex-shrink-0" />
              <span>{currentDate || 'आज का समाचार'}</span>
            </span>
            <span className="text-neutral-700">•</span>
            <span className="flex items-center space-x-1 text-neutral-400">
              <MapPin size={13} className="text-red-500 flex-shrink-0" />
              <span>नई दिल्ली • राष्ट्रीय संस्करण</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5 text-neutral-300">
              <TrendingUp size={12} className="text-emerald-400" />
              <span>सेंसेक्स: <strong className="text-white">82,890</strong> <span className="text-emerald-400 font-semibold">+0.38%</span></span>
            </span>
            <span className="text-neutral-700">•</span>
            <Link href="/about" className="hover:text-white transition-colors">हमारे बारे में</Link>
            <Link href="/contact" className="hover:text-white transition-colors">संपर्क करें</Link>
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
              <span className="text-2xl sm:text-3xl font-black text-red-600 tracking-tighter leading-none group-hover:text-red-700 transition-colors">
                CENTRAL LENS
              </span>
              <span className="text-[10px] font-bold text-neutral-500 tracking-[0.2em] uppercase mt-0.5">
                निष्पक्ष पत्रकारिता
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <Link 
            href="/search" 
            className="flex items-center space-x-2 px-3 py-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition text-sm font-medium" 
            aria-label="Search articles"
          >
            <Search size={18} />
            <span className="hidden sm:inline text-xs text-neutral-500 font-sans">खोजें (Search)</span>
          </Link>
          
          <Link 
            href="/login" 
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-neutral-900 hover:bg-red-600 text-white rounded-full transition text-xs font-semibold shadow-sm" 
            aria-label="Account"
          >
            <User size={14} />
            <span className="hidden sm:inline">अकाउंट</span>
          </Link>
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

      {/* Breaking News Ticker */}
      <div className="bg-red-600 text-white text-xs font-bold px-4 py-2 flex items-center space-x-3 overflow-hidden shadow-inner">
        <span className="whitespace-nowrap uppercase tracking-widest bg-red-800 px-2.5 py-0.5 rounded text-[11px] shadow-sm flex-shrink-0 flex items-center space-x-1">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping mr-1"></span>
          <span>ताज़ा खबर</span>
        </span>
        <div className="flex-1 overflow-hidden relative h-4">
          <div className="absolute whitespace-nowrap animate-marquee flex space-x-8 font-devanagari">
            {breakingNews.map((news, idx) => (
              <span key={idx} className="inline-block font-semibold">
                {news} <span className="mx-4 opacity-60 text-red-200">◆</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Slide-out Drawer Backdrop */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity md:hidden"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-out Drawer Panel */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out md:hidden font-devanagari ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Mobile Navigation"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 bg-neutral-50">
          <Link 
            href="/" 
            onClick={() => setIsMenuOpen(false)} 
            className="flex items-center space-x-2.5"
          >
            <img 
              src="https://res.cloudinary.com/idhgjmqi/image/upload/v1789294779/Central_Lens_Logo_Transparent_1.png" 
              alt="Central Lens Logo" 
              className="h-9 w-9 object-contain"
            />
            <span className="text-xl font-black text-red-600 tracking-tighter">
              CENTRAL LENS
            </span>
          </Link>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 transition"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Search shortcut */}
        <div className="p-4 border-b border-neutral-100">
          <Link
            href="/search"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center space-x-2.5 w-full px-3.5 py-2.5 text-sm text-neutral-500 bg-neutral-50 hover:bg-neutral-100 rounded-xl border border-neutral-200 shadow-sm transition"
          >
            <Search size={16} className="text-neutral-400" />
            <span>खबरें खोजें (Search)...</span>
          </Link>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-3 pt-2 pb-1 font-sans">
            कैटेगरी (Categories)
          </div>

          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-neutral-800 hover:bg-red-50 hover:text-red-600 transition"
          >
            <span className="flex items-center space-x-2.5">
              <Home size={17} className="text-red-600" />
              <span>होम (Home)</span>
            </span>
            <ChevronRight size={16} className="text-neutral-400" />
          </Link>

          {displayCategories.map(cat => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-neutral-700 hover:bg-red-50 hover:text-red-600 transition"
            >
              <span>{cat.name}</span>
              <ChevronRight size={16} className="text-neutral-400" />
            </Link>
          ))}
        </div>

        {/* Drawer Footer Links */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50 space-y-2 font-sans">
          <Link
            href="/login"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-center space-x-2 w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 active:scale-98 text-white text-sm font-semibold rounded-xl shadow-sm transition"
          >
            <User size={16} />
            <span>लॉग इन / खाता (Account)</span>
          </Link>
          <Link
            href="/admin"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-center space-x-1.5 w-full py-1.5 px-4 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition"
          >
            <span>एडमिन डैशबोर्ड (Admin CMS)</span>
          </Link>
        </div>
      </aside>
    </header>
  );
}
