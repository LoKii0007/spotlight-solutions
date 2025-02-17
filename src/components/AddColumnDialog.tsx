"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";

interface AddColumnDialogProps {
  onAddColumn: (title: string) => void;
}

export function AddColumnDialog({ onAddColumn }: AddColumnDialogProps) {
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddColumn(title.trim());
      setTitle("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Column
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Column</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Enter column title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button type="submit">Add Column</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}