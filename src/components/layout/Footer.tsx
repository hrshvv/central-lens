'use client';

import Link from 'next/link';
import { Mail, ArrowUp, ExternalLink } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const socials = [
    {
      name: 'X (Twitter)',
      href: 'https://x.com',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      handle: '@CentralLens',
      color: 'hover:text-black hover:border-black/30',
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      handle: '@centrallens',
      color: 'hover:text-pink-600 hover:border-pink-200',
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ),
      handle: 'Central Lens',
      color: 'hover:text-blue-700 hover:border-blue-200',
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      handle: 'Central Lens News',
      color: 'hover:text-red-600 hover:border-red-200',
    },
  ];

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

            <p className="text-xs text-neutral-400 font-sans">
              संवाद • सत्य • सरोकार
            </p>
          </div>

          {/* Categories (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider font-sans">
              राज्य (States)
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/mp" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                  मध्य प्रदेश (MP)
                </Link>
              </li>
              <li>
                <Link href="/chhattisgarh" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                  छत्तीसगढ़ (Chhattisgarh)
                </Link>
              </li>
              <li>
                <Link href="/delhi" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                  दिल्ली (Delhi)
                </Link>
              </li>
              <li>
                <Link href="/uttar-pradesh" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                  उत्तर प्रदेश (UP)
                </Link>
              </li>
              <li>
                <Link href="/bihar" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                  बिहार (Bihar)
                </Link>
              </li>
              <li>
                <Link href="/rajasthan" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                  राजस्थान (Rajasthan)
                </Link>
              </li>
              <li>
                <Link href="/gujarat" className="text-neutral-500 hover:text-neutral-900 transition-colors">
                  गुजरात (Gujarat)
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

          {/* Contact & Socials Box (4 cols - positioned on the far right) */}
          <div className="lg:col-span-4 lg:ml-auto w-full max-w-md space-y-3">
            <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3">
              <div>
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider font-sans">
                  संपर्क एवं सोशल मीडिया (Connect With Us)
                </h3>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  संपादकीय सुझाव, समाचार टिप या सहयोग हेतु सीधे ईमेल करें अथवा सोशल मीडिया पर जुड़ें।
                </p>
              </div>

              {/* Email Card */}
              <a 
                href="mailto:centrallens5@gmail.com"
                className="flex items-center space-x-3 p-3 rounded-xl bg-red-50/70 hover:bg-red-100/70 border border-red-200/80 text-red-700 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Mail size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                    आधिकारिक ईमेल
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-neutral-900 truncate block font-sans">
                    centrallens5@gmail.com
                  </span>
                </div>
                <ExternalLink size={13} className="text-neutral-400 group-hover:text-red-600 transition-colors" />
              </a>

              {/* Socials Grid */}
              <div className="pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2 font-sans">
                  सोशल मीडिया हैंडल्स
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {socials.map((s, idx) => (
                    <a
                      key={idx}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex items-center space-x-2 p-2 rounded-xl border border-neutral-200/80 bg-neutral-50/60 hover:bg-white text-neutral-700 text-xs font-semibold transition-all shadow-2xs ${s.color}`}
                    >
                      <span className="flex-shrink-0">{s.icon}</span>
                      <span className="truncate text-[11px] font-sans">{s.name}</span>
                    </a>
                  ))}
                </div>
              </div>
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
            <span>शीर्ष पर जाएं</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
