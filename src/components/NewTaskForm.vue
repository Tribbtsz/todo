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
}

.new-task-input {
  width: 100%;
  padding: var(--spacing-3);
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: all 0.2s ease;
}

.new-task-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.new-task-input::placeholder {
  color: #94a3b8;
}
</style>