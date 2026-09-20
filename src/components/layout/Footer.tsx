'use client';

import Link from 'next/link';
import { Mail, CheckCircle2, ArrowUp } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setMessage(data.message || 'सब्सक्राइब करने के लिए धन्यवाद!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'पुनः प्रयास करें।');
      }
    } catch (error) {
      setStatus('error');
      setMessage('पुनः प्रयास करें।');
    }
  };

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-neutral-50 text-neutral-600 mt-20 border-t border-neutral-200/70 font-devanagari">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 items-start w-full">
          
          {/* Brand & Overview (4 cols) */}
          <div className="lg:col-span-4 space-y-3.5">
            <Link href="/" className="inline-flex items-center space-x-2.5">
              <img 
                src="https://res.cloudinary.com/idhgjmqi/image/upload/v1789294779/Central_Lens_Logo_Transparent_1.png" 
                alt="Central Lens Logo" 
                className="h-7 w-7 object-contain"
              />
              <span className="text-xl font-bold text-neutral-900 tracking-tight font-sans">
                CENTRAL LENS
              </span>
            </Link>

            <p className="text-xs text-neutral-500 leading-relaxed max-w-sm">
              भारत का स्वतंत्र और तथ्यपरक डिजिटल समाचार मंच। सत्य, सटीकता और निष्पक्ष पत्रकारिता के प्रति पूर्णतः समर्पित।
            </p>

            {/* Subtle Minimal Social Links */}
            <div className="flex items-center space-x-3 pt-1 text-neutral-400">
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="YouTube"
                className="hover:text-red-600 transition-colors p-1"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Twitter / X"
                className="hover:text-neutral-900 transition-colors p-1"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Instagram"
                className="hover:text-neutral-900 transition-colors p-1"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="mailto:editorial@centrallens.in" 
                aria-label="Email"
                className="hover:text-red-600 transition-colors p-1"
              >
                <Mail size={15} />
              </a>
            </div>
          </div>

          {/* Categories (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider font-sans">
              श्रेणियां
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/national" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                  राष्ट्रीय (National)
                </Link>
              </li>
              <li>
                <Link href="/politics" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                  राजनीति (Politics)
                </Link>
              </li>
              <li>
                <Link href="/sports" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                  खेल (Sports)
                </Link>
              </li>
              <li>
                <Link href="/technology" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                  टेक & AI (Tech)
                </Link>
              </li>
              <li>
                <Link href="/business" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                  व्यापार (Business)
                </Link>
              </li>
              <li>
                <Link href="/videos" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                  वीडियो बुलेटिन
                </Link>
              </li>
            </ul>
          </div>

          {/* Institutional Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider font-sans">
              संस्थान
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                  हमारे बारे में
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                  संपर्क करें
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                  गोपनीयता नीति
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                  नियम व शर्तें
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Box (4 cols - positioned on the far right) */}
          <div className="lg:col-span-4 lg:ml-auto w-full max-w-md space-y-3">
            <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-2.5">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider font-sans">
                न्यूज़लेटर
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                दैनिक महत्वपूर्ण खबरों का संक्षिप्त एवं निष्पक्ष विश्लेषण सीधे अपने इनबॉक्स में पाएं।
              </p>

              {status === 'success' ? (
                <div className="flex items-center space-x-2 text-xs text-neutral-800 bg-neutral-100 p-2.5 rounded-lg border border-neutral-200">
                  <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
                  <span>{message}</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="flex rounded-xl overflow-hidden border border-neutral-200 bg-white focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-200 shadow-2xs">
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com" 
                      disabled={status === 'loading'}
                      className="w-full px-3.5 py-2.5 text-xs text-neutral-800 outline-none placeholder:text-neutral-400 disabled:opacity-50 font-sans"
                    />
                    <button 
                      type="submit" 
                      disabled={status === 'loading'}
                      className="px-4 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 transition-colors disabled:opacity-50 flex-shrink-0 cursor-pointer"
                    >
                      {status === 'loading' ? '...' : 'जुड़ें'}
                    </button>
                  </div>
                  {status === 'error' && (
                    <p className="text-[11px] text-red-600">{message}</p>
                  )}
                </form>
              )}

              <p className="text-[10px] text-neutral-400 font-sans">
                🔒 शून्य स्पैम। किसी भी समय अनसब्सक्राइब करें।
              </p>
            </div>
          </div>

        </div>

        {/* Quiet Sub-footer */}
        <div className="mt-12 pt-6 border-t border-neutral-200/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
          <p className="font-sans">
            &copy; {new Date().getFullYear()} Central Lens. सर्वाधिकार सुरक्षित।
          </p>

          <button
            onClick={scrollToTop}
            className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors inline-flex items-center space-x-1 cursor-pointer"
          >
            <span>वापस ऊपर जाएं</span>
            <ArrowUp size={12} />
          </button>
        </div>
      </div>
    </footer>
  );
}
