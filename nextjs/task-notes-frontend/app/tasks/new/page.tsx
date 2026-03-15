import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskForm } from '@/components/task-form';
import { createTaskAction } from '@/lib/actions';

export default function NewTaskPage() {
  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Task</CardTitle>
          <CardDescription>
            Add a new task to your list with priority and details.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <TaskForm action={createTaskAction} submitLabel="Create Task" />
        </CardContent>
      </Card>
    </div>
  );
}
