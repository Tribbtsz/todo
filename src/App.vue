<script setup lang="ts">
import { onMounted } from 'vue';
import KanbanBoard from './components/KanbanBoard.vue';
import { useTaskStore } from './stores/taskStore';

const taskStore = useTaskStore();

onMounted(() => {
  taskStore.loadTasks();
});
</script>

<template>
  <div class="app-container">
    <header>
      <h1>Task Manager</h1>
    </header>
    <main>
      <KanbanBoard />
    </main>
  </div>
</template>

<style>
:root {
  --color-bg: #f5f7fa;
  --color-text: #333;
  --color-primary: #3b82f6;
  --color-wip: #f59e0b;
  --color-done: #10b981;
  --color-border: #e2e8f0;
  --color-card-bg: #fff;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --radius-sm: 4px;
  --radius-md: 8px;
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-6: 24px;
  --spacing-8: 32px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
    'Helvetica Neue', Arial, sans-serif;
  line-height: 1.5;
  background-color: var(--color-bg);
  color: var(--color-text);
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-4);
}

header {
  padding: var(--spacing-6) 0;
  text-align: center;
}

h1 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: var(--spacing-4);
  color: var(--color-primary);
}

button {
  cursor: pointer;
  background: none;
  border: none;
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-sm);
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary {
  background-color: #e2e8f0;
  color: #4b5563;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover {
  opacity: 0.9;
}

input, textarea {
  width: 100%;
  padding: var(--spacing-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-family: inherit;
  font-size: 0.875rem;
}

input:focus, textarea:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 1px;
}
</style>