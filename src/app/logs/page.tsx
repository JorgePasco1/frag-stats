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
import { NewLogForm } from "./_components/NewLogForm";
import { api } from "~/trpc/react";
import { useState } from "react";

const LogsIndex = () => {
  void api.userFragrances.getAll.usePrefetchQuery();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex flex-col items-center gap-4 pb-4 pt-4">
      <h1 className="text-xl font-bold">Logs</h1>
      <Dialog
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
      </Dialog>
    </div>
  );
};

export default LogsIndex;
