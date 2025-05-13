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
  /* Material 暗色主题颜色 */
  --color-bg: #121212;
  --color-surface: #1e1e1e;
  --color-text: #e0e0e0;
  --color-text-secondary: #a0a0a0;
  --color-primary: #bb86fc;
  --color-primary-variant: #3700b3;
  --color-wip: #03dac6;
  --color-done: #4caf50;
  --color-error: #cf6679;
  --color-border: #333333;
  --color-card-bg: #2d2d2d;
  --color-hover: rgba(255, 255, 255, 0.08);
  
  /* 阴影 */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.5);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.6);
  
  /* 圆角 */
  --radius-sm: 4px;
  --radius-md: 8px;
  
  /* 间距 */
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
  font-family: 'Roboto', Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 
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
  font-weight: 500;
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
  color: #121212;
}

.btn-primary:hover {
  background-color: var(--color-primary-variant);
  color: white;
}

.btn-secondary {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--color-text);
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.btn-danger {
  background-color: var(--color-error);
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
  background-color: var(--color-surface);
  color: var(--color-text);
}

input:focus, textarea:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 1px;
}
</style>