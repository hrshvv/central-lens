'use client';

import { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    // Simulate submission / mail routing
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 min-h-screen font-devanagari">
      <div className="text-center mb-16">
        <span className="text-xs font-bold text-red-600 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full">
          संपर्क सूत्र
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-neutral-900 mt-4 mb-4">
          हमसे संपर्क करें (Contact Us)
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto font-sans">
          कोई समाचार या सुझाव साझा करना चाहते हैं? हमारी संपादकीय टीम से सीधे संपर्क करें।
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Contact Information */}
        <div className="space-y-8 bg-neutral-50 p-8 rounded-3xl border border-neutral-200/70">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">संपर्क विवरण</h2>
            <div className="space-y-6 font-sans">
              <div className="flex items-start space-x-4">
                <div className="bg-red-100 p-3 rounded-2xl text-red-600 flex-shrink-0">
                  <Mail size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 font-devanagari">ईमेल (Editorial & News Desk)</h3>
                  <p className="text-sm text-neutral-600">editorial@centrallens.in</p>
                  <p className="text-sm text-neutral-600">support@centrallens.in</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-red-100 p-3 rounded-2xl text-red-600 flex-shrink-0">
                  <MapPin size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 font-devanagari">कार्यालय (Headquarters)</h3>
                  <p className="text-sm text-neutral-600 font-devanagari">
                    Central Lens Media, प्रेस एवेन्यू<br />
                    नई दिल्ली - 110001, भारत
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200/80 p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">संदेश भेजें</h2>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-emerald-900">संदेश प्राप्त हुआ!</h3>
              <p className="text-xs text-emerald-700 font-sans">
                धन्यवाद! आपका संदेश हमारी संपादकीय टीम को भेज दिया गया है। हम शीघ्र ही आपसे संपर्क करेंगे।
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs font-bold text-emerald-800 underline"
              >
                दूसरा संदेश भेजें
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  पूरा नाम (Full Name) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-red-500 focus:outline-none text-sm font-sans"
                  placeholder="आपका नाम"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  ईमेल पता (Email) *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-red-500 focus:outline-none text-sm font-sans"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">विषय (Subject)</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-red-500 focus:outline-none bg-white text-sm font-sans"
                >
                  <option value="General Inquiry">सामान्य पूछताछ (General Inquiry)</option>
                  <option value="Editorial Pitch">समाचार सुझाव / टिप (Editorial Pitch)</option>
                  <option value="Feedback">प्रतिक्रिया (Feedback)</option>
                  <option value="Advertising">विज्ञापन / स्पॉन्सरशिप (Advertising)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  संदेश (Message) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-red-500 focus:outline-none text-sm font-sans"
                  placeholder="अपना संदेश यहाँ लिखें..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
              >
                <span>{loading ? 'भेजा जा रहा है...' : 'संदेश भेजें (Send Message)'}</span>
                <Send size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
