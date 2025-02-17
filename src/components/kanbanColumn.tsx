"use client";

import { Column, Task } from "../types/types";
import { TaskCard } from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface KanbanColumnProps {
  column: Column;
  columns: Column[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteColumn: (columnId: string) => void;

}

export function KanbanColumn({ column, columns, onUpdateTask, onDeleteColumn }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const isDefaultColumn = ["TODO", "IN_PROGRESS", "DONE"].includes(column.id);

  return (
    <div className="w-80 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{column.title}</h2>
        {!isDefaultColumn && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Column</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this column? All tasks in this column will be moved to "To Do".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() => onDeleteColumn(column.id)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      <div ref={setNodeRef} className="min-h-[200px] h-full">
        <SortableContext
          items={column.tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              columns={columns}
              onUpdateTask={onUpdateTask}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}