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
  const [startedAt, setStartedAt] = useState<Date | null>(null);

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(isOpen) => {
        setIsModalOpen(isOpen);
        setStartedAt(isOpen ? new Date() : null);
      }}
    >
      <DialogTrigger asChild>
        <Button>Add new</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New log</DialogTitle>
          <DialogDescription>
            <div>Log the use of a fragrance</div>
            {startedAt && (
              <div className="text-xs text-slate-500">
                Started at {startedAt.toLocaleString()}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <NewLogForm closeModal={closeModal} />
      </DialogContent>
    </Dialog>
  );
};
