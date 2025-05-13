<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTaskStore } from '../stores/taskStore';
import SubtaskList from './SubtaskList.vue';
import TaskForm from './TaskForm.vue';
import type { Task } from '../types';

const props = defineProps<{
  task: Task;
}>();

const taskStore = useTaskStore();
const isEditing = ref(false);
const showSubtasks = ref(false);

const toggleSubtasks = () => {
  showSubtasks.value = !showSubtasks.value;
};

const startEditing = () => {
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
};

const saveTask = (updatedTask: Partial<Task>) => {
  taskStore.updateTask(props.task.id, updatedTask);
  isEditing.value = false;
};

const deleteTask = () => {
  if (confirm('Are you sure you want to delete this task?')) {
    taskStore.deleteTask(props.task.id);
  }
};

const addSubtask = (title: string) => {
  taskStore.addSubtask(props.task.id, title);
};

// Calculate progress for the task
const progress = computed(() => {
  if (props.task.subtasks.length === 0) return 0;
  const completedCount = props.task.subtasks.filter(st => st.completed).length;
  return Math.round((completedCount / props.task.subtasks.length) * 100);
});
</script>

<template>
  <div class="task-card">
    <div v-if="!isEditing" class="task-content">
      <div class="task-header">
        <h3>{{ task.title }}</h3>
        <div class="task-actions">
          <button class="btn-icon" @click="startEditing" title="Edit task">
            <span class="icon">✏️</span>
          </button>
          <button class="btn-icon" @click="deleteTask" title="Delete task">
            <span class="icon">🗑️</span>
          </button>
        </div>
      </div>
      
      <div v-if="task.subtasks.length > 0" class="task-details">
        <div class="progress-container">
          <div class="progress-bar" :style="`width: ${progress}%`"></div>
        </div>
        <div class="subtask-summary">
          <span>{{ task.subtasks.filter(s => s.completed).length }}/{{ task.subtasks.length }} subtasks</span>
          <button class="btn-toggle" @click="toggleSubtasks">
            {{ showSubtasks ? 'Hide' : 'Show' }}
          </button>
        </div>
      </div>
      
      <div v-if="showSubtasks" class="subtask-container">
        <SubtaskList 
          :task-id="task.id" 
          :subtasks="task.subtasks" 
          @add-subtask="addSubtask"
        />
      </div>
    </div>
    
    <TaskForm
      v-else
      :task="task"
      @save="saveTask"
      @cancel="cancelEditing"
    />
  </div>
</template>

<style scoped>
.task-card {
  background-color: var(--color-card-bg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-3);
  transition: all 0.2s ease;
  cursor: grab;
}

.task-card:hover {
  box-shadow: var(--shadow-md);
}

.task-content {
  padding: var(--spacing-3);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-2);
}

.task-header h3 {
  font-size: 1rem;
  font-weight: 500;
  word-break: break-word;
  margin-right: var(--spacing-2);
}

.task-actions {
  display: flex;
  gap: var(--spacing-1);
  opacity: 0.5;
  transition: opacity 0.2s ease;
}

.task-card:hover .task-actions {
  opacity: 1;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-1);
  border-radius: var(--radius-sm);
}

.btn-icon:hover {
  background-color: #f1f5f9;
}

.icon {
  font-size: 0.875rem;
}

.task-details {
  margin-top: var(--spacing-3);
}

.progress-container {
  height: 4px;
  background-color: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: var(--spacing-2);
}

.progress-bar {
  height: 100%;
  background-color: var(--color-primary);
  transition: width 0.3s ease;
}

.subtask-summary {
  font-size: 0.75rem;
  color: #64748b;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-toggle {
  font-size: 0.75rem;
  padding: var(--spacing-1) var(--spacing-2);
  color: var(--color-primary);
  background-color: #e0e7ff;
  border-radius: var(--radius-sm);
}

.subtask-container {
  margin-top: var(--spacing-3);
  padding-top: var(--spacing-3);
  border-top: 1px solid var(--color-border);
}
</style>