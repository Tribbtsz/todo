<script setup lang="ts">
import { computed } from 'vue';
import draggable from 'vuedraggable';
import TaskCard from './TaskCard.vue';
import type { Task } from '../types';

const props = defineProps<{
  title: string;
  status: 'TODO' | 'WIP' | 'DONE';
  tasks: Task[];
}>();

const emit = defineEmits<{
  'update': [status: 'TODO' | 'WIP' | 'DONE', tasks: Task[]];
}>();

// Compute the column's style based on its status
const columnStyle = computed(() => {
  switch (props.status) {
    case 'TODO':
      return { '--column-color': 'var(--color-primary)' };
    case 'WIP':
      return { '--column-color': 'var(--color-wip)' };
    case 'DONE':
      return { '--column-color': 'var(--color-done)' };
    default:
      return { '--column-color': 'var(--color-primary)' };
  }
});

// Handle changes to the task list (due to dragging)
const handleChange = (event: any) => {
  emit('update', props.status, [...event.moved ? props.tasks : event.added?.element ? [
    ...props.tasks.slice(0, event.added.newIndex),
    { ...event.added.element, status: props.status },
    ...props.tasks.slice(event.added.newIndex)
  ].filter((t): t is Task => !!t) : props.tasks]);
};
</script>

<template>
  <div class="kanban-column" :style="columnStyle">
    <div class="column-header">
      <h2>{{ title }}</h2>
      <div class="task-count">{{ tasks.length }}</div>
    </div>
    
    <draggable
      :list="tasks"
      class="task-list"
      group="tasks"
      ghost-class="ghost-task"
      animation="300"
      @change="handleChange"
      item-key="id"
    >
      <template #item="{ element: task }">
        <TaskCard :task="task" />
      </template>
    </draggable>
  </div>
</template>

<style scoped>
.kanban-column {
  background-color: #f8fafc;
  border-radius: var(--radius-md);
  border-top: 4px solid var(--column-color);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 200px);
  max-height: 800px;
  overflow-y: hidden;
}

.column-header {
  padding: var(--spacing-4);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
}

.column-header h2 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--column-color);
}

.task-count {
  background-color: var(--column-color);
  color: white;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: 600;
}

.task-list {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-2);
}

.ghost-task {
  opacity: 0.5;
  background: #f1f5f9;
  border: 2px dashed var(--column-color);
}

/* Scrollbar styling */
.task-list::-webkit-scrollbar {
  width: 6px;
}

.task-list::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.task-list::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}

.task-list::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}
</style>