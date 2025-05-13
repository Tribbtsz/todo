export interface SubTask {
  id: string;
  title: string;
  completed?: boolean;
}

export interface Task {
  id: string;
  title: string;
  status: 'TODO' | 'WIP' | 'DONE';
  subtasks: SubTask[];
}