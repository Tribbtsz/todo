<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  'create-task': [title: string];
}>();

const newTaskTitle = ref('');

const createTask = () => {
  if (newTaskTitle.value.trim()) {
    emit('create-task', newTaskTitle.value.trim());
    newTaskTitle.value = '';
  }
};
</script>

<template>
  <div class="new-task-container">
    <input
      v-model="newTaskTitle"
      type="text"
      placeholder="Enter task title and press Enter to add"
      class="new-task-input"
      @keyup.enter="createTask"
    />
  </div>
</template>

<style scoped>
.new-task-container {
  margin-bottom: var(--spacing-6);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.new-task-input {
  width: 100%;
  padding: var(--spacing-3);
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: var(--color-surface);
  color: var(--color-text);
}

.new-task-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(187, 134, 252, 0.2);
}

.new-task-input::placeholder {
  color: var(--color-text-secondary);
}
</style>