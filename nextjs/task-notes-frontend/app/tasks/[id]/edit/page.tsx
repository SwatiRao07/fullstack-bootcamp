import { apiClient } from '@/lib/api-client';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskForm } from '@/components/task-form';
import { updateTaskAction } from '@/lib/actions';

interface EditTaskPageProps {
  params: { id: string };
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const { id } = await params;

  let task;
  try {
    task = await apiClient.getTask(id);
  } catch (error) {
    console.error('Failed to fetch task for editing:', error);
    notFound();
  }

  // Pre-bind ID to the server action
  const updateTaskWithId = updateTaskAction.bind(null, id);

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Task</CardTitle>
          <CardDescription>
            Update the details, priority, or status of your task.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <TaskForm 
            action={updateTaskWithId} 
            defaultValues={task} 
            submitLabel="Update Task" 
          />
        </CardContent>
      </Card>
    </div>
  );
}
