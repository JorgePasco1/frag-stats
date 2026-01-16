import { useState } from "react";
import type {
  BulkImportState,
  ImportStep,
  ParsedLogEntry,
} from "../BulkImport.types";
import { parseMultipleLogText } from "../lib/bulkLogParser";
import type { UserFragranceBasicData } from "~/types/UserFragrance.types";

export function useBulkImportState() {
  const [state, setState] = useState<BulkImportState>({
    step: "input",
    rawText: "",
    parsedEntries: [],
    saveProgress: { total: 0, completed: 0, failed: 0, errors: [] },
  });

  const setRawText = (text: string) => {
    setState((prev) => ({ ...prev, rawText: text }));
  };

  const parseText = (userFragrances: UserFragranceBasicData[]) => {
    const entries = parseMultipleLogText(state.rawText, userFragrances);
    setState((prev) => ({
      ...prev,
      parsedEntries: entries,
      step: "review",
    }));
  };

  const updateEntry = (id: string, updates: Partial<ParsedLogEntry>) => {
    setState((prev) => ({
      ...prev,
      parsedEntries: prev.parsedEntries.map((entry) => {
        if (entry.id === id) {
          const updated = { ...entry, ...updates };
          // Recalculate isValid
          updated.isValid =
            updated.matchedFragranceId !== null && updated.date !== null;
          return updated;
        }
        return entry;
      }),
    }));
  };

  const deleteEntry = (id: string) => {
    setState((prev) => ({
      ...prev,
      parsedEntries: prev.parsedEntries.filter((entry) => entry.id !== id),
    }));
  };

  const goToStep = (step: ImportStep) => {
    setState((prev) => ({ ...prev, step }));
  };

  const reset = () => {
    setState({
      step: "input",
      rawText: "",
      parsedEntries: [],
      saveProgress: { total: 0, completed: 0, failed: 0, errors: [] },
    });
  };

  const updateSaveProgress = (
    update: Partial<BulkImportState["saveProgress"]>,
  ) => {
    setState((prev) => ({
      ...prev,
      saveProgress: { ...prev.saveProgress, ...update },
    }));
  };

  const getValidEntries = () => {
    return state.parsedEntries.filter((entry) => entry.isValid);
  };

  return {
    state,
    actions: {
      setRawText,
      parseText,
      updateEntry,
      deleteEntry,
      goToStep,
      reset,
      updateSaveProgress,
      getValidEntries,
    },
  };
}
