export default function TasksLoading() {
  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="animate-pulse space-y-8">
        {/* Header skeleton matching TasksPage layout */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <div className="h-9 bg-slate-200 rounded-lg w-48"></div>
            <div className="h-4 bg-slate-100 rounded w-32"></div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="h-10 bg-slate-200 rounded-xl w-full md:w-64"></div>
            <div className="h-10 bg-slate-200 rounded-xl w-32 shrink-0"></div>
          </div>
        </div>

        {/* Task list skeleton */}
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i} 
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <div className="h-6 bg-slate-200 rounded w-1/2"></div>
                <div className="h-5 bg-slate-100 rounded-full w-20"></div>
              </div>
              <div className="h-4 bg-slate-100 rounded w-3/4"></div>
              <div className="pt-2 border-t border-slate-50 flex justify-between items-center">
                <div className="h-4 bg-slate-50 rounded w-24"></div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-slate-100 rounded-lg"></div>
                  <div className="h-8 w-8 bg-slate-100 rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
