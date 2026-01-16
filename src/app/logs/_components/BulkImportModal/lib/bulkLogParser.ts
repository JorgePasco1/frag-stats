import type { UserFragranceBasicData } from "~/types/UserFragrance.types";
import type { ParsedLogEntry } from "../BulkImport.types";
import { fuzzyMatchFragrance } from "./fuzzyMatcher";
import { parseDayHeader } from "./dateInference";

const TIME_KEYWORDS = {
  day: ["day", "dia", "día", "morning", "mañana", "tarde", "afternoon", "almuerzo"],
  night: ["night", "noche", "evening", "bed", "cena", "dinner"],
};

const WEATHER_KEYWORDS = {
  hot: ["hot", "caliente", "calor"],
  cold: ["cold", "frio", "frío"],
  mild: ["mild", "templado", "warm"],
};

export function parseMultipleLogText(
  text: string,
  userFragrances: UserFragranceBasicData[],
): ParsedLogEntry[] {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const entries: ParsedLogEntry[] = [];
  let currentDate: Date | null = null;

  for (const line of lines) {
    // Try to parse as day header
    const dayHeader = parseDayHeader(line);
    if (dayHeader) {
      currentDate = dayHeader;
      continue;
    }

    // Parse as fragrance entry
    const entry = parseFragranceLine(line, currentDate, userFragrances);
    entries.push(entry);
  }

  return entries;
}

function parseFragranceLine(
  line: string,
  currentDate: Date | null,
  userFragrances: UserFragranceBasicData[],
): ParsedLogEntry {
  const id = generateUniqueId();

  // Split by colon if present
  let fragrancePart: string;
  let contextPart: string | null = null;

  if (line.includes(":")) {
    const parts = line.split(":");
    fragrancePart = parts[0]?.trim() ?? "";
    contextPart = parts[1]?.trim() ?? null;
  } else {
    fragrancePart = line;
  }

  // Extract metadata from the line
  const timeOfDay = extractTimeOfDay(line);
  const weather = extractWeather(line);
  const enjoyment = extractRating(line);

  // Clean fragrance name (remove detected keywords)
  const fragranceName = cleanFragranceName(
    fragrancePart,
    timeOfDay,
    weather,
    enjoyment,
  );

  // Fuzzy match against user's collection
  const match = fuzzyMatchFragrance(fragranceName, userFragrances);

  // Build notes from remaining context
  const notes = buildNotes(contextPart, timeOfDay, weather, enjoyment);

  return {
    id,
    rawLine: line,
    date: currentDate,
    fragranceName,
    matchedFragranceId: match?.fragranceId ?? null,
    matchedUserFragranceId: match?.userFragranceId ?? null,
    matchConfidence: match?.confidence ?? 0,
    timeOfDay,
    weather,
    enjoyment,
    notes,
    isValid: match !== null && currentDate !== null,
  };
}

function extractTimeOfDay(text: string): "day" | "night" | null {
  const normalizedText = text.toLowerCase();

  for (const keyword of TIME_KEYWORDS.night) {
    if (normalizedText.includes(keyword)) {
      return "night";
    }
  }

  for (const keyword of TIME_KEYWORDS.day) {
    if (normalizedText.includes(keyword)) {
      return "day";
    }
  }

  return null;
}

function extractWeather(text: string): "hot" | "cold" | "mild" | null {
  const normalizedText = text.toLowerCase();

  for (const keyword of WEATHER_KEYWORDS.hot) {
    if (normalizedText.includes(keyword)) {
      return "hot";
    }
  }

  for (const keyword of WEATHER_KEYWORDS.cold) {
    if (normalizedText.includes(keyword)) {
      return "cold";
    }
  }

  for (const keyword of WEATHER_KEYWORDS.mild) {
    if (normalizedText.includes(keyword)) {
      return "mild";
    }
  }

  return null;
}

function extractRating(text: string): number | null {
  // Look for standalone number 1-10 at the end of the line
  const regex = /\b([1-9]|10)\b\s*$/;
  const match = regex.exec(text);
  if (match) {
    const rating = parseInt(match[1]!, 10);
    if (rating >= 1 && rating <= 10) {
      return rating;
    }
  }
  return null;
}

function cleanFragranceName(
  fragrance: string,
  timeOfDay: "day" | "night" | null,
  weather: "hot" | "cold" | "mild" | null,
  rating: number | null,
): string {
  let cleaned = fragrance;

  // Remove rating if it's at the end
  if (rating !== null) {
    cleaned = cleaned.replace(new RegExp(`\\b${rating}\\b\\s*$`), "").trim();
  }

  // Remove time of day keywords
  if (timeOfDay) {
    const keywords = TIME_KEYWORDS[timeOfDay];
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      cleaned = cleaned.replace(regex, "");
    }
  }

  // Remove weather keywords
  if (weather) {
    const keywords = WEATHER_KEYWORDS[weather];
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      cleaned = cleaned.replace(regex, "");
    }
  }

  return cleaned.trim();
}

function buildNotes(
  contextPart: string | null,
  timeOfDay: "day" | "night" | null,
  weather: "hot" | "cold" | "mild" | null,
  rating: number | null,
): string | null {
  if (!contextPart) return null;

  let notes = contextPart;

  // Remove time of day keywords
  if (timeOfDay) {
    const keywords = TIME_KEYWORDS[timeOfDay];
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      notes = notes.replace(regex, "");
    }
  }

  // Remove weather keywords
  if (weather) {
    const keywords = WEATHER_KEYWORDS[weather];
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      notes = notes.replace(regex, "");
    }
  }

  // Remove rating
  if (rating !== null) {
    notes = notes.replace(new RegExp(`\\b${rating}\\b`, "g"), "");
  }

  notes = notes.trim();
  return notes.length > 0 ? notes : null;
}

function generateUniqueId(): string {
  return `entry_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}
