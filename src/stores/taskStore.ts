import { reactive, watch } from "vue";
import { v4 as uuidv4 } from "uuid";
import type { Task, SubTask } from "../types";

// Create a singleton store
const tasks = reactive<Task[]>([]);
const STORAGE_KEY = "kanban-tasks";

export function useTaskStore() {
  // Load tasks from localStorage
  const loadTasks = (): void => {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    if (storedTasks) {
      const parsedTasks = JSON.parse(storedTasks);
      tasks.splice(0, tasks.length, ...parsedTasks);
    }
  };

  // Save tasks to localStorage whenever they change
  watch(
    tasks,
    () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    },
    { deep: true }
  );

  // Create a new task
  const addTask = (title: string, status: "TODO" | "WIP" | "DONE" = "TODO"): void => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      status,
      subtasks: [],
    };
    tasks.push(newTask);
  };

  // Update an existing task
  const updateTask = (taskId: string, updates: Partial<Task>): void => {
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      const updatedTask = { ...tasks[index], ...updates };
      tasks.splice(index, 1, updatedTask as Task);
    }
  };

  // Delete a task
  const deleteTask = (taskId: string): void => {
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      tasks.splice(index, 1);
    }
  };

  // Add a subtask to a task
  const addSubtask = (taskId: string, title: string): void => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newSubtask: SubTask = {
        id: uuidv4(),
        title,
        completed: false,
      };
      task.subtasks.push(newSubtask);
    }
  };

  // Update a subtask
  const updateSubtask = (taskId: string, subtaskId: string, updates: Partial<SubTask>): void => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const subtaskIndex = task.subtasks.findIndex(st => st.id === subtaskId);
      if (subtaskIndex !== -1) {
        const updatedSubtask = { ...task.subtasks[subtaskIndex], ...updates };
        task.subtasks.splice(subtaskIndex, 1, updatedSubtask as SubTask);
      }
    }
  };

  // Delete a subtask
  const deleteSubtask = (taskId: string, subtaskId: string): void => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const subtaskIndex = task.subtasks.findIndex(st => st.id === subtaskId);
      if (subtaskIndex !== -1) {
        task.subtasks.splice(subtaskIndex, 1);
      }
    }
  };

  // Get tasks by status
  const getTasksByStatus = (status: "TODO" | "WIP" | "DONE"): Task[] => {
    return tasks.filter(task => task.status === status);
  };

  // Move a task to a different status
  const moveTask = (taskId: string, newStatus: "TODO" | "WIP" | "DONE"): void => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.status = newStatus;
    }
  };

  // Reorder tasks within the same status
  const reorderTasks = (status: "TODO" | "WIP" | "DONE", newOrderedTasks: Task[]): void => {
    // Remove all tasks with the given status
    const filteredTasks = tasks.filter(task => task.status !== status);

    // Add the reordered tasks back
    filteredTasks.push(...newOrderedTasks);

    // Replace all tasks
    tasks.splice(0, tasks.length, ...filteredTasks);
  };

  return {
    tasks,
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    addSubtask,
    updateSubtask,
    deleteSubtask,
    getTasksByStatus,
    moveTask,
    reorderTasks,
  };
}
