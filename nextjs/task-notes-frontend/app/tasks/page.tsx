
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Task } from '@/lib/types';
import { TaskList } from '@/components/TaskList';
import { SearchFilter } from '@/components/SearchFilter';

import { ApiTask } from '@/lib/api';

// Map ApiTask → local Task shape
function toTask(t: ApiTask): Task {
  return {
    id: t.id,
    title: t.title,
    description: t.description ?? '',
    status: t.completed ? 'done' : 'todo',
    priority: t.priority,
    createdAt: t.createdAt,
    completed: t.completed,
  };
}

export const metadata = {
  title: 'Your Tasks — Task Notes App',
  description: 'View and manage all your tasks.',
};

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function TasksPage({ searchParams }: Props) {
  const { q } = await searchParams;
  // fetch on the server — no useEffect needed
  let tasks: Task[] = [];
  let fetchError = false;

  try {
    const response = await apiClient.getTasks();
    tasks = Array.isArray(response) 
      ? response.map(toTask)
      : (response as { data: ApiTask[] }).data?.map(toTask) || [];
    
    // Client-side filtering if search query exists
    if (q) {
      const lowerQ = q.toLowerCase();
      tasks = tasks.filter(t => 
        t.title.toLowerCase().includes(lowerQ) || 
        t.description.toLowerCase().includes(lowerQ)
      );
    }
  } catch (err) {
    console.error('[TasksPage] Failed to load tasks:', err);
    fetchError = true;
  }

  if (fetchError) {
    return (
      <div className="container mx-auto p-4 sm:p-8">
        <h1 className="text-3xl font-bold mb-6">Your Tasks</h1>
        <Card className="py-12 border-red-200 bg-red-50">
          <CardContent className="text-center">
            <p className="text-red-600 mb-4">Failed to load tasks — please try again later.</p>
            <Button asChild variant="outline">
              <Link href="/tasks">Retry</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Tasks</h1>
        <div className="flex w-full md:w-auto gap-3 items-center">
          <SearchFilter />
          <Button asChild className="shrink-0">
            <Link href="/tasks/new">Add New Task</Link>
          </Button>
        </div>
      </div>

      <TaskList tasks={tasks} q={q} />
    </div>
  );
}
