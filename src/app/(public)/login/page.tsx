'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Mail, 
  Lock, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  LogIn, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2,
  Sparkles 
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [errorField, setErrorField] = useState<'email' | 'password' | 'general' | null>(null);
  const [loading, setLoading] = useState(false);

  // If user is already logged in, auto-redirect
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          if (data.user.role === 'admin' || data.user.role === 'editor') {
            router.replace('/admin');
          } else {
            router.replace('/');
          }
        }
      })
      .catch(() => {});
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrorField(null);

    // Client-side quick checks
    if (!email.trim()) {
      setError('कृपया अपना ईमेल पता दर्ज करें (Please enter your email)');
      setErrorField('email');
      return;
    }

    if (!password) {
      setError('कृपया अपना पासवर्ड दर्ज करें (Please enter your password)');
      setErrorField('password');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'लॉगिन विफल रहा। कृपया पुनः प्रयास करें।');
        setErrorField(data.field || 'general');
        return;
      }

      // If user is admin or editor, redirect to CMS, else to home
      if (data.user?.role === 'admin' || data.user?.role === 'editor') {
        router.push('/admin');
      } else {
        router.push('/');
      }
      router.refresh();
    } catch (err: any) {
      setError('सर्वर से संपर्क करने में असमर्थ। कृपया थोड़ी देर बाद पुनः प्रयास करें।');
      setErrorField('general');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (errorField === 'email') {
      setError('');
      setErrorField(null);
    }
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (errorField === 'password') {
      setError('');
      setErrorField(null);
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
                  <span className="text-xl font-black text-red-600 tracking-tight leading-none group-hover:text-red-700 transition-colors">
                    CENTRAL LENS
                  </span>
                  <span className="text-[9px] font-bold text-neutral-500 tracking-[0.2em] uppercase mt-0.5">
                    निष्पक्ष पत्रकारिता
                  </span>
                </div>
              </Link>

              <h1 className="text-2xl font-black text-neutral-900 tracking-tight font-devanagari">
                अकाउंट में लॉगिन करें
              </h1>
              <p className="text-xs text-neutral-500 mt-1 font-devanagari">
                संपादकीय विश्लेषण, बुकमार्क और एक्सक्लूसिव रिपोर्ट्स तक पहुंचें
              </p>
            </div>

            {/* Error Notification Banner */}
            {error && (
              <div 
                className={`mb-6 p-3.5 rounded-xl border flex items-start gap-2.5 text-sm transition-all duration-200 ${
                  errorField === 'password'
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-red-50 border-red-200 text-red-900'
                }`}
                role="alert"
              >
                <AlertCircle 
                  className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    errorField === 'password' ? 'text-amber-600' : 'text-red-600'
                  }`} 
                />
                <div className="flex-1 text-left text-xs leading-relaxed">
                  <span className="font-bold block text-[11px] uppercase tracking-wider mb-0.5">
                    {errorField === 'password' 
                      ? 'गलत पासवर्ड (Incorrect Password)' 
                      : errorField === 'email' 
                      ? 'अमान्य ईमेल (Email Not Found)' 
                      : 'लॉगिन त्रुटि (Login Error)'}
                  </span>
                  <span className="font-medium text-neutral-800">{error}</span>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4.5">
              {/* Email Input */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-neutral-700 block tracking-wide">
                  ईमेल पता <span className="text-neutral-400 font-normal">(Email Address)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail 
                      className={`h-4.5 w-4.5 transition-colors ${
                        errorField === 'email' ? 'text-red-500' : 'text-neutral-400'
                      }`} 
                    />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    className={`block w-full pl-10 pr-3.5 py-2.5 text-sm border rounded-xl text-neutral-900 placeholder-neutral-400 transition-all outline-none ${
                      errorField === 'email'
                        ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/20 focus:border-red-600 focus:ring-red-500/30'
                        : 'border-neutral-200 focus:border-red-600 focus:ring-2 focus:ring-red-500/20 bg-neutral-50/30 focus:bg-white'
                    }`}
                    placeholder="name@example.com"
                    autoComplete="email"
                  />
                </div>
                {errorField === 'email' && (
                  <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 mt-1">
                    <AlertCircle size={12} className="flex-shrink-0" />
                    <span>ईमेल आईडी जांचें या नया खाता बनाएं</span>
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-700 block tracking-wide">
                    पासवर्ड <span className="text-neutral-400 font-normal">(Password)</span>
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock 
                      className={`h-4.5 w-4.5 transition-colors ${
                        errorField === 'password' ? 'text-red-500' : 'text-neutral-400'
                      }`} 
                    />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className={`block w-full pl-10 pr-10 py-2.5 text-sm border rounded-xl text-neutral-900 placeholder-neutral-400 transition-all outline-none ${
                      errorField === 'password'
                        ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/20 focus:border-red-600 focus:ring-red-500/30'
                        : 'border-neutral-200 focus:border-red-600 focus:ring-2 focus:ring-red-500/20 bg-neutral-50/30 focus:bg-white'
                    }`}
                    placeholder="••••••••"
                    autoComplete="current-password"
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
                {errorField === 'password' && (
                  <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 mt-1">
                    <AlertCircle size={12} className="flex-shrink-0" />
                    <span>गलत पासवर्ड दर्ज किया गया है। कृपया दोबारा जांचें।</span>
                  </p>
                )}
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
                    <span className="font-devanagari">सत्यापित हो रहा है...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={16} />
                    <span className="font-devanagari">लॉगिन करें (Sign In)</span>
                  </>
                )}
              </button>
            </form>

            {/* Switch to Register */}
            <div className="mt-7 pt-5 border-t border-neutral-100 text-center">
              <p className="text-xs text-neutral-600 font-devanagari">
                क्या आपका खाता नहीं है?{' '}
                <Link 
                  href="/register" 
                  className="font-bold text-red-600 hover:text-red-700 hover:underline transition-colors ml-1"
                >
                  नया खाता बनाएं (Sign Up)
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

