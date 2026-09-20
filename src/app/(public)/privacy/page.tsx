import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  FileText, 
  UserCheck, 
  Mail, 
  Clock,
  ArrowRight,
  Database,
  CheckCircle2
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'गोपनीयता नीति (Privacy Policy) | Central Lens',
  description: 'सेंट्रल लेंस की डेटा सुरक्षा और गोपनीयता नीति। जानिए हम आपकी व्यक्तिगत जानकारी को कैसे सुरक्षित और संरक्षित रखते हैं।',
};

export default function PrivacyPolicyPage() {
  const dataTypes = [
    {
      title: 'पहचान संबंधी डेटा (Identity Data)',
      desc: 'नाम, यूज़रनेम, प्रोफाइल विवरण (यदि आप हमारे मंच पर पंजीकृत हैं)।',
    },
    {
      title: 'संपर्क विवरण (Contact Details)',
      desc: 'ईमेल पता, न्यूज़लेटर प्राथमिकताएं, और स्वेच्छा से प्रदान किया गया फ़ोन नंबर।',
    },
    {
      title: 'तकनीकी जानकारी (Technical & Log Data)',
      desc: 'आईपी एड्रेस, ब्राउज़र प्रकार, डिवाइस का प्रकार और सुरक्षा लॉग्स।',
    },
    {
      title: 'उपयोग एवं प्राथमिकताएं (Usage Information)',
      desc: 'पढ़े गए लेख, बुकमार्क, पसंदीदा श्रेणियां और साइट पर बिताया गया समय।',
    },
  ];

  const userRights = [
    'अपनी व्यक्तिगत जानकारी की प्रति प्राप्त करने का अधिकार।',
    'अपूर्ण या गलत डेटा में सुधार का अनुरोध करने का अधिकार।',
    'अपने खाते और उससे संबंधित डेटा को स्थायी रूप से हटाने का अधिकार।',
    'किसी भी समय न्यूज़लेटर और प्रचार ईमेल से अनसब्सक्राइब करने की स्वतंत्रता।',
  ];

  return (
    <div className="min-h-screen bg-neutral-50/40 font-devanagari">
      {/* Header Banner */}
      <section className="bg-white border-b border-neutral-200/70 py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium font-sans">
            <ShieldCheck size={14} className="text-red-600" />
            <span>डेटा सुरक्षा &amp; गोपनीयता नीति</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight leading-tight">
            गोपनीयता नीति{' '}
            <span className="text-neutral-500 font-sans font-normal text-2xl sm:text-3xl lg:text-4xl block sm:inline">
              (Privacy Policy)
            </span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            सेंट्रल लेंस आपके निजता के अधिकार का सम्मान करता है। हम भारत के डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम (DPDP Act) के तहत आपकी जानकारी की सुरक्षा के लिए प्रतिबद्ध हैं।
          </p>

          <div className="flex items-center justify-center space-x-2 text-xs text-neutral-400 font-sans pt-2">
            <Clock size={13} />
            <span>अंतिम अद्यतन: सितंबर 2026 • संस्करण 2.1</span>
          </div>
        </div>
      </section>

      {/* Main Policy Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        
        {/* Section 1: Introduction */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3">
          <div className="flex items-center space-x-2.5">
            <span className="w-1.5 h-5 bg-red-600 rounded-full inline-block flex-shrink-0" />
            <h2 className="text-xl font-bold text-neutral-900">
              1. परिचय एवं उद्देश्य (Introduction)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            यह गोपनीयता नीति बताती है कि जब आप <strong>Central Lens</strong> वेबसाइट (centrallens.in) या हमारी किसी भी डिजिटल सेवा का उपयोग करते हैं, तो हम आपकी सूचनाओं को कैसे एकत्र, उपयोग, संग्रहीत और सुरक्षित रखते हैं। हमारी नीति निष्पक्ष, पारदर्शी और पाठक-केंद्रित पत्रकारिता के सिद्धांतों के अनुकूल तैयार की गई है।
          </p>
        </section>

        {/* Section 2: The Data We Collect */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2.5">
            <span className="w-1.5 h-5 bg-red-600 rounded-full inline-block flex-shrink-0" />
            <h2 className="text-xl font-bold text-neutral-900">
              2. हमारे द्वारा एकत्र की जाने वाली जानकारी (Data We Collect)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            हम केवल वही जानकारी एकत्र करते हैं जो आपको बेहतर समाचार अनुभव देने, सुरक्षा बनाए रखने और कानूनी दायित्वों के निर्वहन के लिए आवश्यक है:
          </p>

          <div className="grid sm:grid-cols-2 gap-3.5 pt-1">
            {dataTypes.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-neutral-50/70 border border-neutral-200/60 space-y-1">
                <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: How We Use Your Data */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3">
          <div className="flex items-center space-x-2.5">
            <span className="w-1.5 h-5 bg-red-600 rounded-full inline-block flex-shrink-0" />
            <h2 className="text-xl font-bold text-neutral-900">
              3. जानकारी का उपयोग कैसे किया जाता है (How We Use Data)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            हम आपके डेटा का उपयोग निम्नलिखित उद्देश्यों के लिए करते हैं:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-neutral-600 pl-4 list-disc marker:text-red-600">
            <li>सत्यापित समाचार, संपादकीय विश्लेषण और वीडियो बुलेटिन आप तक सुचारू रूप से पहुंचाना।</li>
            <li>आपकी रुचि के अनुसार समाचार प्राथमिकताएं और स्थानीय संस्करण (Edition) प्रदर्शित करना।</li>
            <li>दैनिक संपादकीय न्यूज़लेटर और महत्वपूर्ण ब्रेकिंग न्यूज़ अलर्ट्स भेजना (यदि आपने अनुमति दी हो)।</li>
            <li>सुरक्षा जांच, स्पैम रोकथाम और साइबर खतरों से डिजिटल बुनियादी ढांचे की रक्षा करना।</li>
          </ul>
          <div className="mt-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/60 text-xs text-neutral-700">
            <strong>महत्वपूर्ण:</strong> सेंट्रल लेंस किसी भी परिस्थिति में अपने पाठकों का व्यक्तिगत डेटा किसी तीसरे पक्ष या विज्ञापन कंपनियों को नहीं बेचता है।
          </div>
        </section>

        {/* Section 4: Source & Whistleblower Protection */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3">
          <div className="flex items-center space-x-2.5">
            <span className="w-1.5 h-5 bg-red-600 rounded-full inline-block flex-shrink-0" />
            <h2 className="text-xl font-bold text-neutral-900">
              4. समाचार सूत्रों व व्हिसलब्लोअर्स की सुरक्षा (Source Protection)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            खोजी पत्रकारिता में गोपनीयता की रक्षा हमारा सर्वोच्च सिद्धांत है। यदि आप हमारी संपादकीय टीम को कोई गोपनीय दस्तावेज या टिप साझा करते हैं, तो आपकी पहचान को उच्चतम एन्क्रिप्शन और पेशेवर पत्रकारिता विशेषाधिकार के तहत पूरी तरह गोपनीय रखा जाता है।
          </p>
        </section>

        {/* Section 5: Your Rights */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2.5">
            <span className="w-1.5 h-5 bg-red-600 rounded-full inline-block flex-shrink-0" />
            <h2 className="text-xl font-bold text-neutral-900">
              5. आपके अधिकार (Your Privacy Rights)
            </h2>
          </div>
          <div className="space-y-2">
            {userRights.map((right, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-neutral-600">
                <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{right}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: Grievance Officer & Contact */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-3 text-neutral-900">
          <div className="flex items-center space-x-2">
            <ShieldCheck size={18} className="text-red-600" />
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
              शिकायत निवारण अधिकारी (Grievance Officer)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            डिजिटल मीडिया आचार संहिता और डेटा संरक्षण नियमों के तहत यदि आपको किसी डेटा या गोपनीयता संबंधी मामले में शिकायत है, तो आप सीधे हमारे नामित अधिकारी से संपर्क कर सकते हैं:
          </p>
          <div className="pt-2 text-xs space-y-1.5 text-neutral-700 font-sans">
            <p><strong className="text-neutral-900">अधिकारी:</strong> शिकायत निवारण प्रकोष्ठ (Grievance Desk)</p>
            <p><strong className="text-neutral-900">ईमेल:</strong> <a href="mailto:privacy@centrallens.in" className="text-red-600 font-semibold hover:underline">privacy@centrallens.in</a></p>
            <p><strong className="text-neutral-900">पता:</strong> Central Lens Media, प्रेस एन्क्लेव, कनॉट प्लेस, नई दिल्ली - 110001</p>
          </div>
          <div className="pt-3">
            <Link
              href="/contact"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition shadow-2xs"
            >
              <span>संपर्क डेस्क पर जाएं</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
