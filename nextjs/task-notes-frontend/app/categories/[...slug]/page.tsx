interface CategoriesPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  const { slug } = await params;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">
        Categories
      </h1>

      {/* Breadcrumb path from slug segments */}
      <div className="flex items-center gap-2 flex-wrap mb-8">
        <span className="text-slate-400 text-sm">Path:</span>
        {slug.map((segment, index) => (
          <span key={index} className="flex items-center gap-2">
            {index > 0 && <span className="text-slate-300">›</span>}
            <span className="bg-indigo-50 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full border border-indigo-200">
              {segment}
            </span>
          </span>
        ))}
      </div>

      {/* Info panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-700 mb-3">
          Catch-All Route Demo
        </h2>
        <p className="text-slate-500 text-sm mb-4 leading-relaxed">
          This page is rendered by{" "}
          <code className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono text-xs">
            app/categories/[...slug]/page.tsx
          </code>
          . It captures all URL segments after{" "}
          <code className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono text-xs">
            /categories/
          </code>{" "}
          as an array.
        </p>

        {/* Raw slug data */}
        <div className="bg-slate-50 rounded-xl p-4 font-mono text-xs text-slate-600">
          <span className="text-slate-400">params.slug =</span>{" "}
          {JSON.stringify(slug, null, 2)}
        </div>
      </div>

      {/* Example links */}
      <div className="mt-8">
        <p className="text-sm font-medium text-slate-500 mb-3">
          Try other paths:
        </p>
        <div className="flex flex-wrap gap-3">
          {[
            "/categories/work",
            "/categories/work/design",
            "/categories/personal/health/fitness",
          ].map((path) => (
            <a
              key={path}
              href={path}
              className="text-sm text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 hover:border-indigo-300 transition-all font-mono"
            >
              {path}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
