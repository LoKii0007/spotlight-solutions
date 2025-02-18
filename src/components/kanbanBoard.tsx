"use client";

import { useMemo, useState } from "react";
import { Column, Task, Status, Board } from "../types/types";
import { KanbanColumn } from "./kanbanColumn";
import { AddColumnDialog } from "./AddColumnDialog";
import { AddTaskDialog } from "./AddTaskDialog";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { TaskCard } from "./TaskCard";
import { arrayMove } from "@dnd-kit/sortable";
import { useSelector } from "react-redux";
import {
  addTask,
  updateTask,
  addColumn,
  deleteColumn,
} from "../redux/slices/BoardSlice";
import { useDispatch } from "react-redux";
import EditBoardDialog from "./EditBoardDialog";
import { generateId } from "@/utils/helpers";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

export function KanbanBoard({
  boardId,
  columns,
  tasks,
  setTasks,
  setColumns,
}: {
  boardId: string;
  columns: Column[];
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
}) {
  const boards = useSelector((state: any) => state?.boards);
  const board = boards.find((board: Board) => board.id === boardId);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [openAddTaskDialog, setOpenAddTaskDialog] = useState(false);
  const [openAddColumnDialog, setOpenAddColumnDialog] = useState(false);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const { toast } = useToast();
  const dispatch = useDispatch();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getColumnTasks = useMemo(()=>{
    return (columnId: Status) => {
      return tasks.filter((task) => task.status === columnId);
    }
  }, [tasks])

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    const overColumn = columns.find((col) => col.id === over.id);

    if (!activeTask || !overColumn) return;

    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === activeTask.id ? { ...task, status: overColumn.id } : task
      )
    );
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);

    try {
      const { active, over } = event;
      if (!over) return;

      const activeTask = tasks.find((t) => t.id === active.id);
      const overTask = tasks.find((t) => t.id === over.id);

      if (!activeTask || !overTask) return;

      const activeIndex = tasks.findIndex((t) => t.id === active.id);
      const overIndex = tasks.findIndex((t) => t.id === over.id);

      if (activeIndex !== overIndex) {
        setTasks((tasks) => arrayMove(tasks, activeIndex, overIndex));
      }

      const payload = {
        boardId: boardId,
        taskId: activeTask.id,
        status: overTask.status,
      };
      dispatch(updateTask(payload));
      const res = await axios.put(
        `/api/tasks/${activeTask.id}`,
        { status: overTask.status },
        { validateStatus: (status) => status < 500 }
      );
      if (res.status !== 200) {
        toast({
          title: "Error updating task",
          description: res.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in updating task : ", error);
    }
  };

  const handleAddColumn = async (title: string) => {
    setIsAddingColumn(true);
    try {
      const id = title.toUpperCase().replace(/\s+/g, "_");
      const newColumn: Column = {
        id,
        title,
        tasks: [],
        boardId: boardId,
      };
      setColumns([...columns, newColumn]);
      const payload = {
        boardId: boardId,
        column: newColumn,
      };
      dispatch(addColumn(payload));

      const res = await axios.post(`/api/columns`, {
        title,
        boardId: boardId,
      });
      if (res.status !== 200) {
        toast({
          title: "Error adding column",
          description: res.data.message,
          variant: "destructive",
        });
      }
      toast({
        title: "Column added successfully",
        description: "Column added successfully",
      });
    } catch (error) {
      toast({
        title: "Error adding column",
        description: "Error adding column",
        variant: "destructive",
      });
    } finally {
      setIsAddingColumn(false);
      setOpenAddColumnDialog(false);
    }
  };

  const handleDeleteColumn = async (columnId: string) => {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.status === columnId ? { ...task, status: "TODO" } : task
      )
    );

    setColumns((columns) => columns.filter((col) => col.id !== columnId));
    const payload = {
      boardId: boardId,
      columnId: columnId,
    };
    dispatch(deleteColumn(payload));
  };

  const handleAddTask = async (taskData: Partial<Task>) => {
    setIsAddingTask(true);
    try {
      const data = {
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        boardId: boardId,
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
        ...res.data.task,
      };
      dispatch(addTask(payload));
    } catch (error) {
      toast({
        title: "Error adding task",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsAddingTask(false);
      setOpenAddTaskDialog(false);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      setTasks((tasks) =>
        tasks.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      );
      const payload = {
        ...updates,
        boardId: boardId,
        taskId: taskId,
      };
      dispatch(updateTask(payload));

      const res = await axios.put(`/api/tasks/${taskId}`, updates, {
        validateStatus: (status) => status < 500,
      });
      if (res.status !== 200) {
        toast({
          title: "Error updating task",
          description: res.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error updating task",
        description: "Error updating task",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center gap-4">
        <EditBoardDialog
          boardId={boardId}
          title={board?.title || ""}
          description={board?.description || ""}
        />
        <AddTaskDialog
          onAddTask={handleAddTask}
          columns={columns}
          isAddingTask={isAddingTask}
          open={openAddTaskDialog}
          setOpen={setOpenAddTaskDialog}
        />
        <AddColumnDialog
          onAddColumn={handleAddColumn}
          open={openAddColumnDialog}
          setOpen={setOpenAddColumnDialog}
          isAddingColumn={isAddingColumn}
        />
      </div>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 p-8 overflow-x-auto min-h-[calc(100vh-200px)]">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={{ ...column, tasks: getColumnTasks(column.id) }}
              columns={columns}
              onUpdateTask={handleUpdateTask}
              onDeleteColumn={handleDeleteColumn}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask && (
            <TaskCard
              task={activeTask}
              columns={columns}
              onUpdateTask={handleUpdateTask}
            />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
