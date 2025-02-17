import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { deleteBoard } from "@/redux/slices/BoardSlice";
import { Board } from "@/types/types";
import axios from "axios";

const DeleteBoardDialog = ({ boardId, setBoards }: { boardId: string, setBoards? : React.Dispatch<React.SetStateAction<Board[]>> }) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const dispatch = useDispatch();

  const handleDeleteBoard = async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await axios.delete(`/api/board/${id}`);
      if (res.status !== 200) {
        toast({
          title: "Error deleting board",
          description: res.data.message,
          variant: "destructive",
        });
      }
      toast({
        title: "Board deleted successfully",
        description: "Board deleted successfully",
        variant: "default",
      });
      setBoards?.((prev: Board[]) => prev.filter((board: Board) => board.id !== id));
      dispatch(deleteBoard(id));
    } catch (error) {
      toast({
        title: "Error deleting board",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex gap-2 shadow-none border-0 bg-transparent hover:bg-transparent text-red-500 px-8 hover:text-red-600"
          >
            <Trash className="h-full w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Board</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this board?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={() => handleDeleteBoard(boardId)} type="submit">
              Delete Board
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteBoardDialog;
