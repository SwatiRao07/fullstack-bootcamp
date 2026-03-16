'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

/**
 * Drill 4: Standard Error Boundary
 * This handles errors for pages outside the root layout.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in production
    if (process.env.NODE_ENV === 'production') {
      console.error('Page error logged:', error);
    }
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-amber-100 text-amber-600 rounded-full text-3xl">
        Oops!
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        An error occurred
      </h2>
      <p className="text-slate-600 mb-8 max-w-sm mx-auto">
        Something went wrong while displaying this page. We've been notified and are looking into it.
      </p>
      
      <div className="flex gap-4">
        <Button
          onClick={reset}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-12 rounded-xl transition-all"
        >
          Try Again
        </Button>
        <Button
          asChild
          variant="outline"
          className="px-8 h-12 rounded-xl border-slate-200 hover:bg-slate-50"
        >
          <Link href="/">Return Home</Link>
        </Button>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <div className="mt-12 p-4 bg-slate-50 rounded-lg text-left overflow-auto max-w-2xl w-full text-xs font-mono text-slate-500 border border-slate-100">
          <p className="font-bold border-b border-slate-200 pb-2 mb-2 text-red-600">Development Debug Info:</p>
          {error.message}
          <br /><br />
          {error.stack}
        </div>
      )}
    </div>
  );
}
