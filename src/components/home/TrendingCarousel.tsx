'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight, FiTrendingUp } from 'react-icons/fi';

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  category: { name: string; slug: string };
  createdAt: string;
}

export default function TrendingCarousel({ articles }: { articles: Article[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!articles || articles.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [articles]);

  if (!articles || articles.length === 0) return null;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? articles.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  };

  const currentArticle = articles[currentIndex];

  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-neutral-900 shadow-2xl group">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 transform group-hover:scale-105"
        style={{ backgroundImage: `url(${currentArticle.coverImage || '/placeholder.jpg'})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-[500px] sm:h-[600px] p-8 sm:p-12">
        <div className="flex items-center space-x-2 mb-4">
          <span className="inline-flex items-center space-x-1 bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full">
            <FiTrendingUp className="w-3 h-3" />
            <span>Trending</span>
          </span>
          <Link href={`/${currentArticle.category.slug}`} className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full transition-colors">
            {currentArticle.category.name}
          </Link>
        </div>
        
        <Link href={`/${currentArticle.category.slug}/${currentArticle.slug}`} className="block group/link">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight group-hover/link:text-blue-400 transition-colors line-clamp-3">
            {currentArticle.title}
          </h2>
        </Link>
        
        <p className="text-gray-300 text-lg max-w-3xl line-clamp-2 mb-6 hidden sm:block">
          {currentArticle.excerpt}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex space-x-2">
            {articles.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-8 bg-blue-500' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          
          <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={handlePrevious}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-colors"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={handleNext}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-colors"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
