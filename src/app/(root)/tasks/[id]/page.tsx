"use client";

import { KanbanBoard } from "@/components/kanbanBoard";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "axios";
import { Column, Task } from "@/types/types";
import { useToast } from "@/hooks/use-toast";

const page = () => {
  const { id } = useParams();
  const boardId = id as string;
  const board = useSelector((state: RootState) =>
    state?.boards.find((board) => board.id === boardId)
  );
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  async function fetchColumns() {
    try {
      const res = await axios.get(`/api/columns/${boardId}`);
      if (res.status !== 200) {
        toast({
          title: "Error fetching columns",
          description: res.data.message,
          variant: "destructive",
        });
      }
      console.log(res.data.columns);
      setColumns(res.data.columns);
    } catch (error) {
      console.error("Error in fetching columns : ", error);
      toast({
        title: "Error fetching columns",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  }

  async function fetchTasks() {
    try {
      const res = await axios.get(`/api/tasks/${boardId}`);
      if (res.status !== 200) {
        toast({
          title: "Error fetching tasks",
          description: res.data.message,
          variant: "destructive",
        });
      }
      console.log(res.data.tasks);
      setTasks(res.data.tasks);
    } catch (error) {
      console.error("Error in fetching tasks : ", error);
      toast({
        title: "Error fetching tasks",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    fetchColumns();
    fetchTasks();
  }, []);

  return (
    <>
      <div className="p-12">
        <h1 className="text-2xl font-bold text-center pb-6">{board?.title}</h1>
        <KanbanBoard boardId={boardId} columns={columns} setColumns={setColumns} tasks={tasks} setTasks={setTasks} />
      </div>
    </>
  );
};

export default page;
