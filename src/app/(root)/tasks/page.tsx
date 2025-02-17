"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import {
  addBoard,
  deleteBoard,
  editBoard,
  initializeBoards,
} from "@/redux/slices/BoardSlice";
import { useDispatch } from "react-redux";
import { Board } from "@/types/types";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import EditBoardDialog from "@/components/EditBoardDialog";
import DeleteBoardDialog from "@/components/DeleteBoardDialog";

const page = () => {
  const [open, setOpen] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [boards, setBoards] = useState<Board[]>([]);
  const [fetched, setFetched] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleAddBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("/api/board", {
        title: boardName,
        description,
      });
      if (res.status !== 200) {
        toast({
          title: "Error adding board",
          description: res.data.message,
          variant: "destructive",
        });
      }
      toast({
        title: "Board added successfully",
        description: "Board added successfully",
        variant: "default",
      });
      console.log(res.data.board);
      setBoards([...boards, res.data.board]);
      dispatch(
        addBoard({ id: res.data.board.id, title: boardName, description })
      );
    } catch (error) {
      toast({
        title: "Error adding board",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  async function fetchBoards() {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/board");
      if (res.status !== 200) {
        toast({
          title: "Error fetching boards",
          description: res.data.message,
          variant: "destructive",
        });
      }
      const data: Board[] = res.data.boards;
      setFetched(true);
      setBoards(data);
      dispatch(initializeBoards(data));
    } catch (error) {
      console.log(error);
      toast({
        title: "Error fetching boards",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <div className="p-12 flex flex-col gap-12">
      <div className="board-top flex justify-between items-center">
        <h1 className="text-2xl font-bold">All Boards</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex gap-2 rounded-full bg-emerald-500 text-white px-8 hover:bg-emerald-600 hover:text-white"
            >
              <PlusCircle className="h-4 w-4" />
              Add Board
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Board</DialogTitle>
              <DialogDescription>Add a new board to the list</DialogDescription>
            </DialogHeader>
            <Input
              placeholder="Board Name"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
            />
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAddBoard} type="submit">
                Add Board
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="boards-bottom flex flex-col gap-3">
        {isLoading ? (
          <div>Loading...</div>
        ) : boards.length > 0 ? (
          boards.map((board: Board, index: number) => (
            <div
              key={board.id}
              className="flex justify-between items-center border border-gray-600 bg-white text-black hover:bg-gray-100 shadow-sm"
            >
              <button
                onClick={() => router.push(`/tasks/${board.id}`)}
                className="board-card flex gap-12 justify-start px-12 items-center py-2 w-[90%]"
              >
                <h3>{index + 1}</h3>
                <h3>{board.title}</h3>
              </button>

              <EditBoardDialog
                boardId={board.id}
                title={board.title}
                description={board.description}
                setBoards={setBoards}
              />

              <DeleteBoardDialog
                boardId={board.id}
                setBoards={setBoards}
              />

            </div>
          ))
        ) : (
          <div>No boards found</div>
        )}
      </div>
    </div>
  );
};

export default page;
