'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/lib/types';
import { AnimatedTaskCard } from './AnimatedTaskCard';
import { BulkActions } from './BulkActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Reorder } from 'framer-motion';

interface TaskListProps {
  tasks: Task[];
  q?: string;
}

export function TaskList({ tasks: initialTasks, q }: TaskListProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Update local tasks when initialTasks change (e.g., after search or mutation)
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const clearSelection = () => setSelectedIds([]);

  if (tasks.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {q ? `No tasks found matching "${q}"` : "No tasks yet!"}
          </p>
          <Button asChild variant="outline">
            <Link href={q ? "/tasks" : "/tasks/new"}>
              {q ? "Clear Search" : "Create your first task"}
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Reorder.Group
        axis="y"
        values={tasks}
        onReorder={setTasks}
        className="grid gap-4"
      >
        {tasks.map((task, index) => (
          <Reorder.Item
            key={task.id}
            value={task}
            className="relative group flex items-start gap-4"
          >
            <div className="pt-8 pl-1 flex flex-col gap-4">
              <input
                type="checkbox"
                checked={selectedIds.includes(task.id)}
                onChange={() => toggleSelection(task.id)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <div className="cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-muted-foreground flex justify-center">
                <span className="text-xs">☰</span>
              </div>
            </div>
            <div className="flex-1">
              <AnimatedTaskCard task={task} index={index} />
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <BulkActions
        selectedIds={selectedIds}
        clearSelection={clearSelection}
      />
    </>
  );
}
