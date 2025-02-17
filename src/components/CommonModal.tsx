"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
export default function CommonModal({
  buttonText,
  title,
  description,
  open,
  setOpen,  
  handleAction,
}: {
  buttonText: string;
  title: string;
  description: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  handleAction: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
            </DialogClose>
          <DialogClose asChild>
            <Button onClick={() => handleAction()} variant="default">{buttonText}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
