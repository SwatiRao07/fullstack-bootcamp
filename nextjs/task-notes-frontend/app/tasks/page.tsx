import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "All Tasks - Task Notes App",
  description: "Browse and manage all your tasks in one place.",
};

const SAMPLE_TASKS = [
  {
    id: "1",
    title: "Set up Next.js project",
    description: "Initialise the task-notes-frontend project with App Router.",
    status: "done",
    priority: "high",
  },
  {
    id: "2",
    title: "Implement file-based routing",
    description:
      "Create pages for home, about, and tasks using the app/ directory.",
    status: "done",
    priority: "high",
  },
  {
    id: "3",
    title: "Build shared layouts",
    description:
      "Add a root layout with header, nav, and footer plus a nested tasks layout.",
    status: "in-progress",
    priority: "medium",
  },
  {
    id: "4",
    title: "Add dynamic routes",
    description: "Create [id] pages and catch-all category routes.",
    status: "in-progress",
    priority: "medium",
  },
  {
    id: "5",
    title: "Error handling & loading states",
    description:
      "Add error.tsx, loading.tsx, and not-found.tsx to the tasks segment.",
    status: "todo",
    priority: "low",
  },
];

const statusStyles: Record<string, string> = {
  done: "bg-green-100 text-green-700",
  "in-progress": "bg-yellow-100 text-yellow-700",
  todo: "bg-slate-100 text-slate-600",
};

const priorityStyles: Record<string, string> = {
  high: "text-red-500",
  medium: "text-amber-500",
  low: "text-slate-400",
};

// Drill 2 – Tasks list page
export default function TasksPage() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">
        All Tasks
      </h1>
      <p className="text-slate-500 mb-8">
        {SAMPLE_TASKS.length} tasks total - click any task to view its details.
      </p>

      <ul className="flex flex-col gap-4">
        {SAMPLE_TASKS.map((task) => (
          <li key={task.id}>
            <Link
              href={`/tasks/${task.id}`}
              className="group flex items-start gap-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200"
            >

              <span
                className={`mt-1 text-lg font-bold ${priorityStyles[task.priority]}`}
                title={`Priority: ${task.priority}`}
              >
                ●
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-slate-800 font-semibold group-hover:text-indigo-600 transition-colors truncate">
                    {task.title}
                  </h2>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${statusStyles[task.status]}`}
                  >
                    {task.status}
                  </span>
                </div>
                <p className="text-slate-500 text-sm truncate">
                  {task.description}
                </p>
              </div>

              <span className="text-slate-300 group-hover:text-indigo-400 transition-colors text-xl self-center">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
