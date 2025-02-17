import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Board } from "@/types/types";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { editBoard } from "@/redux/slices/BoardSlice";

const EditBoardDialog = ({
  boardId,
  title,
  description,
  setBoards,
}: {
  boardId: string;
  title: string;
  description: string;
  setBoards?: React.Dispatch<React.SetStateAction<Board[]>>;
}) => {
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const dispatch = useDispatch();

  const handleEditBoard = async (id: string, updates: Partial<Board>) => {
    setOpen(true);
    setIsEditing(true);
    try {
      const res = await axios.put(`/api/board/${id}`, updates);
      if (res.status !== 200) {
        toast({
          title: "Error editing board",
          description: res.data.message,
          variant: "destructive",
        });
      }
      toast({
        title: "Board updated successfully",
        description: "Board updated successfully",
        variant: "default",
      });
      setBoards?.((prev: Board[]) =>
        prev.map((board: Board) =>
          board.id === id ? res.data.updatedBoard : board
        )
      );
      dispatch(editBoard({ id, ...updates }));
    } catch (error) {
      toast({
        title: "Error editing board",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setOpen(false);
      setIsEditing(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Edit</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Board</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Edit the board title and description.
          </DialogDescription>
          <Input
            type="text"
            placeholder="Board Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Board Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <Button
            onClick={() =>
              handleEditBoard(boardId, {
                title: newTitle,
                description: newDescription,
              })
            }
            type="submit"
          >
            {isEditing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditBoardDialog;
