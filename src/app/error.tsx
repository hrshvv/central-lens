'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 font-devanagari">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-50 text-amber-600 shadow-sm border border-amber-100">
          <AlertTriangle size={36} />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900">
            कुछ गलत हो गया (Something Went Wrong)
          </h1>
          <p className="text-sm text-neutral-500 leading-relaxed">
            सर्वर पर सामग्री लोड करने में समस्या आई है। कृपया पुनः प्रयास करें।
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            <RefreshCw size={15} />
            <span>पुनः लोड करें (Try Again)</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-colors"
          >
            <Home size={15} />
            <span>होमपेज</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
