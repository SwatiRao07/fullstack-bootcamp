'use client';

import { useState, useTransition } from 'react';
import { toggleTaskCompletionAction, deleteTaskAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface TaskActionsProps {
  task: {
    id: string;
    title: string;
    completed: boolean;
  };
  variant?: 'inline' | 'detail';
}

export function TaskActions({ task, variant = 'inline' }: TaskActionsProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggleComplete = () => {
    startTransition(async () => {
      try {
        await toggleTaskCompletionAction(task.id, !task.completed);
        toast.success(
          `Task marked as ${!task.completed ? 'completed' : 'incomplete'}`
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to toggle status';
        toast.error(message);
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteTaskAction(task.id);
        toast.success('Task deleted successfully');
        setIsDeleteModalOpen(false);
        if (variant === 'detail') {
          router.push('/tasks');
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete task';
        toast.error(message);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={task.completed ? 'secondary' : 'default'}
        size="sm"
        onClick={handleToggleComplete}
        disabled={isPending}
        className={
          task.completed
            ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400'
        }
      >
        {isPending ? 'Updating...' : task.completed ? 'Done' : 'Mark Done'}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsDeleteModalOpen(true)}
        disabled={isPending}
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        Delete
      </Button>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-background border rounded-xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-2">Delete Task</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete <span className="font-semibold text-foreground">&quot;{task.title}&quot;</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleDelete}
                disabled={isPending}
              >
                {isPending ? 'Deleting...' : 'Delete Forever'}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isPending}
              >
                Keep it
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
