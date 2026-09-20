'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Mail, 
  MapPin, 
  Phone, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  HelpCircle,
  ArrowRight,
  FileCheck2,
  Sparkles
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'न्यूज़ टिप / समाचार सुझाव (News Tip)',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'न्यूज़ टिप / समाचार सुझाव (News Tip)',
        message: '',
      });
    }, 600);
  };

  const contactChannels = [
    {
      icon: Mail,
      title: 'संपादकीय डेस्क (Editorial Desk)',
      desc: 'प्रेस विज्ञप्ति, लेख एवं प्रमुख समाचार सुझावों के लिए।',
      contact: 'editorial@centrallens.in',
      subtext: 'प्रतिक्रिया समय: 2 से 4 घंटे',
      badge: '24/7 सक्रिय',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      icon: ShieldCheck,
      title: 'गोपनीय टिप (Whistleblower Desk)',
      desc: 'संवेदनशील दस्तावेज व खोजी पत्रकारिता से जुड़ी जानकारियां।',
      contact: 'tips@centrallens.in',
      subtext: 'पूर्णतः गोपनीय एवं स्रोत सुरक्षित',
      badge: 'एन्क्रिप्टेड',
      badgeColor: 'bg-red-50 text-red-700 border-red-200',
    },
    {
      icon: FileCheck2,
      title: 'सुधार व शिकायत (Grievance Officer)',
      desc: 'समाचार में किसी त्रुटि का सुधार या विधिक शिकायत दर्ज करने हेतु।',
      contact: 'corrections@centrallens.in',
      subtext: 'डिजिटल मीडिया आचार संहिता अनुसार',
      badge: 'कानूनी अनुपालन',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      icon: MapPin,
      title: 'मुख्यालय ब्यूरो (New Delhi HQ)',
      desc: 'सेंट्रल लेंस मीडिया कॉर्पोरेशन, प्रेस एन्क्लेव।',
      contact: 'कनॉट प्लेस, नई दिल्ली - 110001, भारत',
      subtext: 'कार्य दिवस: सोमवार - शनिवार (10 AM - 7 PM)',
      badge: 'सेंट्रल ऑफिस',
      badgeColor: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    },
  ];

  const faqs = [
    {
      q: 'मैं किसी समाचार के संबंध में गोपनीय टिप कैसे साझा करूँ?',
      a: 'आप सीधे हमारी खोजी टीम को tips@centrallens.in पर ईमेल कर सकते हैं या नीचे दिए गए फॉर्म में "न्यूज़ टिप" विषय चुनकर भेज सकते हैं। हम स्रोत की पहचान पूर्ण रूप से गोपनीय रखते हैं।',
    },
    {
      q: 'यदि किसी खबर में कोई तथ्यात्मक त्रुटि हो तो क्या करें?',
      a: 'हम तुरंत सुधार नीति का पालन करते हैं। कृपया लेख का लिंक और प्रमाणित संदर्भ corrections@centrallens.in पर भेजें। हमारी संपादकीय टीम 12 घंटे में समीक्षा करेगी।',
    },
    {
      q: 'विज्ञापन या मीडिया पार्टनरशिप के लिए किससे संपर्क करें?',
      a: 'ब्रांड सहयोग, स्पॉन्सर्ड कवरेज या बैनर विज्ञापनों के लिए आप फॉर्म में "विज्ञापन व साझेदारी" चुन सकते हैं अथवा ads@centrallens.in पर संपर्क कर सकते हैं।',
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
            कोई समाचार टिप, संपादकीय प्रतिक्रिया या विज्ञापन साझेदारी? सेंट्रल लेंस की समर्पित टीम आपके प्रश्नों और सुझावों के लिए हमेशा तत्पर है।
          </p>
        </div>
      </section>

      {/* Main Content: Channels & Form */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Communication Channels */}
          <div className="lg:col-span-5 space-y-4">
            <div className="mb-2">
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider font-sans">
                सीधे चैनल
              </span>
              <h2 className="text-2xl font-black text-neutral-900 font-devanagari mt-1">
                विभागीय संपर्क सूत्र
              </h2>
            </div>

            <div className="space-y-3.5">
              {contactChannels.map((c, idx) => {
                const Icon = c.icon;
                return (
                  <div 
                    key={idx}
                    className="p-5 bg-white rounded-2xl border border-neutral-200/80 shadow-2xs hover:border-red-200 hover:shadow-xs transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors">
                          <Icon size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-neutral-900 text-sm font-devanagari">
                              {c.title}
                            </h3>
                          </div>
                          <p className="text-xs text-neutral-500 font-devanagari mt-0.5">
                            {c.desc}
                          </p>
                          <p className="text-sm font-bold text-red-600 font-sans mt-2 select-all">
                            {c.contact}
                          </p>
                          <p className="text-[11px] text-neutral-400 font-devanagari mt-0.5">
                            {c.subtext}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex-shrink-0 font-sans ${c.badgeColor}`}>
                        {c.badge}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Confidentiality Trust Box */}
            <div className="p-4 rounded-2xl bg-neutral-100/80 border border-neutral-200 flex items-start gap-3 mt-6">
              <ShieldCheck className="text-emerald-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-xs text-neutral-600 font-devanagari leading-relaxed">
                <strong className="text-neutral-900 font-bold block mb-0.5">स्रोत गोपनीयता की गारंटी:</strong>
                हम व्हिसलब्लोअर्स और समाचार सूत्रों की पहचान को कानून सम्मत सर्वोच्च सुरक्षा प्रदान करते हैं। आपकी व्यक्तिगत पहचान कभी उजागर नहीं की जाती।
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Send Message Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-6 sm:p-9 relative">
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full mb-2 font-devanagari">
                <Sparkles size={13} />
                <span>सीधा संदेश</span>
              </div>
              <h2 className="text-2xl font-black text-neutral-900 font-devanagari">
                संपादकीय टीम को संदेश भेजें
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 font-devanagari mt-1">
                नीचे दिया गया फॉर्म भरें, हमारी टीम यथाशीघ्र आपसे ईमेल या फ़ोन पर संपर्क करेगी।
              </p>
            </div>

            {submitted ? (
              <div className="py-12 px-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 size={32} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-emerald-950 font-devanagari">
                    संदेश सफलतापूर्वक प्राप्त हुआ!
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-700 font-devanagari max-w-md mx-auto">
                    धन्यवाद! आपका संदेश सेंट्रल लेंस की संबंधित संपादकीय टीम को प्रेषित कर दिया गया है। हम सामान्यतः 24 घंटे के भीतर उत्तर देते हैं।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-2xs font-devanagari cursor-pointer"
                >
                  अन्य संदेश भेजें
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-devanagari">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                      पूरा नाम (Full Name) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="उदा. राहुल शर्मा"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-neutral-900 text-sm focus:bg-white focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                      ईमेल पता (Email Address) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-neutral-900 text-sm focus:bg-white focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition font-sans"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                      फोन नंबर (वैकल्पिक / Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-neutral-900 text-sm focus:bg-white focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                      विषय (Topic / Subject) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-neutral-900 text-sm focus:bg-white focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition"
                    >
                      <option value="न्यूज़ टिप / समाचार सुझाव (News Tip)">न्यूज़ टिप / समाचार सुझाव (News Tip)</option>
                      <option value="तथ्य-जांच / सुधार का अनुरोध (Fact Check / Correction)">तथ्य-जांच / सुधार का अनुरोध (Fact Check / Correction)</option>
                      <option value="संपादकीय प्रतिक्रिया (Editorial Feedback)">संपादकीय प्रतिक्रिया (Editorial Feedback)</option>
                      <option value="विज्ञापन व साझेदारी (Advertising & Brand Partnership)">विज्ञापन व साझेदारी (Advertising & Brand Partnership)</option>
                      <option value="सामान्य पूछताछ (General Inquiry)">सामान्य पूछताछ (General Inquiry)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                    विस्तृत विवरण / संदेश (Message) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="अपना समाचार, विवरण या प्रश्न यहाँ साझा करें..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-neutral-900 text-sm focus:bg-white focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition font-sans"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-md shadow-red-600/20 hover:shadow-lg transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-60 cursor-pointer"
                  >
                    <span>{loading ? 'प्रेषित किया जा रहा है...' : 'संदेश भेजें (Send Message)'}</span>
                    <Send size={16} />
                  </button>
                </div>
              </form>
            )}
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

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-200/70 space-y-1.5"
              >
                <div className="flex items-center gap-2 text-neutral-900">
                  <HelpCircle size={17} className="text-red-600 flex-shrink-0" />
                  <h3 className="font-bold text-sm font-devanagari">{faq.q}</h3>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600 font-devanagari leading-relaxed pl-6">
                  {faq.a}
                </p>
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
