/**
 * Drill 3: Dynamic Route Data Fetching
 * Server component that fetches a single task by ID.
 * Uses notFound() for missing tasks and generateMetadata() for SEO.
 */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { apiClient } from '@/lib/api-client';

import { TaskActions } from '@/components/task-actions';

interface Props {
  params: Promise<{ id: string }>;
}

// ... existing generateMetadata ...

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const task = await apiClient.getTask(id);
  
    return {
      title: `${task.title} — Task Notes App`,
      description: task.description ?? `Task created on ${new Date(task.createdAt).toLocaleDateString()}`,
      openGraph: {
        title: task.title,
        description: task.description,
        type: 'article',
      },
    };
  } catch {
    return {
      title: 'Task Not Found — Task Notes App',
      description: 'This task could not be found.',
    };
  }
}

const statusStyles: Record<string, string> = {
  done: 'bg-green-100 text-green-700 border-green-200',
  todo: 'bg-slate-100 text-slate-600 border-slate-200',
};

const priorityStyles: Record<string, string> = {
  high: 'bg-red-50 text-red-600 border-red-200',
  medium: 'bg-amber-50 text-amber-600 border-amber-200',
  low: 'bg-slate-50 text-slate-500 border-slate-200',
};

export default async function TaskDetailPage({ params }: Props) {
  const { id } = await params;

  // Drill 3: Fetch task on the server
  let task;
  try {
    task = await apiClient.getTask(id);
  } catch (err) {
    // 404 from API → show Next.js not-found page
    if (err && typeof err === 'object' && 'status' in err && err.status === 404) notFound();
    // Other errors → rethrow so error.tsx catches it
    throw err;
  }

  const status = task.completed ? 'done' : 'todo';

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
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusStyles[status]}`}>
            {task.completed ? 'Completed' : 'Pending'}
          </span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${priorityStyles[task.priority]}`}>
            {task.priority} priority
          </span>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-800 mb-3 tracking-tight">
          {task.title}
        </h1>

        {task.description && (
          <p className="text-slate-600 leading-relaxed mb-6">{task.description}</p>
        )}

        <div className="flex items-center gap-2 text-sm text-slate-400 border-t border-slate-100 pt-4">
          <span>🗓</span>
          <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
          {task.updatedAt && (
            <span className="ml-2">· Updated: {new Date(task.updatedAt).toLocaleDateString()}</span>
          )}
          <span className="ml-auto font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">
            ID: {task.id.slice(0, 8)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap gap-4 items-center justify-between">
        <TaskActions task={task} variant="detail" />
        
        <div className="flex gap-3">
          <Link
            href={`/tasks/${task.id}/edit`}
            className="px-6 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors text-sm font-medium shadow-sm"
          >
            Edit Task
          </Link>
          <Link
            href="/tasks"
            className="px-6 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium"
          >
            Back to List
          </Link>
        </div>
      </div>
    </div>
  );
}
