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
    <footer className="bg-gray-900 text-gray-300 py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-2.5 mb-4">
            <img 
              src="https://res.cloudinary.com/idhgjmqi/image/upload/v1789294779/Central_Lens_Logo_Transparent_1.png" 
              alt="Central Lens Logo" 
              className="h-8 w-8 object-contain"
            />
            <h2 className="text-2xl font-black text-white tracking-tighter">CENTRAL LENS</h2>
          </div>
          <p className="text-sm text-gray-400 mb-6">
            Your source for the latest news in politics, sports, technology, and more. 
            Hindi-first, video-first journalism.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white"><Globe size={20} /></a>
            <a href="#" className="hover:text-white"><MessageCircle size={20} /></a>
            <a href="#" className="hover:text-white"><Mail size={20} /></a>
            <a href="#" className="hover:text-white"><LinkIcon size={20} /></a>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/politics" className="hover:text-white transition-colors">राजनीति</Link></li>
            <li><Link href="/sports" className="hover:text-white transition-colors">खेल</Link></li>
            <li><Link href="/technology" className="hover:text-white transition-colors">टेक्नोलॉजी</Link></li>
            <li><Link href="/entertainment" className="hover:text-white transition-colors">मनोरंजन</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Subscribe to Newsletter</h3>
          <p className="text-sm text-gray-400 mb-4">Get the latest stories directly to your inbox.</p>
          {status === 'success' ? (
            <div className="flex items-center space-x-2 text-green-400 bg-green-400/10 p-3 rounded-lg border border-green-400/20">
              <CheckCircle2 size={20} />
              <span className="text-sm font-medium">{message}</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
              <div className="flex">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address" 
                  disabled={status === 'loading'}
                  className="bg-gray-800 border-none rounded-l-lg py-2 px-4 focus:ring-2 focus:ring-red-600 outline-none w-full text-white disabled:opacity-50"
                />
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-r-lg px-4 font-semibold transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px]"
                >
                  {status === 'loading' ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </div>
              {status === 'error' && (
                <p className="text-xs text-red-400">{message}</p>
              )}
            </form>
          )}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
        <p>&copy; {new Date().getFullYear()} Central Lens. All rights reserved.</p>
      </div>
    </footer>
  );
}
