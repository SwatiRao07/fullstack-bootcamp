"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="text-5xl mb-4">⚠️</span>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">
        Something went wrong
      </h2>
      <p className="text-slate-500 mb-2 max-w-sm">
        An unexpected error occurred while loading the tasks section.
      </p>
      {/* Optional: show error message in development */}
      {process.env.NODE_ENV === "development" && (
        <p className="text-xs text-red-400 font-mono bg-red-50 px-3 py-2 rounded mb-6 max-w-md break-all">
          {error.message}
        </p>
      )}
      <button
        onClick={reset}
        className="mt-4 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
