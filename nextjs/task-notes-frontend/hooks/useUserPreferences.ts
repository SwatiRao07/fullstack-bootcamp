'use client';

import { useState, useEffect } from 'react';

interface UserPreferences {
  theme: 'light' | 'dark';
  compactMode: boolean;
  showCompletedTasks: boolean;
  taskSortOrder: 'date' | 'priority' | 'title';
}

const defaultPreferences: UserPreferences = {
  theme: 'light',
  compactMode: false,
  showCompletedTasks: true,
  taskSortOrder: 'date',
};

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    if (typeof window === 'undefined') return defaultPreferences;
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
      try {
        return { ...defaultPreferences, ...JSON.parse(saved) };
      } catch {
        return defaultPreferences;
      }
    }
    return defaultPreferences;
  });

  // Effect now only handles synchronization if needed, 
  // but since we initialize in useState, we might not need it at all for mount.
  // However, if we want to listen to external changes (tab sync), we could.
  // For now, removing the initial set in useEffect to fix lint.
  useEffect(() => {
    // Already handled by lazy initializer
  }, []);

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
  };

  return {
    preferences,
    updatePreference,
  };
}
