"use client";

import { KanbanBoard } from "@/components/kanbanBoard";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "axios";
import { Column, Task } from "@/types/types";
import { useToast } from "@/hooks/use-toast";

const page = () => {
  const { id } = useParams();
  const boardId = id as string;
  const boards = useSelector((state: RootState) => state?.boards);
  console.log(boards);
  const board = useSelector((state: RootState) =>
    state?.boards.find((board) => board.id === boardId)
  );
  const [columns, setColumns] = useState<Column[]>(board?.columns || []);
  const [tasks, setTasks] = useState<Task[]>(board?.tasks || []);
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

  // useEffect(() => {
  //   fetchColumns();
  //   fetchTasks();
  // }, [boardId]);

  return (
    <>
      <div className="h-full overflow-y-auto p-8">
        <h1 className="text-2xl font-bold text-center pb-6 text-black">{board?.title}</h1>
        <KanbanBoard boardId={boardId} columns={columns} setColumns={setColumns} tasks={tasks} setTasks={setTasks} />
      </div>
    </>
  );
};

export default page;
