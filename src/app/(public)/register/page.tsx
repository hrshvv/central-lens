'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User as UserIcon, 
  Mail, 
  Lock, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  UserPlus, 
  ArrowLeft, 
  ShieldCheck 
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('कृपया अपना पूरा नाम दर्ज करें');
      return;
    }

    if (!email.trim()) {
      setError('कृपया मान्य ईमेल पता दर्ज करें');
      return;
    }

    if (password.length < 6) {
      setError('पासवर्ड कम से कम 6 अक्षरों का होना चाहिए');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'पंजीकरण विफल रहा। कृपया पुनः प्रयास करें।');
      }

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] py-6 sm:py-10 px-4 sm:px-6 flex flex-col justify-center items-center bg-gradient-to-b from-neutral-100/70 via-neutral-50 to-white relative overflow-hidden">
      {/* Subtle brand glow backdrop */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[300px] bg-red-100/40 rounded-full blur-3xl pointer-events-none -z-10" 
        aria-hidden="true" 
      />

      <div className="w-full max-w-[430px]">
        {/* Back Link */}
        <div className="mb-3">
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-red-600 transition-colors"
          >
            <ArrowLeft size={13} />
            <span>मुख्य पृष्ठ पर वापस जाएं (Back to Home)</span>
          </Link>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl shadow-neutral-900/5 border border-neutral-200 overflow-hidden relative transition-all duration-300">
          {/* Top Brand Stripe */}
          <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-red-500 to-amber-500" />

          <div className="p-6 sm:p-7">
            {/* Header / Logo */}
            <div className="text-center mb-6">
              <Link href="/" className="inline-flex items-center gap-2 group mb-2.5">
                <img 
                  src="https://res.cloudinary.com/idhgjmqi/image/upload/v1789294779/Central_Lens_Logo_Transparent_1.png" 
                  alt="Central Lens Logo" 
                  className="h-9 w-9 object-contain transform group-hover:scale-105 transition-transform"
                />
                <div className="flex flex-col text-left">
                  <span className="text-xl font-black text-neutral-900 tracking-tight leading-none font-sans">
                    CENTRAL <span className="text-red-600 group-hover:text-red-700 transition-colors">LENS</span>
                  </span>
                  <span className="text-[10px] font-medium text-neutral-500 tracking-normal font-devanagari mt-0.5">
                    सत्य, सटीकता और निष्पक्ष पत्रकारिता
                  </span>
                </div>
              </Link>

              <h1 className="text-2xl font-black text-neutral-900 tracking-tight font-devanagari">
                नया खाता बनाएं
              </h1>
              <p className="text-xs text-neutral-500 mt-1 font-devanagari">
                सेंट्रल लेंस से जुड़कर निष्पक्ष पत्रकारिता का अनुभव करें
              </p>
            </div>

            {/* Error Notification Banner */}
            {error && (
              <div 
                className="mb-6 p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-900 flex items-start gap-2.5 text-sm transition-all"
                role="alert"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
                <div className="flex-1 text-left text-xs leading-relaxed">
                  <span className="font-bold block text-[11px] uppercase tracking-wider mb-0.5 text-red-700">
                    पंजीकरण त्रुटि (Registration Error)
                  </span>
                  <span className="font-medium text-neutral-800">{error}</span>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-neutral-700 block tracking-wide">
                  पूरा नाम <span className="text-neutral-400 font-normal">(Full Name)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <UserIcon className="h-4.5 w-4.5 text-neutral-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 bg-neutral-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                    placeholder="आपका नाम"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-neutral-700 block tracking-wide">
                  ईमेल पता <span className="text-neutral-400 font-normal">(Email Address)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4.5 w-4.5 text-neutral-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 bg-neutral-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-neutral-700 block tracking-wide">
                  पासवर्ड <span className="text-neutral-400 font-normal">(Password, min 6 characters)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4.5 w-4.5 text-neutral-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2.5 text-sm border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 bg-neutral-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
                    placeholder="कम से कम 6 अक्षर"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-md shadow-red-600/25 hover:shadow-lg hover:shadow-red-600/35 active:scale-[0.99] disabled:opacity-70 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="font-devanagari">खाता तैयार हो रहा है...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    <span className="font-devanagari">खाता बनाएं (Register)</span>
                  </>
                )}
              </button>
            </form>

            {/* Switch to Login */}
            <div className="mt-7 pt-5 border-t border-neutral-100 text-center">
              <p className="text-xs text-neutral-600 font-devanagari">
                क्या आपके पास पहले से खाता है?{' '}
                <Link 
                  href="/login" 
                  className="font-bold text-red-600 hover:text-red-700 hover:underline transition-colors ml-1"
                >
                  लॉगिन करें (Sign In)
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom Security Footer */}
          <div className="bg-neutral-50 px-6 py-3 border-t border-neutral-100 flex items-center justify-center gap-2 text-[11px] text-neutral-500">
            <ShieldCheck size={14} className="text-emerald-600 flex-shrink-0" />
            <span>256-बिट सुरक्षित एवं एन्क्रिप्टेड क्रेडेंशियल्स</span>
          </div>
        </div>
      </div>
    </div>
  );
}

