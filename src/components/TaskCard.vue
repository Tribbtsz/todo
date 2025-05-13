<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { useTaskStore } from "../stores/taskStore";
import SubtaskList from "./SubtaskList.vue";
import type { Task } from "../types";

const props = defineProps<{
  task: Task;
}>();

const taskStore = useTaskStore();
const isEditing = ref(false);
const showSubtasks = ref(false);
const editingTitle = ref("");

// 新增：用于记录删除按钮点击次数和定时器
const deleteClickCount = ref(0);
const deleteTip = ref("");
const deleteBtnRef = ref<HTMLButtonElement | null>(null);

const toggleSubtasks = () => {
  showSubtasks.value = !showSubtasks.value;
};

// 双击开始编辑
const startEditing = () => {
  editingTitle.value = props.task.title;
  isEditing.value = true;
  // 在编辑开始时调整文本框高度
  nextTick(() => {
    resizeEditTextarea();
  });
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

const resetDeleteState = () => {
  deleteClickCount.value = 0;
};

const deleteTask = () => {
  if (deleteClickCount.value < 2) {
    deleteClickCount.value += 1;
    // 聚焦按钮，确保可以监听blur
    nextTick(() => {
      deleteBtnRef.value?.focus();
    });
  } else {
    taskStore.deleteTask(props.task.id);
    deleteClickCount.value = 0;
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

const titleInput = ref<HTMLTextAreaElement | null>(null);

// 调整编辑框大小
const resizeEditTextarea = () => {
  nextTick(() => {
    const el = titleInput.value;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  });
};

// 格式化任务标题显示
const formattedTitle = computed(() => {
  const lines = props.task.title.split("\n");
  return lines
    .map((line, index) => {
      if (index === 0) return line;
      return line.startsWith("  - ") ? line : `  - ${line}`;
    })
    .join("\n");
});

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    if (e.ctrlKey || e.shiftKey) {
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart ?? 0;
      const end = textarea.selectionEnd ?? 0;
      const value = editingTitle.value;

      // 判断当前光标是否在第一行
      const beforeCursor = value.slice(0, start);
      const lines = beforeCursor.split("\n");
      let insertText = "\n";
      if (lines.length > 1 || start !== 0) {
        insertText = "\n  - ";
      }

      editingTitle.value = value.slice(0, start) + insertText + value.slice(end);

      // 光标移动到新插入内容后
      nextTick(() => {
        const pos = start + insertText.length;
        textarea.selectionStart = textarea.selectionEnd = pos;
        resizeEditTextarea();
      });
      e.preventDefault();
    } else {
      saveTask();
      e.preventDefault();
    }
  }
};
</script>

<template>
  <div class="task-card">
    <div class="task-content">
      <div class="task-header">
        <!-- 非编辑状态：显示格式化的标题 -->
        <pre v-if="!isEditing" @dblclick="startEditing" class="task-title-display">{{
          formattedTitle
        }}</pre>
        <!-- 编辑状态：使用 textarea -->
        <textarea
          v-else
          v-model="editingTitle"
          class="edit-title-input"
          @keydown="handleKeydown"
          @blur="cancelEditing"
          @input="resizeEditTextarea"
          ref="titleInput"
          v-focus></textarea>
        <div class="task-actions">
          <button
            class="btn-icon"
            :class="{
              'delete-yellow': deleteClickCount === 1,
              'delete-red': deleteClickCount === 2,
            }"
            @click="deleteTask"
            @blur="resetDeleteState"
            ref="deleteBtnRef"
            title="Delete task"
            tabindex="0">
            <span class="icon">🗑️</span>
          </button>
        </div>
      </div>
      <!-- 新增：删除提示 -->
      <div v-if="deleteTip" class="delete-tip">{{ deleteTip }}</div>

      <div v-if="task.subtasks.length > 0" class="task-details">
        <div class="progress-container">
          <div class="progress-bar" :style="`width: ${progress}%`"></div>
        </div>
        <div class="subtask-summary">
          <span>
            {{ task.subtasks.filter(s => s.completed).length }}/{{ task.subtasks.length }} subtasks
          </span>
          <button class="btn-toggle" @click="toggleSubtasks">
            {{ showSubtasks ? "Hide" : "Show" }}
          </button>
        </div>
      </div>

      <div v-if="showSubtasks" class="subtask-container">
        <SubtaskList :task-id="task.id" :subtasks="task.subtasks" @add-subtask="addSubtask" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-card {
  background-color: var(--color-card-bg);
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-3);
  transition: all 1s ease;
  cursor: grab;
  width: 100%; /* 确保卡片宽度固定 */
}

/* 新增：删除提示样式 */
.delete-tip {
  color: var(--color-error);
  font-size: 0.85rem;
  margin-top: 4px;
}

.task-content {
  padding: var(--spacing-2);
}

.task-header {
  display: flex;
  justify-content: flex-start; /* 水平靠左 */
  align-items: center; /* 垂直居中 */
  padding-left: 12px; /* 左边距，可根据需要调整 */
}

.task-header h3 {
  font-size: 1rem;
  font-weight: 500;
  word-break: break-word;
  margin-right: var(--spacing-2);
  margin-left: 0; /* 避免多余左边距 */
  cursor: text;
  flex: 1;
  text-align: left; /* 水平靠左 */
  display: flex;
  align-items: center; /* 垂直居中 */
  height: 100%;
}

.task-title-display {
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
  background: none;
  border: none;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: inherit;
  cursor: text;
  flex: 1;
  margin-right: var(--spacing-2);
  text-align: left; /* 确保文字左对齐 */
  line-height: 1.5; /* 添加行高 */
  min-height: 24px; /* 确保最小高度 */
  display: block; /* 改为块级显示 */
}

.edit-title-input {
  flex: 1;
  font-size: 1rem;
  font-weight: 500;
  padding: var(--spacing-2) var(--spacing-3); /* 与显示状态保持一致的内边距 */
  margin-right: var(--spacing-2);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-sm);
  background-color: var(--color-surface);
  color: var(--color-text);
  resize: none;
  overflow: hidden;
  min-height: 24px;
  width: 100%;
  font-family: inherit;
  line-height: 1.5; /* 与显示状态保持一致的行高 */
  white-space: pre-wrap; /* 添加这行确保换行符正确显示 */
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--spacing-2); /* 统一内边距 */
}

.task-actions {
  display: flex;
  gap: var(--spacing-1);
  opacity: 0.5;
  transition: opacity 1s ease;
}

/* .task-card:hover .task-actions {
  opacity: 1;
} */

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
  border-radius: 1px;
  overflow: hidden;
  margin-bottom: var(--spacing-2);
}

.progress-bar {
  height: 100%;
  background-color: var(--color-primary);
  transition: width 1s ease;
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

/* 新增：删除按钮变色样式 */
.delete-yellow {
  background-color: #ff9500 !important;
  color: #333 !important;
}
.delete-red {
  background-color: #ff0000 !important;
  color: #fff !important;
}
</style>
