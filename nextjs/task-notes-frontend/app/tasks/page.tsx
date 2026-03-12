"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedTaskCard } from "@/components/AnimatedTaskCard";
import { Task } from "@/lib/types";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function loadTasks() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiFetch('/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadTasks();
  }, [user]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 sm:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
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

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Your Tasks</h1>
        <Button asChild>
          <Link href="/tasks/new">
            Add New Task
          </Link>
        </Button>
      </div>

      {tasks.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">No tasks yet!</p>
            <Button asChild variant="outline">
              <Link href="/tasks/new">
                Create your first task
              </Link>
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



