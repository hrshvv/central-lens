'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  HelpCircle,
  ArrowRight,
  Sparkles,
  Mail,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Clock
} from 'lucide-react';

export default function ContactPage() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const contactEmail = 'centrallens5@gmail.com';

  const handleCopyEmail = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(contactEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const socials = [
    {
      name: 'X (Twitter)',
      href: 'https://x.com',
      handle: '@CentralLens',
      desc: 'ताज़ा ब्रेकिंग न्यूज़ व त्वरित अपडेट्स',
      color: 'hover:border-neutral-900 hover:text-black',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com',
      handle: '@centrallens',
      desc: 'विजुअल स्टोरीज, रील्स एवं ग्राउंड रिपोर्ट्स',
      color: 'hover:border-pink-300 hover:text-pink-600',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      handle: 'Central Lens Media',
      desc: 'संपादकीय विश्लेषण, करियर व साझेदारी',
      color: 'hover:border-blue-300 hover:text-blue-700',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ),
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com',
      handle: 'Central Lens News',
      desc: 'दैनिक विशेष बुलेटिन एवं वीडियो रिपोर्ट्स',
      color: 'hover:border-red-300 hover:text-red-600',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
    },
  ];

  const faqs = [
    {
      q: 'मैं किसी समाचार के संबंध में गोपनीय टिप कैसे साझा करूँ?',
      a: `आप सीधे हमारी खोजी टीम को ${contactEmail} पर ईमेल कर सकते हैं। हम स्रोत की पहचान पूर्ण रूप से गोपनीय रखते हैं।`,
    },
    {
      q: 'यदि किसी खबर में कोई तथ्यात्मक त्रुटि हो तो क्या करें?',
      a: `हम त्वरित सुधार नीति का पालन करते हैं। कृपया लेख का लिंक और प्रमाणित संदर्भ ${contactEmail} पर भेजें। हमारी संपादकीय टीम 12 से 24 घंटे के भीतर इसकी समीक्षा करेगी।`,
    },
    {
      q: 'विज्ञापन या मीडिया पार्टनरशिप के लिए किससे संपर्क करें?',
      a: `ब्रांड सहयोग, स्पॉन्सर्ड कवरेज या विज्ञापनों के लिए आप सीधे ${contactEmail} पर अपना प्रस्ताव भेज सकते हैं।`,
    },
    {
      q: 'क्या सेंट्रल लेंस के साथ स्वतंत्र लेखक या पत्रकार के रूप में जुड़ सकते हैं?',
      a: `हाँ! यदि आप खोजी पत्रकारिता, विश्लेषण अथवा जमीनी रिपोर्टिंग में रुचि रखते हैं, तो अपना बायो एवं कार्य के नमूने ${contactEmail} पर ईमेल करें।`,
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50/50">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-neutral-100/90 via-white to-neutral-50/50 border-b border-neutral-200/80 py-14 sm:py-20 px-4 sm:px-6">
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[320px] bg-red-100/40 rounded-full blur-3xl pointer-events-none -z-10" 
          aria-hidden="true" 
        />

        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-200/80 shadow-2xs">
            <img 
              src="https://res.cloudinary.com/idhgjmqi/image/upload/v1789294779/Central_Lens_Logo_Transparent_1.png" 
              alt="Central Lens Logo" 
              className="h-4 w-4 object-contain"
            />
            <span className="text-xs font-bold text-red-700 font-sans tracking-wide uppercase">
              सेंट्रल लेंस • संवाद व संपर्क केंद्र
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight font-devanagari">
            हमसे संपर्क करें{' '}
            <span className="text-red-600">(Get in Touch)</span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto font-devanagari leading-relaxed">
            कोई समाचार टिप, संपादकीय प्रतिक्रिया या सहयोग? सेंट्रल लेंस की समर्पित टीम आपके प्रश्नों, सुझावों और संवाद के लिए हमेशा तत्पर है।
          </p>
        </div>
      </section>

      {/* Primary Channels: Direct Email & Socials Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Email Card (5 cols) */}
          <div className="md:col-span-5 bg-white text-neutral-900 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden border border-neutral-200/90">
            <div 
              className="absolute -top-16 -right-16 w-48 h-48 bg-red-100/50 rounded-full blur-2xl pointer-events-none" 
              aria-hidden="true"
            />

            <div className="space-y-4 relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200/80 text-red-700 text-xs font-bold font-sans">
                <Mail size={13} />
                <span>आधिकारिक ईमेल पता</span>
              </div>

              <div>
                <h2 className="text-2xl font-black font-devanagari text-neutral-900 tracking-tight">
                  सीधे ईमेल करें
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 font-devanagari mt-1 leading-relaxed">
                  संपादकीय टीम, समाचार सुझाव अथवा विज्ञापनों से जुड़े सभी संचार के लिए हमारा प्राथमिक ईमेल।
                </p>
              </div>

              {/* Email Address Container */}
              <div className="bg-neutral-50/80 border border-neutral-200/80 rounded-2xl p-4 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-sans block">
                  Primary Contact Email
                </span>
                <p className="text-sm sm:text-base font-bold text-red-600 font-sans break-all select-all">
                  {contactEmail}
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={`mailto:${contactEmail}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-sm font-devanagari cursor-pointer"
                  >
                    <Mail size={14} />
                    <span>ईमेल भेजें</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs font-medium rounded-xl transition cursor-pointer font-sans shadow-2xs"
                    title="ईमेल कॉपी करें"
                  >
                    {copiedEmail ? (
                      <>
                        <Check size={14} className="text-emerald-600" />
                        <span className="text-emerald-700 text-[11px] font-semibold">कॉपी हो गया!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} className="text-neutral-500" />
                        <span className="text-[11px]">कॉपी</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Guarantees */}
            <div className="pt-6 border-t border-neutral-100 grid grid-cols-2 gap-3 text-xs text-neutral-600 font-devanagari relative">
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-red-600 flex-shrink-0" />
                <span>24 घंटे में प्रतिक्रिया</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-emerald-600 flex-shrink-0" />
                <span>स्रोत पूर्णतः गोपनीय</span>
              </div>
            </div>
          </div>

          {/* Socials Grid (7 cols) */}
          <div className="md:col-span-7 bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 bg-neutral-100 px-3 py-1 rounded-full font-devanagari">
                <Sparkles size={13} className="text-red-600" />
                <span>डिजिटल उपस्थिति</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 font-devanagari">
                सोशल मीडिया पर जुड़ें (Follow & Connect)
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 font-devanagari leading-relaxed">
                देश-विदेश, राज्यों की ब्रेकिंग खबरें, खोजी रिपोर्ट्स और विश्लेषणात्मक वीडियो के लिए हमारे आधिकारिक सोशल हैंडल्स को फ़ॉलो करें।
              </p>
            </div>

            {/* Social Channels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-5">
              {socials.map((s, idx) => (
                <a
                  key={idx}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex flex-col justify-between p-4 rounded-2xl border border-neutral-200 bg-neutral-50/70 hover:bg-white text-neutral-800 transition-all shadow-2xs group ${s.color}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="p-2 rounded-xl bg-white border border-neutral-200 shadow-2xs text-neutral-900 group-hover:scale-105 transition-transform">
                        {s.icon}
                      </span>
                      <div>
                        <h3 className="text-xs font-bold font-sans text-neutral-900 group-hover:text-red-600 transition-colors">
                          {s.name}
                        </h3>
                        <p className="text-[11px] text-neutral-500 font-sans">
                          {s.handle}
                        </p>
                      </div>
                    </div>
                    <ExternalLink size={14} className="text-neutral-400 group-hover:text-red-600 transition-colors" />
                  </div>
                  <p className="text-[11px] text-neutral-500 font-devanagari mt-2.5 line-clamp-1">
                    {s.desc}
                  </p>
                </a>
              ))}
            </div>

            {/* Footer tip inside card */}
            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 font-devanagari">
              <span>आधिकारिक एवं सत्यापित हैंडल्स</span>
              <span className="text-red-600 font-bold font-sans">@CentralLens</span>
            </div>
          </div>

        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-14 bg-white border-t border-neutral-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest bg-red-50 border border-red-200/80 px-3.5 py-1 rounded-full font-sans">
              अक्सर पूछे जाने वाले सवाल
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 font-devanagari mt-3">
              सहायता एवं त्वरित निर्देश
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-200/70 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-2.5 text-neutral-900">
                    <HelpCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <h3 className="font-bold text-sm font-devanagari leading-snug">{faq.q}</h3>
                  </div>
                  <p className="text-xs text-neutral-600 font-devanagari leading-relaxed pl-7 mt-1.5">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/about"
              className="inline-flex items-center space-x-2 text-xs font-bold text-red-600 hover:text-red-700 hover:underline font-devanagari"
            >
              <span>हमारी संपादकीय नीति व आचार संहिता के बारे में और पढ़ें</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
