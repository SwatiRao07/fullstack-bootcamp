'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { apiFetch } from '@/lib/api';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  try {
    const response = await apiFetch<{ token: string; user: { id: number; email: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const cookieStore = await cookies();

    // Store token in HTTP-only cookie
    cookieStore.set('auth-token', response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Store user info in a readable cookie (optional)
    cookieStore.set('user', JSON.stringify(response.user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid email or password';
    return { error: message };
  }

  redirect('/tasks');
}

export async function register(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!email || !password || !confirmPassword) {
    return { error: 'All fields are required' };
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' };
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters' };
  }

  try {
    const response = await apiFetch<{ token: string; user: { id: number; email: string } }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const cookieStore = await cookies();

    cookieStore.set('auth-token', response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    
    // Store user info in a readable cookie
    cookieStore.set('user', JSON.stringify(response.user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create account. Email may already exist.';
    return { error: message };
  }

  redirect('/tasks');
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
  cookieStore.delete('user');
  redirect('/login');
}
