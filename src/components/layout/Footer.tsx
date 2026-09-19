'use client';

import Link from 'next/link';
import { Globe, MessageCircle, Mail, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      // Dummy API route or actual one
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (res.ok) {
        setStatus('success');
        setMessage('Thank you for subscribing!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to subscribe.');
    }
  };

  return (
    <footer className="bg-neutral-50 text-neutral-600 py-14 mt-16 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-2.5 mb-4">
            <img 
              src="https://res.cloudinary.com/idhgjmqi/image/upload/v1789294779/Central_Lens_Logo_Transparent_1.png" 
              alt="Central Lens Logo" 
              className="h-8 w-8 object-contain"
            />
            <h2 className="text-2xl font-black text-neutral-900 tracking-tighter">CENTRAL LENS</h2>
          </div>
          <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
            Your source for the latest news in politics, sports, technology, and more. 
            Hindi-first, video-first journalism.
          </p>
          <div className="flex space-x-3">
            <a href="#" className="p-2 rounded-lg bg-white border border-neutral-200 text-neutral-600 hover:text-red-600 hover:border-red-200 transition-colors shadow-2xs"><Globe size={18} /></a>
            <a href="#" className="p-2 rounded-lg bg-white border border-neutral-200 text-neutral-600 hover:text-red-600 hover:border-red-200 transition-colors shadow-2xs"><MessageCircle size={18} /></a>
            <a href="#" className="p-2 rounded-lg bg-white border border-neutral-200 text-neutral-600 hover:text-red-600 hover:border-red-200 transition-colors shadow-2xs"><Mail size={18} /></a>
            <a href="#" className="p-2 rounded-lg bg-white border border-neutral-200 text-neutral-600 hover:text-red-600 hover:border-red-200 transition-colors shadow-2xs"><LinkIcon size={18} /></a>
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-neutral-900 mb-4">Categories</h3>
          <ul className="space-y-2.5 text-sm font-medium">
            <li><Link href="/politics" className="hover:text-red-600 transition-colors text-neutral-600">राजनीति</Link></li>
            <li><Link href="/sports" className="hover:text-red-600 transition-colors text-neutral-600">खेल</Link></li>
            <li><Link href="/technology" className="hover:text-red-600 transition-colors text-neutral-600">टेक्नोलॉजी</Link></li>
            <li><Link href="/entertainment" className="hover:text-red-600 transition-colors text-neutral-600">मनोरंजन</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-bold text-neutral-900 mb-4">Company</h3>
          <ul className="space-y-2.5 text-sm font-medium">
            <li><Link href="/about" className="hover:text-red-600 transition-colors text-neutral-600">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-red-600 transition-colors text-neutral-600">Contact</Link></li>
            <li><Link href="/privacy" className="hover:text-red-600 transition-colors text-neutral-600">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-red-600 transition-colors text-neutral-600">Terms of Service</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-bold text-neutral-900 mb-4">Subscribe to Newsletter</h3>
          <p className="text-sm text-neutral-500 mb-4">Get the latest stories directly to your inbox.</p>
          {status === 'success' ? (
            <div className="flex items-center space-x-2 text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-sm font-medium">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <span>{message}</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
              <div className="flex rounded-xl overflow-hidden border border-neutral-300 focus-within:ring-2 focus-within:ring-red-600/30 focus-within:border-red-600 shadow-2xs">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address" 
                  disabled={status === 'loading'}
                  className="bg-white border-none py-2.5 px-4 outline-none w-full text-neutral-900 text-sm placeholder:text-neutral-400 disabled:opacity-50"
                />
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px]"
                >
                  {status === 'loading' ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </div>
              {status === 'error' && (
                <p className="text-xs text-red-600">{message}</p>
              )}
            </form>
          )}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-neutral-200 text-sm text-neutral-500 flex flex-col md:flex-row justify-between items-center">
        <p>&copy; {new Date().getFullYear()} Central Lens. All rights reserved.</p>
      </div>
    </footer>
  );
}
