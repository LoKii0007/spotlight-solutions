export type Status = string;

export const taskStatus = {
  TODO: "todo",
  IN_PROGRESS: "in-progress",
  DONE: "done",
};

export interface Task {
  userId: string;
  boardId: string;
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: "low" | "medium" | "high";
}

export interface Column {
  id: Status;
  title: string;
  tasks: Task[];
  boardId: string;
}

export interface Board {
  id: string;
  title: string;
  columns: Column[];
  tasks: Task[];
  description: string;
  userId: string;
}
