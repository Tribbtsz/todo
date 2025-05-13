<script setup lang="ts">
import { ref } from 'vue';
import { useTaskStore } from '../stores/taskStore';
import type { SubTask } from '../types';

const props = defineProps<{
  taskId: string;
  subtasks: SubTask[];
}>();

const emit = defineEmits<{
  'add-subtask': [title: string];
}>();

const taskStore = useTaskStore();
const newSubtaskTitle = ref('');
const editingSubtaskId = ref<string | null>(null);
const editingTitle = ref('');

const addSubtask = () => {
  if (newSubtaskTitle.value.trim()) {
    emit('add-subtask', newSubtaskTitle.value.trim());
    newSubtaskTitle.value = '';
  }
};

const startEditing = (subtask: SubTask) => {
  editingSubtaskId.value = subtask.id;
  editingTitle.value = subtask.title;
};

const cancelEditing = () => {
  editingSubtaskId.value = null;
};

const saveSubtask = (subtaskId: string) => {
  if (editingTitle.value.trim()) {
    taskStore.updateSubtask(props.taskId, subtaskId, {
      title: editingTitle.value
    });
    editingSubtaskId.value = null;
  }
};

const toggleComplete = (subtask: SubTask) => {
  taskStore.updateSubtask(props.taskId, subtask.id, {
    completed: !subtask.completed
  });
};

const deleteSubtask = (subtaskId: string) => {
  taskStore.deleteSubtask(props.taskId, subtaskId);
};
</script>

<template>
  <div class="subtask-list">
    <ul>
      <li v-for="subtask in subtasks" :key="subtask.id" class="subtask-item">
        <div v-if="editingSubtaskId === subtask.id" class="subtask-edit">
          <input
            v-model="editingTitle"
            type="text"
            placeholder="Subtask title"
            @keyup.enter="saveSubtask(subtask.id)"
          />
          <div class="subtask-edit-actions">
            <button class="btn-sm btn-primary" @click="saveSubtask(subtask.id)">Save</button>
            <button class="btn-sm btn-secondary" @click="cancelEditing">Cancel</button>
          </div>
        </div>
        
        <div v-else class="subtask-content">
          <div class="subtask-title">
            <input
              type="checkbox"
              :checked="subtask.completed"
              @change="toggleComplete(subtask)"
              class="subtask-checkbox"
            />
            <span :class="{ 'completed': subtask.completed }">{{ subtask.title }}</span>
          </div>
          
          <div class="subtask-actions">
            <button class="btn-icon" @click="startEditing(subtask)" title="Edit subtask">
              <span class="icon">✏️</span>
            </button>
            <button class="btn-icon" @click="deleteSubtask(subtask.id)" title="Delete subtask">
              <span class="icon">🗑️</span>
            </button>
          </div>
        </div>
      </li>
    </ul>
    
    <div class="new-subtask">
      <input
        v-model="newSubtaskTitle"
        type="text"
        placeholder="Add a new subtask"
        @keyup.enter="addSubtask"
      />
      <button class="btn-primary btn-add-subtask" @click="addSubtask">Add</button>
    </div>
  </div>
</template>

<style scoped>
.subtask-list {
  font-size: 0.875rem;
}

.subtask-item {
  list-style: none;
  margin-bottom: var(--spacing-2);
  animation: fade-in 0.3s ease;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

.subtask-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.subtask-title {
  display: flex;
  align-items: center;
  flex: 1;
}

.subtask-checkbox {
  margin-right: var(--spacing-2);
  accent-color: var(--color-primary);
}

.completed {
  text-decoration: line-through;
  color: var(--color-text-secondary);
}

.subtask-actions {
  display: flex;
  gap: var(--spacing-1);
  opacity: 0.5;
  transition: opacity 0.2s ease;
}

.subtask-item:hover .subtask-actions {
  opacity: 1;
}

.subtask-edit {
  margin-bottom: var(--spacing-2);
}

.subtask-edit input {
  margin-bottom: var(--spacing-2);
  background-color: var(--color-surface);
  color: var(--color-text);
}

.subtask-edit-actions {
  display: flex;
  gap: var(--spacing-2);
}

.new-subtask {
  display: flex;
  gap: var(--spacing-2);
  margin-top: var(--spacing-3);
}

.btn-add-subtask {
  white-space: nowrap;
}

.btn-sm {
  font-size: 0.75rem;
  padding: var(--spacing-1) var(--spacing-2);
}
</style>