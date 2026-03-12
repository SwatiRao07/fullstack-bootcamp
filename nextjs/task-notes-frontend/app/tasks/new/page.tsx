"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { toast } from "sonner";
import { Task } from "@/lib/types";

export default function NewTaskPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleAction(formData: FormData) {
    setIsSubmitting(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const priority = formData.get('priority') as "low" | "medium" | "high";

    const newTask: Task = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      description,
      priority,
      status: 'todo',
      createdAt: new Date().toISOString(),
      completed: false
    };

    // Save to localStorage
    const savedTasks = localStorage.getItem('tasks');
    const tasks = savedTasks ? JSON.parse(savedTasks) : [];
    localStorage.setItem('tasks', JSON.stringify([newTask, ...tasks]));

    toast.success("Task created successfully!");
    
    setIsSubmitting(false);
    router.push('/tasks');
  }

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
          <form action={handleAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter task title..."
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Add task details..."
                className="min-h-25 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select name="priority" defaultValue="medium">
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Task"}
              </Button>
              <Button type="button" variant="outline" className="flex-1" asChild>
                <Link href="/tasks">
                   Cancel
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

