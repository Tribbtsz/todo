<script setup lang="ts">
import { computed } from "vue";
import draggable from "vuedraggable";
import TaskCard from "./TaskCard.vue";
import type { Task } from "../types";

const props = defineProps<{
  title: string;
  status: "TODO" | "WIP" | "DONE";
  tasks: Task[];
}>();

const emit = defineEmits<{
  update: [status: "TODO" | "WIP" | "DONE", tasks: Task[]];
}>();

// Compute the column's style based on its status
const columnStyle = computed(() => {
  switch (props.status) {
    case "TODO":
      return { "--column-color": "var(--color-primary)" };
    case "WIP":
      return { "--column-color": "var(--color-wip)" };
    case "DONE":
      return { "--column-color": "var(--color-done)" };
    default:
      return { "--column-color": "var(--color-primary)" };
  }
});

// Handle changes to the task list (due to dragging)
const handleChange = (event: any) => {
  emit("update", props.status, [
    ...(event.moved
      ? props.tasks
      : event.added?.element
      ? [
          ...props.tasks.slice(0, event.added.newIndex),
          { ...event.added.element, status: props.status },
          ...props.tasks.slice(event.added.newIndex),
        ].filter((t): t is Task => !!t)
      : props.tasks),
  ]);
};
</script>

<template>
  <div class="kanban-column" :style="columnStyle">
    <div class="column-header">
      <h2>
        {{ title }}
        <text class="task-count">{{ tasks.length }}</text>
      </h2>
    </div>

    <draggable
      :list="tasks"
      class="task-list"
      group="tasks"
      ghost-class="ghost-task"
      animation="300"
      @change="handleChange"
      item-key="id">
      <template #item="{ element: task }">
        <TaskCard :task="task" />
      </template>
    </draggable>
  </div>
</template>

<style scoped>
.kanban-column {
  background-color: var(--color-surface);
  border-radius: var(--radius-md);
  border-top: 4px solid var(--column-color);
  box-shadow: var(--shadow-sm);
  display: flex;
  padding-top: var(--spacing-3);
  flex-direction: column;
  width: 100%;
  min-height: 400px;
}

.column-header {
  color: var(--column-color);
  margin: 5px 0;
}

.task-count {
  background-color: #3d3c3cbb;
  padding: 0 8px;
  border-radius: 2px;
  font-size: 20px;
  color: var(--column-color);
  margin-left: 4px;
}

.task-list {
  flex: 1;
  padding: var(--spacing-2);
}

.task-list::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>
