import { Task, Priority } from './types';
import { randomUUID } from 'crypto';

function createTask(title: string, priority: Priority = 'medium'): Task {
  return {
    id: randomUUID(),
    title,
    completed: false,
    priority,
    createdAt: new Date(),
  };
}

const task1 = createTask('Buy groceries', 'high');
const task2 = createTask('Read TypeScript book');

console.log(task1);
console.log(task2);