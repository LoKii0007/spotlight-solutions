"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Task, Status } from "@/types/types";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { deleteTask } from "@/redux/slices/BoardSlice";

interface EditTaskDialogProps {
  task: Task;
  columns: { id: Status; title: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

export function EditTaskDialog({
  task,
  columns,
  open,
  onOpenChange,
  onUpdateTask,
}: EditTaskDialogProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState<Status>(task.status);
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    task.priority
  );
  const { toast } = useToast();
  const dispatch = useDispatch();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onUpdateTask(task.id, {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
      });
      onOpenChange(false);
    }
  };

  const handleDeleteTask = async () => {
    try {
      const payload = {
        boardId: task.boardId,
        taskId: task.id,
      };
      dispatch(deleteTask(payload));
      const res = await axios.delete(`/api/tasks/${task.id}`);
      if (res.status !== 200) {
        toast({
          title: "Error deleting task",
          description: res.data.message,
          variant: "destructive",
        });
      }
      toast({
        title: "Task deleted successfully",
        description: "Task deleted successfully",
      });
      onOpenChange(false);
    } catch (error) {
      // console.error("Error in deleting task : ", error);
      toast({
        title: "Error deleting task",
        description: "Error deleting task",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((column) => (
                    <SelectItem key={column.id} value={column.id}>
                      {column.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Select
                value={priority}
                onValueChange={(value) =>
                  setPriority(value as "low" | "medium" | "high")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" className="w-full">
            Save Changes
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleDeleteTask}
          >
            Delete Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
