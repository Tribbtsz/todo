<script setup lang="ts">
import { ref } from 'vue';
import type { Task } from '../types';

const props = defineProps<{
  task?: Task;
}>();

const emit = defineEmits<{
  save: [updatedTask: Partial<Task>];
  cancel: [];
}>();

const title = ref(props.task?.title || '');

const handleSubmit = () => {
  if (title.value.trim()) {
    emit('save', { title: title.value.trim() });
  }
};

const handleCancel = () => {
  emit('cancel');
};
</script>

<template>
  <div class="task-form">
    <input
      v-model="title"
      type="text"
      placeholder="Task title"
      class="task-title-input"
      @keyup.enter="handleSubmit"
    />
    
    <div class="form-actions">
      <button class="btn-primary" @click="handleSubmit">Save</button>
      <button class="btn-secondary" @click="handleCancel">Cancel</button>
    </div>
  </div>
</template>

<style scoped>
.task-form {
  padding: var(--spacing-3);
}

.task-title-input {
  margin-bottom: var(--spacing-3);
}

.form-actions {
  display: flex;
  gap: var(--spacing-2);
}
</style>