'use client';

import { useState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CustomButton } from '@/components/ui/custom-button';
import { ApiTask } from '@/lib/api';
import { toast } from 'sonner';
import { updateTaskAction } from '@/lib/actions';

interface TaskFormProps {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: Partial<ApiTask>;
  submitLabel: string;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <CustomButton
      type="submit"
      intent="success"
      glow
      className="flex-1"
      disabled={pending}
    >
      {pending ? 'Saving...' : label}
    </CustomButton>
  );
}

export function TaskForm({ action, defaultValues = {}, submitLabel }: TaskFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!defaultValues.id) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    saveTimeoutRef.current = setTimeout(async () => {
      const newDescription = e.target.value;
      if (newDescription === defaultValues.description) return;

      setIsAutoSaving(true);
      try {
        const formData = new FormData();
        const titleInput = document.getElementById('title') as HTMLInputElement;
        
        formData.append('title', titleInput.value);
        formData.append('description', newDescription);
        
        // Priority is a bit tricky with shadcn select as it's not a native select
        // But for auto-save, we can just send the existing priority or try to get it
        formData.append('priority', defaultValues.priority || 'medium');
        
        await updateTaskAction(defaultValues.id!, formData);
        toast.info('Changes auto-saved');
      } catch (err) {
        console.error('Auto-save failed:', err);
      } finally {
        setIsAutoSaving(false);
      }
    }, 2000);
  };

  const validateForm = (formData: FormData) => {
    const newErrors: Record<string, string> = {};
    const title = formData.get('title') as string;

    if (!title || title.trim().length === 0) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (formData: FormData) => {
    if (!validateForm(formData)) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      await action(formData);
      toast.success('Task saved successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save task. Please try again.';
      setErrors({ general: message });
      toast.error(message);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="bg-destructive/15 border border-destructive/30 text-destructive px-4 py-3 rounded text-sm">
          {errors.general}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Task Title *</Label>
        <Input
          id="title"
          name="title"
          defaultValue={defaultValues.title}
          placeholder="What needs to be done?"
          className={errors.title ? 'border-destructive focus-visible:ring-destructive' : ''}
        />
        {errors.title && (
          <p className="text-xs font-medium text-destructive">{errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="description">Description</Label>
          {isAutoSaving && (
            <span className="text-[10px] text-muted-foreground animate-pulse">
              Saving changes...
            </span>
          )}
        </div>
        <Textarea
          id="description"
          name="description"
          defaultValue={defaultValues.description}
          onChange={handleDescriptionChange}
          placeholder="Add more details..."
          className="min-h-[100px] resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Priority Level</Label>
        <Select name="priority" defaultValue={defaultValues.priority || 'medium'}>
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

      {defaultValues.id && (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="completed"
            name="completed"
            defaultChecked={defaultValues.completed}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="completed" className="text-sm font-medium">
            Mark as completed
          </Label>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <SubmitButton label={submitLabel} />
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
