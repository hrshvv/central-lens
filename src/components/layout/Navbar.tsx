'use client';

import Link from 'next/link';
import { Search, Menu, User } from 'lucide-react';
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
  { name: 'देश', slug: 'india' },
  { name: 'विदेश', slug: 'world' }
];

export default function Navbar() {
  const [breakingNews, setBreakingNews] = useState<string[]>([]);
  const [categories, setCategories] = useState<NavCategory[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/articles/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      })
      .catch(() => {});

    // Fetch breaking news (can be a specific endpoint, or just latest articles)
    // For now, let's fetch latest articles and extract titles
    fetch('/api/articles?limit=5')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.articles) && data.articles.length > 0) {
          setBreakingNews(data.articles.map((a: any) => a.title));
        } else {
          setBreakingNews(['Welcome to Central Lens - The latest news in Hindi']);
        }
      })
      .catch(() => setBreakingNews(['Welcome to Central Lens']));
  }, []);

  const displayCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="md:hidden text-gray-700"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
          <Link href="/" className="text-2xl font-black text-red-600 tracking-tighter">
            CENTRAL LENS
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/search" className="text-gray-600 hover:text-gray-900" aria-label="Search">
            <Search size={20} />
          </Link>
          <Link href="/login" className="text-gray-600 hover:text-gray-900 hidden md:block" aria-label="Account">
            <User size={20} />
          </Link>
        </div>
      </div>

      {/* Category Nav */}
      <nav className="hidden md:flex overflow-x-auto whitespace-nowrap bg-gray-50 border-t border-gray-100 px-4 py-2 max-w-7xl mx-auto space-x-6 scrollbar-hide">
        <Link href="/" className="text-sm font-semibold text-gray-900 hover:text-red-600 uppercase">Home</Link>
        {displayCategories.map(cat => (
          <Link key={cat.slug} href={`/${cat.slug}`} className="text-sm font-semibold text-gray-600 hover:text-red-600 uppercase">
            {cat.name}
          </Link>
        ))}
      </nav>

      {/* Breaking News Ticker */}
      <div className="bg-red-600 text-white text-xs font-bold px-4 py-2 flex items-center space-x-3 overflow-hidden">
        <span className="whitespace-nowrap uppercase tracking-widest bg-red-800 px-2 py-1 rounded z-10 shadow-[4px_0_10px_-2px_rgba(0,0,0,0.3)]">Breaking</span>
        <div className="flex-1 overflow-hidden relative h-4">
          <div className="absolute whitespace-nowrap animate-marquee flex space-x-8">
            {breakingNews.map((news, idx) => (
              <span key={idx} className="inline-block">
                {news} <span className="mx-4 opacity-50">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
