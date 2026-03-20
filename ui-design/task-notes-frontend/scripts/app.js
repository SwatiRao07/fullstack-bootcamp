import { api } from './api.js';

/**
 * Main Application Logic for Task Notes
 */

document.addEventListener('DOMContentLoaded', async () => {
    // ---- State & Selectors ----
    const user = api.auth.getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    let allTasks = [];
    let currentFilter = 'all';
    let searchQuery = '';

    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    const taskModal = document.getElementById('taskModal');
    const taskForm = document.getElementById('taskForm');
    const openTaskFormBtn = document.getElementById('openTaskForm');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelTaskBtn = document.getElementById('cancelTask');
    const searchInput = document.getElementById('searchInput');
    const logoutBtn = document.getElementById('logoutBtn');
    const themeToggle = document.getElementById('themeToggle');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const pendingCount = document.getElementById('pendingCount');
    const modalTitle = document.getElementById('modalTitle');
    const saveTaskBtn = document.getElementById('saveTaskBtn');
    const greetingTitle = document.getElementById('greetingTitle');
    const userNameDisplay = document.getElementById('userName');

    // ---- Initialization ----
    userNameDisplay.textContent = user.name;
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar) {
        userAvatar.textContent = user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    greetingTitle.textContent = `${greeting}, ${user.name.split(' ')[0]}`;

    // Initialize Theme
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    // Initial Fetch
    await fetchTasks();

    // ---- Handlers ----

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });

    // Logout
    logoutBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to logout?')) {
            await api.auth.logout();
            window.location.href = 'login.html';
        }
    });

    // Modal Controls
    const openModal = (isEdit = false, task = null) => {
        taskModal.classList.add('active');
        if (isEdit && task) {
            modalTitle.textContent = 'Edit Task';
            saveTaskBtn.textContent = 'Save Changes';
            document.getElementById('taskId').value = task.id;
            document.getElementById('taskTitleInput').value = task.title;
            document.getElementById('taskDescInput').value = task.description;
            document.getElementById('taskPriorityInput').value = task.priority;
        } else {
            modalTitle.textContent = 'Create New Task';
            saveTaskBtn.textContent = 'Create Task';
            taskForm.reset();
            document.getElementById('taskId').value = '';
        }
    };

    const closeModal = () => {
        taskModal.classList.remove('active');
        taskForm.reset();
    };

    openTaskFormBtn.addEventListener('click', () => openModal());
    closeModalBtn.addEventListener('click', closeModal);
    cancelTaskBtn.addEventListener('click', closeModal);
    taskModal.addEventListener('click', (e) => {
        if (e.target === taskModal) closeModal();
    });

    // Task Form Submission
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = document.getElementById('taskId').value;
        const taskData = {
            title: document.getElementById('taskTitleInput').value,
            description: document.getElementById('taskDescInput').value,
            priority: document.getElementById('taskPriorityInput').value
        };

        saveTaskBtn.disabled = true;
        saveTaskBtn.innerHTML = '<span class="loading-spinner"></span> Creating...';

        try {
            if (id) {
                await api.tasks.update(parseInt(id), taskData);
                showToast('Task updated successfully');
            } else {
                await api.tasks.create(taskData);
                showToast('Task created successfully');
            }
            closeModal();
            await fetchTasks();
        } catch (err) {
            alert(err.message);
        } finally {
            saveTaskBtn.disabled = false;
        }
    });

    // Filtering & Search
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            currentFilter = link.dataset.filter;
            renderTasks();
        });
    });

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderTasks();
    });

    // ---- Core Functions ----

    async function fetchTasks() {
        taskList.innerHTML = `
            <div class="task-card" style="height: 180px; opacity: 0.5; animation: pulse 1.5s infinite;"></div>
            <div class="task-card" style="height: 180px; opacity: 0.5; animation: pulse 1.5s infinite;"></div>
            <div class="task-card" style="height: 180px; opacity: 0.5; animation: pulse 1.5s infinite;"></div>
        `;
        try {
            allTasks = await api.tasks.getAll();
            renderTasks();
        } catch (err) {
            taskList.innerHTML = `<p class="badge badge-high" style="grid-column: 1/-1;">Error loading tasks: ${err.message}</p>`;
        }
    }

    function renderTasks() {
        let filtered = allTasks;

        // Apply Sidebar Filter
        if (currentFilter === 'pending') filtered = allTasks.filter(t => !t.completed);
        else if (currentFilter === 'completed') filtered = allTasks.filter(t => t.completed);
        else if (['low', 'medium', 'high'].includes(currentFilter)) {
            filtered = allTasks.filter(t => t.priority === currentFilter);
        }

        // Apply Search
        if (searchQuery) {
            filtered = filtered.filter(t => 
                t.title.toLowerCase().includes(searchQuery) || 
                t.description.toLowerCase().includes(searchQuery)
            );
        }

        // Update Counter
        const pendingCountNum = allTasks.filter(t => !t.completed).length;
        pendingCount.textContent = pendingCountNum;

        if (filtered.length === 0) {
            taskList.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        taskList.style.display = 'grid';
        emptyState.style.display = 'none';
        
        taskList.innerHTML = filtered.map(task => `
            <div class="task-card ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <div class="flex justify-between items-start">
                    <span class="badge badge-${task.priority}">${task.priority}</span>
                    <div class="flex gap-1">
                        <button class="btn btn-ghost btn-icon edit-btn" title="Edit">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button class="btn btn-ghost btn-icon delete-btn" title="Delete">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                </div>
                <h3 class="task-title">${escapeHTML(task.title)}</h3>
                <p class="task-description">${escapeHTML(task.description || 'No description provided.')}</p>
                <div class="task-footer">
                    <span style="font-size: var(--fs-xs); color: var(--text-muted);">
                        ${new Date(task.createdAt).toLocaleDateString()}
                    </span>
                    <button class="btn ${task.completed ? 'btn-secondary' : 'btn-primary'} btn-sm complete-btn" style="padding: 0.4rem 0.8rem; font-size: 12px;">
                        ${task.completed ? 'Undo' : 'Complete'}
                    </button>
                </div>
            </div>
        `).join('');

        // Attach Event Listeners to cards
        attachCardListeners();
    }

    function attachCardListeners() {
        taskList.querySelectorAll('.task-card').forEach(card => {
            const id = parseInt(card.dataset.id);
            const task = allTasks.find(t => t.id === id);

            card.querySelector('.complete-btn').addEventListener('click', async (e) => {
                e.stopPropagation();
                await api.tasks.toggleComplete(id);
                await fetchTasks();
            });

            card.querySelector('.edit-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                openModal(true, task);
            });

            card.querySelector('.delete-btn').addEventListener('click', async (e) => {
                e.stopPropagation();
                if (confirm('Are you sure you want to delete this task?')) {
                    await api.tasks.delete(id);
                    await fetchTasks();
                    showToast('Task deleted');
                }
            });
        });
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'badge badge-low';
        toast.style.cssText = `
            position: fixed; 
            bottom: 2rem; 
            right: 2rem; 
            padding: 1rem 1.5rem; 
            background: var(--surface-color); 
            border: 1px solid var(--primary); 
            box-shadow: var(--shadow-lg); 
            z-index: 2000; 
            font-size: 0.9rem;
            text-transform: none;
            border-radius: var(--radius-md);
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    function escapeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
});
