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

const LogsIndex = () => {
  return (
    <div className="flex flex-col items-center gap-4 pb-4 pt-4">
      <h1 className="text-xl font-bold">Logs</h1>
      <Dialog>
        <DialogTrigger>
          <Button>Add new</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New log</DialogTitle>
            <DialogDescription>Log the use of a fragrance</DialogDescription>
          </DialogHeader>
          <NewLogForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LogsIndex;
