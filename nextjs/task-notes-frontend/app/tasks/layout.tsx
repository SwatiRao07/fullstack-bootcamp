// Drill 3 – Nested Layout for /tasks/**
export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Section label bar */}
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-200">
        <span className="text-2xl">📋</span>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Section
          </h2>
          <p className="text-slate-700 font-semibold text-lg leading-tight">
            Tasks
          </p>
        </div>
      </div>

      {/* Nested page content */}
      {children}
    </div>
  );
}
