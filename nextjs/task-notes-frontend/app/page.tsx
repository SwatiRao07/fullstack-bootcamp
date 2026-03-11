import type { Metadata } from "next";
import Link from "next/link";

// Drill 6 – Static Metadata
export const metadata: Metadata = {
  title: "Task Notes App",
  description:
    "Personal task management application to organise your daily tasks and notes.",
};

export default function HomePage() {
  return (
    <div className="py-16">
      {/* Hero */}
      <section className="text-center mb-14">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">
          Welcome to <span className="text-indigo-600">Task Notes</span> 
        </h1>
        <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
          A simple, clean task management application to keep your work
          organised. Add tasks, track progress, and stay on top of your day.
        </p>
      </section>

      {/* Quick Navigation Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <Link
          href="/tasks"
          className="group flex flex-col gap-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200"
        >
          {/* <span className="text-3xl">✅</span> */}
          <h2 className="text-xl font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
            View Tasks
          </h2>
          <p className="text-slate-500 text-sm">
            Browse all your tasks and open individual task details.
          </p>
        </Link>

        <Link
          href="/about"
          className="group flex flex-col gap-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200"
        >
          {/* <span className="text-3xl">ℹ️</span> */}
          <h2 className="text-xl font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
            About
          </h2>
          <p className="text-slate-500 text-sm">
            Learn more about this application and how it was built.
          </p>
        </Link>
      </section>
    </div>
  );
}
