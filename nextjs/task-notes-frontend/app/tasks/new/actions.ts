'use server';

import { redirect } from 'next/navigation';

export async function createTask(formData: FormData) {
  const title = formData.get('title');
  const description = formData.get('description');
  const priority = formData.get('priority');

  console.log('Creating task:', { title, description, priority });

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // In a real app, you would save to database here

  redirect('/tasks');
}
