'use client';

import Link from 'next/link';
import { Search, Menu, User, X, Home, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

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
  const [breakingNews, setBreakingNews] = useState<string[]>([]);
  const [categories, setCategories] = useState<NavCategory[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                setBreakingNews(['Central Lens - निष्पक्ष और सटीक समाचार']);
              }
            })
            .catch(() => setBreakingNews(['Central Lens - निष्पक्ष और सटीक समाचार']));
        }
      })
      .catch(() => setBreakingNews(['Central Lens - निष्पक्ष और सटीक समाचार']));
  }, []);

  const displayCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsMenuOpen(true)} 
            className="md:hidden text-gray-700 p-1 rounded-md hover:bg-gray-100 active:scale-95 transition"
            aria-label="Open navigation menu"
          >
            <Menu size={24} />
          </button>
          <Link href="/" className="flex items-center space-x-2.5 hover:opacity-95 transition">
            <img 
              src="https://res.cloudinary.com/idhgjmqi/image/upload/v1789294779/Central_Lens_Logo_Transparent_1.png" 
              alt="Central Lens Logo" 
              className="h-9 w-9 object-contain"
            />
            <span className="text-2xl font-black text-red-600 tracking-tighter">
              CENTRAL LENS
            </span>
          </Link>
        </div>
        <div className="flex items-center space-x-3">
          <Link 
            href="/search" 
            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition" 
            aria-label="Search"
          >
            <Search size={20} />
          </Link>
          <Link 
            href="/login" 
            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition" 
            aria-label="Account"
          >
            <User size={20} />
          </Link>
        </div>
      </div>

      {/* Desktop Category Nav */}
      <nav className="hidden md:flex overflow-x-auto whitespace-nowrap bg-gray-50 border-t border-gray-100 px-4 py-2 max-w-7xl mx-auto space-x-6 scrollbar-hide">
        <Link href="/" className="text-sm font-semibold text-gray-900 hover:text-red-600 uppercase transition-colors">
          Home
        </Link>
        {displayCategories.map(cat => (
          <Link 
            key={cat.slug} 
            href={`/${cat.slug}`} 
            className="text-sm font-semibold text-gray-600 hover:text-red-600 uppercase transition-colors"
          >
            {cat.name}
          </Link>
        ))}
      </nav>

      {/* Breaking News Ticker */}
      <div className="bg-red-600 text-white text-xs font-bold px-4 py-2 flex items-center space-x-3 overflow-hidden">
        <span className="whitespace-nowrap uppercase tracking-widest bg-red-800 px-2 py-0.5 rounded text-[11px] shadow-sm flex-shrink-0">
          BREAKING
        </span>
        <div className="flex-1 overflow-hidden relative h-4">
          <div className="absolute whitespace-nowrap animate-marquee flex space-x-8">
            {breakingNews.map((news, idx) => (
              <span key={idx} className="inline-block font-medium">
                {news} <span className="mx-3 opacity-60">•</span>
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
        className={`fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Mobile Navigation"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
          <Link 
            href="/" 
            onClick={() => setIsMenuOpen(false)} 
            className="flex items-center space-x-2"
          >
            <img 
              src="https://res.cloudinary.com/idhgjmqi/image/upload/v1789294779/Central_Lens_Logo_Transparent_1.png" 
              alt="Central Lens Logo" 
              className="h-8 w-8 object-contain"
            />
            <span className="text-xl font-black text-red-600 tracking-tighter">
              CENTRAL LENS
            </span>
          </Link>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Search shortcut */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <Link
            href="/search"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center space-x-2.5 w-full px-3.5 py-2 text-sm text-gray-500 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 shadow-sm transition"
          >
            <Search size={16} className="text-gray-400" />
            <span>खबरें खोजें (Search)...</span>
          </Link>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 pt-2 pb-1">
            कैटेगरी (Categories)
          </div>

          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-800 hover:bg-red-50 hover:text-red-600 transition"
          >
            <span className="flex items-center space-x-2.5">
              <Home size={17} className="text-red-600" />
              <span>होम (Home)</span>
            </span>
            <ChevronRight size={16} className="text-gray-400" />
          </Link>

          {displayCategories.map(cat => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
            >
              <span>{cat.name}</span>
              <ChevronRight size={16} className="text-gray-400" />
            </Link>
          ))}
        </div>

        {/* Drawer Footer Links */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-2">
          <Link
            href="/login"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-center space-x-2 w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 active:scale-98 text-white text-sm font-semibold rounded-lg shadow-sm transition"
          >
            <User size={16} />
            <span>लॉग इन / अकाउंट (Account)</span>
          </Link>
          <Link
            href="/admin"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-center space-x-1.5 w-full py-1.5 px-4 text-xs font-medium text-gray-500 hover:text-gray-900 transition"
          >
            <span>एडमिन डैशबोर्ड (Admin CMS)</span>
          </Link>
        </div>
      </aside>
    </header>
  );
}
