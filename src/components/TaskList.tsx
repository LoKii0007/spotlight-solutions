"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Task, taskStatus } from "@/types/types";
import { generateId } from "@/utils/helpers";
import { Check } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateTask, addTask } from "@/redux/slices/BoardSlice";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

export default function TaskList() {
  const boards = useSelector((state: RootState) => state.boards);
  const allTasks = boards.map((board) => board.tasks).flat();
  const [tasks, setTasks] = useState<Task[]>(allTasks);
  const [filter, setFilter] = useState("all");
  const [newTask, setNewTask] = useState({
    title: "",
    priority: "Medium",
    boardId: "",
    description: "",
    status: "",
  });
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleAddTask = async () => {
    if (!newTask.title.trim() || !newTask.boardId || !newTask.priority) {
      return;
    }

    try {
      const data = {
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        priority: newTask.priority,
        boardId: newTask.boardId,
      };

      const res = await axios.post(`/api/tasks`, data);
      if (res.status !== 200) {
        toast({
          title: "Error adding task",
          description: res.data.message,
          variant: "destructive",
        });
      }

      toast({
        title: "Task added successfully",
      });

      setTasks([...tasks, res.data.task]);
      const payload = {
        task: res.data.task,
      };
      dispatch(addTask(payload));
    } catch (error) {
      console.error("Error in adding task : ", error);
      toast({
        title: "Error adding task",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const toggleStatus = async (id: string, boardId: string) => {
    let newStatus = "";
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          newStatus =
            task.status === taskStatus.TODO
              ? taskStatus.IN_PROGRESS
              : task.status === taskStatus.IN_PROGRESS
              ? taskStatus.DONE
              : taskStatus.TODO;
          return { ...task, status: newStatus };
        }
        return task;
      })
    );

    const payload = {
      taskId: id,
      boardId: boardId,
      status: newStatus,
    };

    dispatch(updateTask(payload));

    const res = await axios.put(
      `/api/tasks/${id}`,
      { boardId: boardId, status: newStatus },
      {
        validateStatus: (status) => status < 500,
      }
    );
    if (res.status !== 200) {
      toast({
        title: "Error updating task",
        description: res.data.message,
        variant: "destructive",
      });
    }
  };

  const filteredTasks = tasks.filter(
    (task) => filter === "all" || task.status === filter
  );

  return (
    <div className="w-full mx-auto p-4 border ">
      <div className="flex gap-5 mb-4">
        {["all", taskStatus.TODO, taskStatus.IN_PROGRESS, taskStatus.DONE].map(
          (f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f.replace("-", " ").toUpperCase()}
            </Button>
          )
        )}
      </div>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <Select
          onValueChange={(val) => setNewTask({ ...newTask, boardId: val })}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Board" />
          </SelectTrigger>
          <SelectContent>
            {boards.map((board) => (
              <SelectItem key={board.id} value={board.id}>
                {board.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(val) => setNewTask({ ...newTask, priority: val })}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            {["High", "Medium", "Low"].map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleAddTask}>Add Task</Button>
      </div>

      <div className="flex flex-col gap-4 p-4">
        {tasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div className="flex items-center gap-5">
              <button onClick={() => toggleStatus(task.id, task.boardId)}>
                {task?.status === taskStatus.TODO && (
                  <div className="w-4 h-4 bg-yellow-500"></div>
                )}
                {task?.status === taskStatus.IN_PROGRESS && (
                  <div className="w-4 h-4 flex items-center justify-center bg-blue-500">
                    <Check size={16} />
                  </div>
                )}
                {task?.status === taskStatus.DONE && (
                  <div className="w-4 h-4 flex items-center justify-center bg-green-500">
                    <Check size={16} />
                  </div>
                )}
              </button>
              <div
                className={`w-3 h-3 rounded-full ${
                  task?.priority === "high"
                    ? "bg-red-500"
                    : task?.priority === "low"
                    ? "bg-green-500"
                    : "bg-yellow-500"
                }`}
              ></div>
              <span className="font-semibold">{task.title}</span>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No tasks found</div>
        )}
      </div>
    </div>
  );
}
