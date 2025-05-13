<script setup lang="ts">
import { computed } from 'vue';
import { useTaskStore } from '../stores/taskStore';
import KanbanColumn from './KanbanColumn.vue';
import NewTaskForm from './NewTaskForm.vue';
import type { Task } from '../types';

const taskStore = useTaskStore();

const todoTasks = computed(() => taskStore.getTasksByStatus('TODO'));
const wipTasks = computed(() => taskStore.getTasksByStatus('WIP'));
const doneTasks = computed(() => taskStore.getTasksByStatus('DONE'));

// Handle task movement between columns
const handleColumnUpdate = (status: 'TODO' | 'WIP' | 'DONE', newTasks: Task[]) => {
  taskStore.reorderTasks(status, newTasks);
};

// Handle creation of a new task
const handleNewTask = (title: string) => {
  taskStore.addTask(title);
};
</script>

<template>
  <div>
    <NewTaskForm @create-task="handleNewTask" />
    
    <div class="kanban-board">
      <KanbanColumn 
        title="TODO" 
        status="TODO" 
        :tasks="todoTasks" 
        @update="handleColumnUpdate"
      />
      
      <KanbanColumn 
        title="IN PROGRESS" 
        status="WIP" 
        :tasks="wipTasks" 
        @update="handleColumnUpdate"
      />
      
      <KanbanColumn 
        title="DONE" 
        status="DONE" 
        :tasks="doneTasks" 
        @update="handleColumnUpdate"
      />
    </div>
  </div>
</template>

<style scoped>
.kanban-board {
  display: grid;
  grid-template-columns: repeat(3, 350px); /* 固定每列宽度为350px */
  gap: var(--spacing-4);
  margin-top: var(--spacing-6);
  justify-content: center; /* 居中显示 */
  max-width: 1100px; /* 限制最大宽度 */
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 1100px) {
  .kanban-board {
    grid-template-columns: repeat(auto-fit, 350px);
    justify-content: center;
  }
}
</style>