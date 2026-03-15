'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { toggleTaskCompletionAction, deleteTaskAction } from '@/lib/actions';
import { motion, AnimatePresence } from 'framer-motion';

interface BulkActionsProps {
  selectedIds: string[];
  clearSelection: () => void;
}

export function BulkActions({ selectedIds, clearSelection }: BulkActionsProps) {
  const [isPending, startTransition] = useTransition();

  if (selectedIds.length === 0) return null;

  const handleBulkComplete = () => {
    startTransition(async () => {
      try {
        await Promise.all(
          selectedIds.map((id) => toggleTaskCompletionAction(id, true))
        );
        toast.success(`Completed ${selectedIds.length} tasks`);
        clearSelection();
      } catch {
        toast.error('Failed to complete some tasks');
      }
    });
  };

  const handleBulkDelete = () => {
    if (!confirm(`Delete ${selectedIds.length} tasks?`)) return;

    startTransition(async () => {
      try {
        await Promise.all(selectedIds.map((id) => deleteTaskAction(id)));
        toast.success(`Deleted ${selectedIds.length} tasks`);
        clearSelection();
      } catch {
        toast.error('Failed to delete some tasks');
      }
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white rounded-full px-6 py-3 shadow-2xl flex items-center gap-6 border border-slate-700"
      >
        <span className="text-sm font-medium">
          {selectedIds.length} selected
        </span>
        
        <div className="h-4 w-[1px] bg-slate-700" />
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="hover:bg-green-500/20 text-green-400"
            onClick={handleBulkComplete}
            disabled={isPending}
          >
            Mark Done
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="hover:bg-red-500/20 text-red-400"
            onClick={handleBulkDelete}
            disabled={isPending}
          >
            Delete All
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={clearSelection}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
