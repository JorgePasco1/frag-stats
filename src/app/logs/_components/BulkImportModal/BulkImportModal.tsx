"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";
import { useBulkImportState } from "./hooks/useBulkImportState";
import { useBulkSave } from "./hooks/useBulkSave";
import { TextInputStep } from "./steps/TextInputStep";
import { ReviewTableStep } from "./steps/ReviewTableStep";
import { SaveProgressStep } from "./steps/SaveProgressStep";
import { toast } from "sonner";

export function BulkImportModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { state, actions } = useBulkImportState();
  const { data: userFragrances, isLoading } =
    api.userFragrances.getLogOptions.useQuery();

  const closeModal = () => {
    setIsModalOpen(false);
    actions.reset();
  };

  const { executeBulkSave } = useBulkSave(
    (update) => {
      actions.updateSaveProgress(update);
    },
    () => {
      const { completed, failed } = state.saveProgress;
      if (completed > 0) {
        toast.success(`Successfully saved ${completed} log${completed !== 1 ? "s" : ""}`);
      }
      if (failed > 0) {
        toast.error(`Failed to save ${failed} log${failed !== 1 ? "s" : ""}`);
      }
    },
  );

  const handleParseText = () => {
    if (!userFragrances) {
      toast.error("Unable to load your fragrance collection");
      return;
    }
    actions.parseText(userFragrances);
  };

  const handleSave = async () => {
    const validEntries = actions.getValidEntries();
    if (validEntries.length === 0) {
      toast.error("No valid entries to save");
      return;
    }
    actions.goToStep("saving");
    await executeBulkSave(validEntries);
  };

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(isOpen) => {
        setIsModalOpen(isOpen);
        if (!isOpen) {
          actions.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Add multiple</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Import Logs</DialogTitle>
          <DialogDescription>
            Paste your fragrance log text and import multiple entries at once
          </DialogDescription>
        </DialogHeader>

        {state.step === "input" && (
          <TextInputStep
            rawText={state.rawText}
            onChange={actions.setRawText}
            onLoad={handleParseText}
          />
        )}

        {state.step === "review" && userFragrances && (
          <ReviewTableStep
            entries={state.parsedEntries}
            userFragrances={userFragrances}
            onUpdateEntry={actions.updateEntry}
            onDeleteEntry={actions.deleteEntry}
            onBack={() => actions.goToStep("input")}
            onSave={handleSave}
          />
        )}

        {state.step === "saving" && (
          <SaveProgressStep progress={state.saveProgress} onClose={closeModal} />
        )}

        {isLoading && <div>Loading your fragrance collection...</div>}
      </DialogContent>
    </Dialog>
  );
}
