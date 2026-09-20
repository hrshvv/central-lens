import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Globe, 
  CheckCircle2, 
  ArrowRight, 
  Newspaper,
  Compass
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'हमारे बारे में (About Us) | Central Lens',
  description: 'सेंट्रल लेंस - भारत का निष्पक्ष, तथ्यपरक और स्वतंत्र डिजिटल समाचार मंच। जानिए हमारी संपादकीय नीति, मूल्य और मिशन।',
};

export default function AboutPage() {
  const pillars = [
    {
      icon: ShieldCheck,
      title: 'सत्य और निष्पक्षता',
      subtitle: 'Unbiased Journalism',
      desc: 'बिना किसी राजनीतिक या व्यावसायिक दबाव के केवल प्रमाणित और तथ्यात्मक खबरें। हमारा उद्देश्य नागरिकों तक निष्पक्ष सच पहुंचाना है।',
      badge: 'मूल सिद्धांत',
    },
    {
      icon: Newspaper,
      title: 'गहन संपादकीय विश्लेषण',
      subtitle: 'In-depth Analysis',
      desc: 'सनसनीखेज सुर्खियों के बजाय खबरों के मूल संदर्भ, आर्थिक-सामाजिक प्रभाव और विशेषज्ञों के दृष्टिकोण का संतुलित विश्लेषण।',
      badge: 'संपादकीय',
    },
    {
      icon: Compass,
      title: 'जनहित की पत्रकारिता',
      subtitle: 'Public Interest',
      desc: 'नागरिक अधिकारों, सरकारी नीतियों, स्वास्थ्य, पर्यावरण, रोजगार और जमीनी भारत के मुद्दों को प्रमुखता से उठाना।',
      badge: 'लोकहित',
    },
    {
      icon: Globe,
      title: 'डिजिटल-फर्स्ट अनुभव',
      subtitle: 'Modern Multimedia',
      desc: 'लेखों के साथ-साथ गुणवत्तापूर्ण वीडियो बुलेटिन और गहन ग्राउंड रिपोर्ट्स के माध्यम से स्पष्ट समाचार प्रस्तुति।',
      badge: 'माध्यम',
    },
  ];

  const ethics = [
    {
      title: 'तथ्य-जांच एवं सत्यापन',
      detail: 'हर समाचार को प्रकाशित करने से पहले आधिकारिक और स्वतंत्र प्राथमिक स्रोतों से परखा जाता है।',
    },
    {
      title: 'पारदर्शिता एवं त्वरित सुधार नीति',
      detail: 'यदि किसी रिपोर्ट में कोई अनजानी त्रुटि पाई जाती है, तो उसे सार्वजनिक सुधार नोट के साथ स्पष्ट किया जाता है।',
    },
    {
      title: 'स्रोतों की पूर्ण गोपनीयता',
      detail: 'व्हिसलब्लोअर और संवेदनशील स्रोतों की पहचान सुरक्षित रखना हमारे आचार का अनिवार्य हिस्सा है।',
    },
    {
      title: 'व्यावसायिक स्वतंत्रता',
      detail: 'संपादकीय नीति और वाणिज्यिक विज्ञापनों के बीच सख्त विभाजन बनाए रखा जाता है।',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50/40">
      {/* Hero Section */}
      <section className="bg-white border-b border-neutral-200/70 py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium font-sans">
            <img 
              src="https://res.cloudinary.com/idhgjmqi/image/upload/v1789294779/Central_Lens_Logo_Transparent_1.png" 
              alt="Central Lens" 
              className="h-4 w-4 object-contain"
            />
            <span>Central Lens Editorial</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight font-devanagari leading-snug">
            निष्पक्ष, तथ्यपरक और स्वतंत्र पत्रकारिता
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto font-devanagari leading-relaxed">
            सेंट्रल लेंस का उद्देश्य सनसनी के शोर से परे जाकर प्रामाणिक तथ्यों और जिम्मेदार विश्लेषण के साथ देश और दुनिया की अहम खबरों को पाठकों तक पहुंचाना है।
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold transition font-devanagari"
            >
              <span>संपादकीय टीम से संपर्क करें</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/videos"
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold transition font-devanagari"
            >
              <span>वीडियो बुलेटिन देखें</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Core Editorial Pillars (Subtle, Clean Cards) */}
      <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200/70 mb-8">
          <div>
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider font-sans block mb-1">
              Editorial Principles
            </span>
            <h2 className="text-2xl font-bold text-neutral-900 tracking-tight font-devanagari">
              हमारे मूल सिद्धांत
            </h2>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-white p-6 rounded-xl border border-neutral-200/70 hover:border-neutral-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-9 h-9 rounded-lg bg-neutral-100 text-neutral-600 flex items-center justify-center group-hover:text-red-600 transition-colors">
                      <Icon size={18} />
                    </div>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-devanagari">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 font-devanagari">
                    {item.title}{' '}
                    <span className="text-xs font-normal text-neutral-400 font-sans">
                      ({item.subtitle})
                    </span>
                  </h3>
                  <p className="text-neutral-600 text-xs sm:text-sm mt-2 font-devanagari leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Editorial Ethics & Standards */}
      <section className="py-12 sm:py-16 bg-white border-t border-b border-neutral-200/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200/70 mb-8">
            <div>
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider font-sans block mb-1">
                Standards & Accountability
              </span>
              <h2 className="text-2xl font-bold text-neutral-900 tracking-tight font-devanagari">
                संपादकीय आचार संहिता
              </h2>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-3">
              <h3 className="text-lg font-bold text-neutral-900 font-devanagari">
                उत्तरदायी और पारदर्शी पत्रकारिता
              </h3>
              <p className="text-neutral-600 text-xs sm:text-sm font-devanagari leading-relaxed">
                आज के डिजिटल युग में पाठकों का विश्वास ही हमारी सबसे बड़ी पूंजी है। हम अपने हर शब्द और तथ्य के प्रति पूरी तरह जवाबदेह हैं।
              </p>
              <div className="pt-1">
                <Link
                  href="/terms"
                  className="inline-flex items-center space-x-1 text-xs font-medium text-neutral-700 hover:text-red-600 transition-colors font-devanagari"
                >
                  <span>नियम व शर्तें पढ़ें</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
              {ethics.map((e, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-xl bg-neutral-50/70 border border-neutral-200/60 space-y-1.5"
                >
                  <div className="flex items-center space-x-2 text-neutral-800">
                    <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                    <h4 className="font-bold text-sm font-devanagari">{e.title}</h4>
                  </div>
                  <p className="text-xs text-neutral-600 font-devanagari leading-relaxed pl-6">
                    {e.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Subtle News Tip CTA */}
      <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 text-center space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold font-devanagari">
            क्या आपके पास कोई महत्वपूर्ण समाचार या टिप है?
          </h2>
          <p className="text-neutral-300 text-xs sm:text-sm max-w-lg mx-auto font-devanagari leading-relaxed">
            यदि आप किसी जनहित के मुद्दे को उजागर करना चाहते हैं, तो हमारी संपादकीय टीम से संपर्क करें। स्रोतों की पहचान पूर्णतः सुरक्षित रखी जाती है।
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white hover:bg-neutral-100 text-neutral-900 font-semibold rounded-lg text-xs transition font-devanagari"
            >
              <span>संपादकीय टीम को संदेश भेजें</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
