<script setup lang="ts">
import { ref, nextTick } from 'vue';

const emit = defineEmits<{
  'create-task': [title: string];
}>();

const newTaskTitle = ref('');
const textareaRef = ref<HTMLTextAreaElement | null>(null);

const resizeTextarea = () => {
  nextTick(() => {
    const el = textareaRef.value;
    if (el) {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }
  });
};

// 处理键盘事件
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    if (e.ctrlKey || e.shiftKey) {
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart ?? 0;
      const end = textarea.selectionEnd ?? 0;
      const value = newTaskTitle.value;

      const beforeCursor = value.slice(0, start);
      const lines = beforeCursor.split('\n');
      let insertText = '\n';
      if (lines.length > 1 || start !== 0) {
        insertText = '\n  - ';
      }

      newTaskTitle.value = value.slice(0, start) + insertText + value.slice(end);

      nextTick(() => {
        const pos = start + insertText.length;
        textarea.selectionStart = textarea.selectionEnd = pos;
        resizeTextarea();
      });
      e.preventDefault();
    } else {
      createTask();
      e.preventDefault();
    }
  }
};

const createTask = () => {
  if (newTaskTitle.value.trim()) {
    emit('create-task', newTaskTitle.value.trim());
    newTaskTitle.value = '';
    resizeTextarea();
  }
};
</script>

<template>
  <div class="new-task-container">
    <textarea
      ref="textareaRef"
      v-model="newTaskTitle"
      placeholder="第一行为标题，Ctrl+Enter/Shift+Enter 换行自动添加子项（- ）"
      class="new-task-input"
      @keydown="handleKeydown"
      @input="resizeTextarea"
      rows="2"
      style="overflow:hidden;"
    ></textarea>
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
  resize: vertical;
}

.new-task-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(187, 134, 252, 0.2);
}

.new-task-input::placeholder {
  color: var(--color-text-secondary);
}
</style>