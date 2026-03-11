export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Page title skeleton */}
      <div className="h-9 bg-slate-200 rounded-lg mb-3 w-1/3"></div>
      <div className="h-4 bg-slate-200 rounded mb-8 w-1/4"></div>

      {/* Task card skeletons */}
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-start gap-4 bg-white rounded-2xl border border-slate-200 p-5"
          >
            <div className="mt-1 h-5 w-5 rounded-full bg-slate-200 shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-2/3"></div>
              <div className="h-3 bg-slate-100 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
