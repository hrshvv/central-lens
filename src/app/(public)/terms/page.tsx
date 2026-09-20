import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  FileText, 
  Scale, 
  ShieldAlert, 
  Copyright, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Gavel
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'नियम व शर्तें (Terms of Service) | Central Lens',
  description: 'सेंट्रल लेंस के उपयोग के नियम, शर्तें, कॉपीराइट दिशानिर्देश और विधिक दायित्व। पोर्टल का उपयोग करने से पहले कृपया इन्हें ध्यानपूर्वक पढ़ें।',
};

export default function TermsOfServicePage() {
  const prohibitedActions = [
    'पोर्टल की सामग्री को बिना पूर्व लिखित अनुमति के व्यावसायिक रूप से पुनः प्रकाशित या वितरित करना।',
    'कमेंट या फीडबैक सेक्शन में अभद्र, भड़काऊ, असत्य या मानहानिकारक सामग्री पोस्ट करना।',
    'साइट की कार्यप्रणाली, सर्वर या सुरक्षा तंत्र में अनधिकृत हस्तक्षेप या डेटा स्क्रैपिंग करना।',
    'सेंट्रल लेंस के पत्रकारों, संपादकों या किसी अन्य व्यक्ति की पहचान का प्रतिरूपण (impersonation) करना।',
  ];

  return (
    <div className="min-h-screen bg-neutral-50/40 font-devanagari">
      {/* Header Banner */}
      <section className="bg-white border-b border-neutral-200/70 py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium font-sans">
            <Scale size={14} className="text-red-600" />
            <span>विधिक नियम व सेवा शर्तें</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight leading-tight">
            नियम व शर्तें{' '}
            <span className="text-neutral-500 font-sans font-normal text-2xl sm:text-3xl lg:text-4xl block sm:inline">
              (Terms of Service)
            </span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            सेंट्रल लेंस वेबसाइट और सेवाओं का उपयोग करने से पूर्व कृपया इन नियमों को ध्यानपूर्वक पढ़ें। पोर्टल का उपयोग इन शर्तों की पूर्ण स्वीकृति माना जाएगा।
          </p>

          <div className="flex items-center justify-center space-x-2 text-xs text-neutral-400 font-sans pt-2">
            <Clock size={13} />
            <span>अंतिम अद्यतन: सितंबर 2026 • संस्करण 2.1</span>
          </div>
        </div>
      </section>

      {/* Main Terms Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        
        {/* Section 1: Acceptance */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3">
          <div className="flex items-center space-x-2.5">
            <span className="w-1.5 h-5 bg-red-600 rounded-full inline-block flex-shrink-0" />
            <h2 className="text-xl font-bold text-neutral-900">
              1. शर्तों की स्वीकृति (Acceptance of Terms)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            <strong>Central Lens</strong> पर उपलब्ध किसी भी लेख, वीडियो, पॉडकास्ट या सेवा का उपभोग करके आप इन नियमों व शर्तों तथा हमारी गोपनीयता नीति से बाध्य होने की सहमति देते हैं। यदि आप इन शर्तों से सहमत नहीं हैं, तो कृपया पोर्टल का उपयोग न करें।
          </p>
        </section>

        {/* Section 2: Intellectual Property */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3">
          <div className="flex items-center space-x-2.5">
            <span className="w-1.5 h-5 bg-red-600 rounded-full inline-block flex-shrink-0" />
            <h2 className="text-xl font-bold text-neutral-900">
              2. बौद्धिक संपदा व कॉपीराइट (Intellectual Property Rights)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            सेंट्रल लेंस पर प्रकाशित समस्त मूल सामग्री — जिसमें समाचार लेख, विश्लेषण, वीडियो बुलेटिन, ग्राफिक्स, लोगो और सॉफ्टवेयर कोड शामिल हैं — सेंट्रल लेंस मीडिया नेटवर्क की विशिष्ट बौद्धिक संपदा हैं और भारतीय कॉपीराइट अधिनियम द्वारा संरक्षित हैं।
          </p>
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/60 text-xs text-neutral-700 space-y-1">
            <p><strong>उद्धरण नीति (Fair Use):</strong> आप समाचार या अध्ययन के प्रयोजन से उचित संदर्भ और सेंट्रल लेंस के मूल लिंक के साथ संक्षिप्त अंश उद्धृत कर सकते हैं। पूर्ण लेख की अनधिकृत कॉपी कानूनी अपराध है।</p>
          </div>
        </section>

        {/* Section 3: User Conduct & Community Guidelines */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2.5">
            <span className="w-1.5 h-5 bg-red-600 rounded-full inline-block flex-shrink-0" />
            <h2 className="text-xl font-bold text-neutral-900">
              3. उपयोगकर्ता आचरण व प्रतिबंध (User Conduct)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            हम अपने पाठकों के लिए एक स्वस्थ, सुरक्षित और विचारोत्तेजक लोकतांत्रिक मंच प्रदान करते हैं। निम्नलिखित गतिविधियों पर पूर्ण प्रतिबंध है:
          </p>

          <div className="space-y-2.5 pt-1">
            {prohibitedActions.map((action, idx) => (
              <div key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-neutral-600">
                <AlertTriangle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <span>{action}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Editorial Disclaimers */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3">
          <div className="flex items-center space-x-2.5">
            <span className="w-1.5 h-5 bg-red-600 rounded-full inline-block flex-shrink-0" />
            <h2 className="text-xl font-bold text-neutral-900">
              4. संपादकीय अस्वीकरण (Editorial Disclaimers)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            यद्यपि हम हर तथ्य को प्रकाशित करने से पहले कड़े सत्यापन से गुजारते हैं, डिजिटल समाचार का स्वभाव निरंतर विकसित होने वाला होता है। विचार-मंच (Op-Ed) और अतिथि लेखकों द्वारा व्यक्त किए गए विचार उनके व्यक्तिगत होते हैं, आवश्यक नहीं कि वे सेंट्रल लेंस के संपादकीय रुख से मेल खाते हों।
          </p>
        </section>

        {/* Section 5: Jurisdiction & Governing Law */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3">
          <div className="flex items-center space-x-2.5">
            <span className="w-1.5 h-5 bg-red-600 rounded-full inline-block flex-shrink-0" />
            <h2 className="text-xl font-bold text-neutral-900">
              5. क्षेत्राधिकार व लागू कानून (Governing Law)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            ये नियम व शर्तें भारत के कानूनों के अनुसार शासित और व्याख्यायित होंगे। इस मंच या सेवाओं से संबंधित किसी भी विवाद के समाधान का अनन्य क्षेत्राधिकार नई दिल्ली स्थित सक्षम न्यायालयों के अधीन होगा।
          </p>
        </section>

        {/* Section 6: Contact & Questions Card */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-3 text-neutral-900">
          <div className="flex items-center space-x-2">
            <Gavel size={18} className="text-red-600" />
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
              कानूनी व संपादकीय परामर्श (Legal Desk)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            नियम व शर्तों या किसी सामग्री के संबंध में किसी भी विधिक स्पष्टीकरण के लिए हमारी विधिक टीम से संपर्क करें:
          </p>
          <p className="text-xs text-neutral-700 font-sans">
            ईमेल: <a href="mailto:legal@centrallens.in" className="text-red-600 font-semibold hover:underline">legal@centrallens.in</a> / <a href="mailto:editorial@centrallens.in" className="text-red-600 font-semibold hover:underline">editorial@centrallens.in</a>
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/privacy"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 px-4 py-2 rounded-lg transition"
            >
              <span>गोपनीयता नीति पढ़ें</span>
              <ArrowRight size={13} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition shadow-2xs"
            >
              <span>हमसे संपर्क करें</span>
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
