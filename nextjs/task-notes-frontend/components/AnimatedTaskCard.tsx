'use client';

import { motion } from 'framer-motion';
import { TaskCard } from './TaskCard';
import { Task } from '@/lib/types';

interface AnimatedTaskCardProps {
  task: Task;
  index: number;
}

export function AnimatedTaskCard({ task, index }: AnimatedTaskCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      layout
    >
      <TaskCard task={task} />
    </motion.div>
  );
}
