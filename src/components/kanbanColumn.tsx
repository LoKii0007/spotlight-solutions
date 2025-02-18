"use client";

import { Column, Task } from "../types/types";
import { TaskCard } from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
interface KanbanColumnProps {
  column: Column;
  columns: Column[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteColumn: (columnId: string) => void;
}

export function KanbanColumn({
  column,
  columns,
  onUpdateTask,
  onDeleteColumn,
}: KanbanColumnProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [openDeleteColumnDialog, setOpenDeleteColumnDialog] = useState(false);
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const isDefaultColumn = ["TODO", "IN_PROGRESS", "DONE"].includes(column.id);

  async function handleDeleteColumn() {
    setIsDeleting(true);
    try {
      onDeleteColumn(column.id);
      const res = await axios.delete(`/api/columns/${column.id}`);
      if (res.status !== 200) {
        toast({
          title: "Error deleting column",
          description: res.data.message,
          variant: "destructive",
        });
      }
      toast({
        title: "Column deleted successfully",
        description: "Column deleted successfully",
      });
    } catch (error) {
      console.error("Error in deleting column : ", error);
      toast({
        title: "Error deleting column",
        description: "Error deleting column",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setOpenDeleteColumnDialog(false);
    }
  }

  return (
    <div className="w-80 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{column.title}</h2>
        {!isDefaultColumn && (
          <Dialog
            open={openDeleteColumnDialog}
            onOpenChange={setOpenDeleteColumnDialog}
          >
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Column</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this column? All tasks in this
                  column will be moved to "To Do".
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  className="bg-red-500 hover:bg-red-600"
                  onClick={handleDeleteColumn}
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
