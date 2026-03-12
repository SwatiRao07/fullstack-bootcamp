"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { Task } from "@/lib/types";
import { apiFetch } from "@/lib/api";

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

export default function TaskDetailPage() {
  const { id } = useParams() as { id: string };
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadTask() {
      try {
        const data = await apiFetch(`/tasks/${id}`);
        setTask(data);
      } catch (err) {
        console.error("Failed to load task:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadTask();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 sm:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !task) {
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
            className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusStyles[task.completed ? 'done' : 'todo']}`}
          >
            {task.completed ? 'done' : 'todo'}
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
          <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
          <span className="ml-auto font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">
            ID: {task.id}
          </span>
        </div>
      </div>
    </div>
  );
}
