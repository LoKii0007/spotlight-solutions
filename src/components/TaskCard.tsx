"use client";

import { useState } from "react";
import { Task, Column } from "../types/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EditTaskDialog } from "./EditTaskDialog";

interface TaskCardProps {
  task: Task;
  columns: Column[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

const priorityColors = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

export function TaskCard({ task, columns, onUpdateTask }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="p-4 mb-4 cursor-move hover:shadow-lg transition-shadow"
        onClick={() => setIsEditing(true)}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{task.title}</h3>
          <Badge className={priorityColors[task.priority]}>
            {task.priority}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {task.description}
        </p>
      </Card>

      <EditTaskDialog
        task={task}
        columns={columns}
        open={isEditing}
        onOpenChange={setIsEditing}
        onUpdateTask={onUpdateTask}
      />
    </>
  );
}