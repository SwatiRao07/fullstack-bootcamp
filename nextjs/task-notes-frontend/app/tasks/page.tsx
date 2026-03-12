"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedTaskCard } from "@/components/AnimatedTaskCard";
import { Task } from "@/lib/types";

const SAMPLE_TASKS: Task[] = [
  {
    id: "1",
    title: "Set up Next.js project",
    description: "Initialise the task-notes-frontend project with App Router.",
    status: "done",
    priority: "high",
    createdAt: new Date().toISOString(),
    completed: true,
  },
  {
    id: "2",
    title: "Implement file-based routing",
    description:
      "Create pages for home, about, and tasks using the app/ directory.",
    status: "done",
    priority: "high",
    createdAt: new Date().toISOString(),
    completed: true,
  },
  {
    id: "3",
    title: "Build shared layouts",
    description:
      "Add a root layout with header, nav, and footer plus a nested tasks layout.",
    status: "in-progress",
    priority: "medium",
    createdAt: new Date().toISOString(),
    completed: false,
  },
  {
    id: "4",
    title: "Add dynamic routes",
    description: "Create [id] pages and catch-all category routes.",
    status: "in-progress",
    priority: "medium",
    createdAt: new Date().toISOString(),
    completed: false,
  },
  {
    id: "5",
    title: "Error handling & loading states",
    description:
      "Add error.tsx, loading.tsx, and not-found.tsx to the tasks segment.",
    status: "todo",
    priority: "low",
    createdAt: new Date().toISOString(),
    completed: false,
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Load tasks from localStorage
    const savedTasks = localStorage.getItem('tasks');
    const localTasks = savedTasks ? JSON.parse(savedTasks) : [];
    
    // Merge sample tasks with local tasks, deduplicating by ID
    const allTasks = [...localTasks, ...SAMPLE_TASKS].filter((task, index, self) =>
      index === self.findIndex((t) => t.id === task.id)
    );
    
    setTasks(allTasks);
  }, []);

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



