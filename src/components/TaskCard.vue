<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTaskStore } from '../stores/taskStore';
import SubtaskList from './SubtaskList.vue';
import type { Task } from '../types';

const props = defineProps<{
  task: Task;
}>();

const taskStore = useTaskStore();
const isEditing = ref(false);
const showSubtasks = ref(false);
const editingTitle = ref('');

const toggleSubtasks = () => {
  showSubtasks.value = !showSubtasks.value;
};

// 双击开始编辑
const startEditing = () => {
  editingTitle.value = props.task.title;
  isEditing.value = true;
};

// 保存任务
const saveTask = () => {
  if (editingTitle.value.trim()) {
    taskStore.updateTask(props.task.id, { title: editingTitle.value.trim() });
    isEditing.value = false;
  }
};

// 取消编辑
const cancelEditing = () => {
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
    <div class="task-content">
      <div class="task-header">
        <!-- 双击标题区域开始编辑 -->
        <h3 v-if="!isEditing" @dblclick="startEditing">{{ task.title }}</h3>
        <!-- 编辑状态下显示输入框 -->
        <input
          v-else
          v-model="editingTitle"
          type="text"
          class="edit-title-input"
          @keyup.enter="saveTask"
          @blur="cancelEditing"
          ref="titleInput"
          v-focus
        />
        <div class="task-actions">
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
  width: 100%; /* 确保卡片宽度固定 */
}

.task-card:hover {
  box-shadow: var(--shadow-md);
  background-color: #333333;
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
  cursor: text; /* 提示用户可以编辑 */
  flex: 1;
}

.edit-title-input {
  flex: 1;
  font-size: 1rem;
  font-weight: 500;
  padding: var(--spacing-1);
  margin-right: var(--spacing-2);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-sm);
  background-color: var(--color-surface);
  color: var(--color-text);
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
  color: var(--color-text);
}

.btn-icon:hover {
  background-color: var(--color-hover);
}

.icon {
  font-size: 0.875rem;
}

.task-details {
  margin-top: var(--spacing-3);
}

.progress-container {
  height: 4px;
  background-color: rgba(255, 255, 255, 0.1);
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
  color: var(--color-text-secondary);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-toggle {
  font-size: 0.75rem;
  padding: var(--spacing-1) var(--spacing-2);
  color: var(--color-primary);
  background-color: rgba(187, 134, 252, 0.1);
  border-radius: var(--radius-sm);
}

.subtask-container {
  margin-top: var(--spacing-3);
  padding-top: var(--spacing-3);
  border-top: 1px solid var(--color-border);
}
</style>