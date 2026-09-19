import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 font-devanagari">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-red-50 text-red-600 font-black text-3xl shadow-sm border border-red-100">
          404
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900">
            पृष्ठ नहीं मिला (Page Not Found)
          </h1>
          <p className="text-sm text-neutral-500 leading-relaxed">
            क्षमा करें, जिस पृष्ठ या समाचार को आप खोज रहे हैं, वह हटा दिया गया है या उसका पता बदल गया है।
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Home size={16} />
            <span>मुख्य पृष्ठ पर जाएं</span>
          </Link>

          <Link
            href="/search"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-colors"
          >
            <Search size={16} />
            <span>समाचार खोजें</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
