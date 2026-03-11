import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const SAMPLE_TASKS = [
  {
    id: "1",
    title: "Set up Next.js project",
    description: "Initialise the task-notes-frontend project with App Router.",
    status: "done",
    priority: "high",
    createdAt: "2026-01-10",
  },
  {
    id: "2",
    title: "Implement file-based routing",
    description:
      "Create pages for home, about, and tasks using the app/ directory.",
    status: "done",
    priority: "high",
    createdAt: "2026-01-11",
  },
  {
    id: "3",
    title: "Build shared layouts",
    description:
      "Add a root layout with header, nav, and footer plus a nested tasks layout.",
    status: "in-progress",
    priority: "medium",
    createdAt: "2026-01-12",
  },
  {
    id: "4",
    title: "Add dynamic routes",
    description: "Create [id] pages and catch-all category routes.",
    status: "in-progress",
    priority: "medium",
    createdAt: "2026-01-13",
  },
  {
    id: "5",
    title: "Error handling & loading states",
    description:
      "Add error.tsx, loading.tsx, and not-found.tsx to the tasks segment.",
    status: "todo",
    priority: "low",
    createdAt: "2026-01-14",
  },
];

function getTask(id: string) {
  return SAMPLE_TASKS.find((t) => t.id === id) ?? null;
}

// Dynamic Metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const task = getTask(id);

  if (!task) {
    return {
      title: "Task Not Found - Task Notes App",
      description: "This task could not be found.",
    };
  }

  return {
    title: `Task ${id}: ${task.title} - Task Notes App`,
    description: task.description,
    openGraph: {
      title: `Task ${id}: ${task.title}`,
      description: task.description,
      type: "article",
    },
  };
}

const statusStyles: Record<string, string> = {
  done: "bg-green-100 text-green-700 border-green-200",
  "in-progress": "bg-yellow-100 text-yellow-700 border-yellow-200",
  todo: "bg-slate-100 text-slate-600 border-slate-200",
};

const priorityStyles: Record<string, string> = {
  high: "bg-red-50 text-red-600 border-red-200",
  medium: "bg-amber-50 text-amber-600 border-amber-200",
  low: "bg-slate-50 text-slate-500 border-slate-200",
};

// Dynamic Route Page
export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const task = getTask(id);

  if (!task) {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      {/* Back link */}
      <Link
        href="/tasks"
        className="inline-flex items-center gap-1 text-slate-500 hover:text-indigo-600 text-sm mb-6 transition-colors"
      >
        ← All Tasks
      </Link>

      {/* Task card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusStyles[task.status]}`}
          >
            {task.status}
          </span>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full border ${priorityStyles[task.priority]}`}
          >
            {task.priority} priority
          </span>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-800 mb-3 tracking-tight">
          {task.title}
        </h1>
        <p className="text-slate-600 leading-relaxed mb-6">
          {task.description}
        </p>

        <div className="flex items-center gap-2 text-sm text-slate-400 border-t border-slate-100 pt-4">
          <span>🗓</span>
          <span>Created: {task.createdAt}</span>
          <span className="ml-auto font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">
            ID: {task.id}
          </span>
        </div>
      </div>

      {/* Navigation helpers */}
      <div className="flex gap-3 mt-6">
        {parseInt(id) > 1 && (
          <Link
            href={`/tasks/${parseInt(id) - 1}`}
            className="flex-1 text-center px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all text-sm font-medium"
          >
            ← Previous Task
          </Link>
        )}
        {parseInt(id) < SAMPLE_TASKS.length && (
          <Link
            href={`/tasks/${parseInt(id) + 1}`}
            className="flex-1 text-center px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all text-sm font-medium"
          >
            Next Task →
          </Link>
        )}
      </div>
    </div>
  );
}
