'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

/**
 * Drill 4: Global Error Boundary
 * This handles errors that occur in the root layout.
 * It must define its own <html> and <body> tags.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to external service in production
    if (process.env.NODE_ENV === 'production') {
      console.error('Global production error:', error);
      // Here you would typically send the error to Sentry, LogRocket, etc.
    } else {
      console.error('Global development error:', error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="max-w-md w-full text-center bg-white rounded-2xl border border-slate-200 shadow-xl p-8">
            <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full text-3xl">
              ⚠️
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
              Critical Error!
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              We're sorry, but something unexpected happened at the root level. 
              Our monitoring system has been notified.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                onClick={reset}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-6 rounded-xl transition-all shadow-md"
              >
                Try Again
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full font-medium py-6 rounded-xl border-slate-200 hover:bg-slate-50"
              >
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-slate-50 rounded-lg text-left overflow-auto max-h-48 text-xs font-mono text-slate-500 border border-slate-100">
                {error.message}
                <br />
                {error.stack}
              </div>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
