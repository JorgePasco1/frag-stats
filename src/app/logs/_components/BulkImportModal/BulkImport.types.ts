export type ImportStep = "input" | "review" | "saving";

export interface ParsedLogEntry {
  id: string;
  rawLine: string;
  date: Date | null;
  fragranceName: string;
  matchedFragranceId: number | null;
  matchedUserFragranceId: number | null;
  matchConfidence: number;
  timeOfDay: "day" | "night" | null;
  weather: "hot" | "cold" | "mild" | null;
  enjoyment: number | null;
  notes: string | null;
  isValid: boolean;
}

export interface BulkImportState {
  step: ImportStep;
  rawText: string;
  parsedEntries: ParsedLogEntry[];
  saveProgress: {
    total: number;
    completed: number;
    failed: number;
    errors: Array<{ entryId: string; error: string }>;
  };
}
