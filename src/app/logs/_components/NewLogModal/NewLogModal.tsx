"use client";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { NewLogForm } from "./NewLogForm";
import { useState } from "react";

export const NewLogModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);

  return <Dialog
    open={isModalOpen}
    onOpenChange={(isOpen) => {
      setIsModalOpen(isOpen);
    }}
  >
    <DialogTrigger asChild>
      <Button>Add new</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>New log</DialogTitle>
        <DialogDescription>Log the use of a fragrance</DialogDescription>
      </DialogHeader>
      <NewLogForm closeModal={closeModal} />
    </DialogContent>
  </Dialog>;
};
