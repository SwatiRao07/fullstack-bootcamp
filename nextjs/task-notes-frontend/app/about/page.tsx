import type { Metadata } from "next";
import Link from "next/link";

// Drill 6 – Static Metadata
export const metadata: Metadata = {
  title: "About - Task Notes App",
  description: "Learn about the Task Notes App and the technologies behind it.",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-extrabold text-slate-800 mb-4 tracking-tight">
        About Task Notes
      </h1>

      <p className="text-slate-600 leading-relaxed mb-6">
        <strong>Task Notes</strong> is a personal task management application
        built as part of a full-stack bootcamp project. Its purpose is to
        explore the features of the{" "}
        <span className="font-semibold text-indigo-600">
          Next.js App Router
        </span>{" "}
         including file-based routing, layouts, dynamic routes, error
        boundaries, loading states, and SEO metadata.
      </p>

      {/* Technology Table */}
      <h2 className="text-xl font-bold text-slate-700 mb-3">Tech Stack</h2>
      <div className="overflow-hidden rounded-xl border border-slate-200 mb-8">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Layer</th>
              <th className="px-4 py-3">Technology</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              ["Framework", "Next.js 16 (App Router)"],
              ["Language", "TypeScript"],
              ["Styling", "Tailwind CSS v4"],
              ["Icons", "Lucide React"],
              ["Runtime", "Node.js"],
            ].map(([layer, tech]) => (
              <tr key={layer} className="bg-white hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-700">
                  {layer}
                </td>
                <td className="px-4 py-3 text-slate-500">{tech}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
