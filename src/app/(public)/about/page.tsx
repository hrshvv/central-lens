import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Target, 
  ShieldCheck, 
  Globe, 
  CheckCircle2, 
  FileText, 
  ArrowRight, 
  Sparkles,
  Newspaper,
  Compass,
  HeartHandshake
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'हमारे बारे में (About Us) | Central Lens',
  description: 'सेंट्रल लेंस - भारत का निष्पक्ष, तथ्यपरक और स्वतंत्र डिजिटल समाचार मंच। जानिए हमारी संपादकीय नीति, मूल्य और मिशन।',
};

export default function AboutPage() {
  const pillars = [
    {
      icon: ShieldCheck,
      title: 'सत्य और निष्पक्षता (Unbiased Journalism)',
      desc: 'बिना किसी राजनीतिक या कॉर्पोरेट दबाव के केवल प्रमाणित और तथ्यात्मक खबरें। हमारा एकमात्र उद्देश्य नागरिकों तक सच्चाई पहुंचाना है।',
      badge: 'प्राथमिकता',
    },
    {
      icon: Newspaper,
      title: 'गहन संपादकीय विश्लेषण (In-depth Analysis)',
      desc: 'सनसनीखेज सुर्खियों के बजाय खबरों के मूल संदर्भ, आर्थिक-सामाजिक प्रभाव और विशेषज्ञ दृष्टिकोण का समग्र विश्लेषण।',
      badge: 'संपादकीय',
    },
    {
      icon: Compass,
      title: 'जनहित की पत्रकारिता (Public Interest)',
      desc: 'आम जनता के अधिकार, नीतियां, स्वास्थ्य, पर्यावरण, रोजगार और ग्रामीण भारत से जुड़े अहम मुद्दों को प्रमुखता से उठाना।',
      badge: 'लोकहित',
    },
    {
      icon: Globe,
      title: 'डिजिटल-फर्स्ट अनुभव (Modern Multimedia)',
      desc: 'लेखों के साथ-साथ त्वरित वीडियो बुलेटिन, शॉर्ट्स, ग्राउंड रिपोर्ट्स और पॉडकास्ट के माध्यम से आधुनिक समाचार प्रस्तुति।',
      badge: 'तकनीक',
    },
  ];

  const ethics = [
    {
      title: 'तथ्य-जांच एवं सत्यापन',
      detail: 'हर समाचार को प्रकाशित करने से पहले आधिकारिक और स्वतंत्र प्राथमिक स्रोतों से दोहरे स्तर पर परखा जाता है।',
    },
    {
      title: 'पारदर्शिता एवं त्वरित सुधार नीति',
      detail: 'यदि किसी रिपोर्ट में कोई अनजानी त्रुटि पाई जाती है, तो उसे तुरंत सार्वजनिक संशोधन नोट के साथ दुरुस्त किया जाता है।',
    },
    {
      title: 'स्रोतों की पूर्ण गोपनीयता',
      detail: 'व्हिसलब्लोअर और संवेदनशील स्रोतों की पहचान की रक्षा करना हमारे संपादकीय धर्म का अनिवार्य हिस्सा है।',
    },
    {
      title: 'व्यावसायिक स्वतंत्रता',
      detail: 'संपादकीय नीति और वाणिज्यिक विज्ञापनों के बीच सख्त विभाजन बनाए रखा जाता है ताकि रिपोर्टिंग की निष्पक्षता अक्षुण्ण रहे।',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50/50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-neutral-100/90 via-white to-neutral-50/50 border-b border-neutral-200/80 py-16 sm:py-24 px-4 sm:px-6">
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-red-100/40 rounded-full blur-3xl pointer-events-none -z-10" 
          aria-hidden="true" 
        />

        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Brand Emblem Tag */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-red-50 border border-red-200/80 shadow-2xs">
            <img 
              src="https://res.cloudinary.com/idhgjmqi/image/upload/v1789294779/Central_Lens_Logo_Transparent_1.png" 
              alt="Central Lens Logo" 
              className="h-5 w-5 object-contain"
            />
            <span className="text-xs font-bold text-red-700 font-sans tracking-wide uppercase">
              सेंट्रल लेंस • निष्पक्ष पत्रकारिता
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-neutral-900 tracking-tight font-devanagari leading-[1.15]">
            डिजिटल भारत की सशक्त, सटीक और{' '}
            <span className="text-red-600 underline decoration-red-200 underline-offset-8">
              निर्भीक आवाज़
            </span>
          </h1>

          <p className="text-base sm:text-xl text-neutral-600 max-w-3xl mx-auto font-devanagari leading-relaxed">
            सेंट्रल लेंस का संकल्प है सनसनी के शोर से परे जाकर तथ्यों, जिम्मेदार विश्लेषण और राष्ट्रहित के मुद्दों को जनता के सामने ईमानदारी से प्रस्तुत करना।
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-md shadow-red-600/20 hover:shadow-lg transition-all font-devanagari"
            >
              <span>संपादकीय टीम से संपर्क करें</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/videos"
              className="flex items-center space-x-2 px-6 py-3 bg-white hover:bg-neutral-100 text-neutral-800 rounded-xl text-sm font-bold border border-neutral-200 shadow-2xs transition font-devanagari"
            >
              <span>वीडियो बुलेटिन देखें</span>
            </Link>
          </div>
        </div>
      </section>



      {/* Core Editorial Pillars */}
      <section className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-red-600 uppercase tracking-widest bg-red-50 border border-red-200/80 px-3.5 py-1 rounded-full font-sans">
            हमारा दृष्टिकोण
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 mt-3 font-devanagari">
            हमारे मूल स्तंभ (Core Editorial Pillars)
          </h2>
          <p className="text-neutral-500 text-sm mt-2 font-devanagari">
            सेंट्रल लेंस की पत्रकारिता इन चार मूलभूत सिद्धांतों पर अडिग है:
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-white p-7 rounded-2xl border border-neutral-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                      <Icon size={24} />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-devanagari">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 font-devanagari group-hover:text-red-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-neutral-600 text-sm mt-2 font-devanagari leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Editorial Ethics & Standards */}
      <section className="py-16 bg-white border-t border-b border-neutral-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold text-red-600 uppercase tracking-widest bg-red-50 border border-red-200/80 px-3.5 py-1 rounded-full font-sans">
                आचार संहिता
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 font-devanagari leading-tight">
                पारदर्शी और उत्तरदायी पत्रकारिता की प्रतिज्ञा
              </h2>
              <p className="text-neutral-600 text-sm font-devanagari leading-relaxed">
                आज के डिजिटल युग में सूचनाओं की बाढ़ के बीच पाठकों का विश्वास ही हमारी सबसे बड़ी पूंजी है। हम अपने हर शब्द और आंकड़े के प्रति पूरी तरह जवाबदेह हैं।
              </p>
              <div className="pt-2">
                <Link
                  href="/terms"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-red-600 hover:text-red-700 hover:underline font-devanagari"
                >
                  <span>हमारी नियम व शर्तें पढ़ें</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
              {ethics.map((e, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-neutral-50/80 border border-neutral-200/70 space-y-2">
                  <div className="flex items-center space-x-2 text-red-600">
                    <CheckCircle2 size={18} className="flex-shrink-0" />
                    <h4 className="font-bold text-neutral-900 text-sm font-devanagari">{e.title}</h4>
                  </div>
                  <p className="text-xs text-neutral-600 font-devanagari leading-relaxed">
                    {e.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Whistleblower / Contact CTA Card */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-red-600/20 relative overflow-hidden">
          <div className="space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold font-sans">
              <HeartHandshake size={14} />
              <span>पाठक भागीदारी</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-devanagari">
              क्या आपके पास कोई महत्वपूर्ण समाचार या टिप है?
            </h2>
            <p className="text-white/90 text-sm sm:text-base max-w-xl mx-auto font-devanagari">
              यदि आप किसी गड़बड़ी, भ्रष्टाचार या जनहित के मुद्दे को उजागर करना चाहते हैं, तो हमारी विशेष खोजी टीम से बेझिझक संपर्क करें।
            </p>
            <div className="pt-3">
              <Link
                href="/contact"
                className="inline-flex items-center space-x-2 px-7 py-3.5 bg-white hover:bg-neutral-100 text-red-700 font-bold rounded-xl text-sm shadow-md transition-all font-devanagari cursor-pointer active:scale-98"
              >
                <span>संदेश भेजें / टिप शेयर करें</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

