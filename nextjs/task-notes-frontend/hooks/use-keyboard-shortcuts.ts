'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useKeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // 'n' for new task
      if (e.key === 'n' || e.key === 'N') {
        router.push('/tasks/new');
      }

      // '/' or 's' for focus search
      if (e.key === '/' || e.key === 's') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }

      // 'h' for home
      if (e.key === 'h' || e.key === 'H') {
        router.push('/tasks');
      }

      // Escape to blur search
      if (e.key === 'Escape') {
        (document.activeElement as HTMLElement)?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);
}
