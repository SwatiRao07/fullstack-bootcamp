/**
 * Drill 2: Server Component Data Fetching
 * Tasks are fetched on the SERVER — no loading spinners, better SEO,
 * less client-side JS. The loading.tsx skeleton shows during navigation.
 */
import { cookies } from 'next/headers';
import Link from 'next/link';
import { api } from '@/lib/api';
import { AnimatedTaskCard } from '@/components/AnimatedTaskCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Task } from '@/lib/types';

// Map ApiTask → local Task shape
function toTask(t: Awaited<ReturnType<typeof api.getTasks>>['data'][number]): Task {
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

export default async function TasksPage() {
  // Read the auth cookie server-side so the API call is authenticated
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  // If there is no token in cookies, show unauthenticated state
  const hasToken = cookieStore.has('auth_token');

  if (!hasToken) {
    return (
      <div className="container mx-auto p-4 sm:p-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Your Tasks</h1>
        <Card className="py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">Please login to view your tasks.</p>
            <Button asChild>
              <Link href="/login">Login Now</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Drill 2: fetch on the server — no useEffect needed
  let tasks: Task[] = [];
  let fetchError = false;

  try {
    const response = await api.getTasks({ cookieHeader });
    tasks = (response.data ?? []).map(toTask);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Your Tasks</h1>
        <Button asChild>
          <Link href="/tasks/new">Add New Task</Link>
        </Button>
      </div>

      {tasks.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">No tasks yet!</p>
            <Button asChild variant="outline">
              <Link href="/tasks/new">Create your first task</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task, index) => (
            <AnimatedTaskCard key={task.id} task={task} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
