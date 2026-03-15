import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from 'next/link';
import { Task } from '@/lib/types';
import { TaskActions } from './task-actions';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const priorityColors = {
    low: 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200',
    high: 'bg-red-100 text-red-800 hover:bg-red-200 border-red-200',
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className={`text-lg font-semibold leading-none tracking-tight ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              Created {new Date(task.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={priorityColors[task.priority]}
            >
              {task.priority}
            </Badge>
            <Badge variant={task.completed ? "default" : "outline"}>
              {task.completed ? 'Completed' : 'Pending'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-3">
        <div className="flex justify-between items-center gap-2">
          <TaskActions task={task} />
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/tasks/${task.id}`}>
                View Details
              </Link>
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <Link href={`/tasks/${task.id}/edit`}>
                Edit
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
