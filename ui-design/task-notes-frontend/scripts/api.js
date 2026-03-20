/**
 * Mock API using LocalStorage to simulate a backend
 */

const STORAGE_KEY = 'task_notes_app_data';
const AUTH_KEY = 'task_notes_auth_user';

// Initial dummy data if storage is empty
const INITIAL_DATA = {
  tasks: [
    { id: 1, title: 'Welcome to Task Notes', description: 'This is your first task. You can edit or delete it.', priority: 'medium', completed: false, createdAt: new Date().toISOString() },
    { id: 2, title: 'Try Dark Mode', description: 'Go to the header and click the sun/moon icon to toggle theme.', priority: 'low', completed: true, createdAt: new Date().toISOString() }
  ],
  nextId: 3
};

// Utility to simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Helper for local storage
const getData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : INITIAL_DATA;
};

const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const api = {
  // Authentication
  auth: {
    login: async (email, password) => {
      await delay(800);
      if (email === 'demo@example.com' && password === 'password') {
        const user = { id: 'u1', name: 'John Doe', email: 'demo@example.com' };
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
        return { success: true, user };
      }
      throw new Error('Invalid email or password. Use demo@example.com / password');
    },
    
    register: async (name, email, password) => {
      await delay(1000);
      // Simulating registration
      const user = { id: Date.now().toString(), name, email };
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      return { success: true, user };
    },
    
    logout: async () => {
      await delay(300);
      localStorage.removeItem(AUTH_KEY);
      return { success: true };
    },
    
    getCurrentUser: () => {
      const user = localStorage.getItem(AUTH_KEY);
      return user ? JSON.parse(user) : null;
    }
  },

  // Tasks CRUD
  tasks: {
    getAll: async () => {
      await delay(600);
      return getData().tasks;
    },
    
    create: async (taskData) => {
      await delay(800);
      const data = getData();
      const newTask = {
        ...taskData,
        id: data.nextId,
        completed: false,
        createdAt: new Date().toISOString()
      };
      
      data.tasks.unshift(newTask);
      data.nextId++;
      saveData(data);
      return newTask;
    },
    
    update: async (id, updates) => {
      await delay(500);
      const data = getData();
      const index = data.tasks.findIndex(t => t.id === id);
      if (index === -1) throw new Error('Task not found');
      
      data.tasks[index] = { ...data.tasks[index], ...updates };
      saveData(data);
      return data.tasks[index];
    },
    
    delete: async (id) => {
      await delay(400);
      const data = getData();
      data.tasks = data.tasks.filter(t => t.id !== id);
      saveData(data);
      return { success: true };
    },
    
    toggleComplete: async (id) => {
      const data = getData();
      const index = data.tasks.findIndex(t => t.id === id);
      if (index === -1) throw new Error('Task not found');
      
      data.tasks[index].completed = !data.tasks[index].completed;
      saveData(data);
      return data.tasks[index];
    }
  }
};
