import type { UserFragranceBasicData } from "~/types/UserFragrance.types";

interface MatchResult {
  fragranceId: number;
  userFragranceId: number;
  confidence: number;
  fullName: string;
}

export function fuzzyMatchFragrance(
  input: string,
  userFragrances: UserFragranceBasicData[],
): MatchResult | null {
  const normalizedInput = normalizeString(input);
  let bestMatch: MatchResult | null = null;
  let bestScore = 0;

  for (const frag of userFragrances) {
    const fullName = `${frag.house} ${frag.name}`;
    const normalizedFullName = normalizeString(fullName);
    const normalizedNameOnly = normalizeString(frag.name);

    // Calculate similarity scores
    const fullScore = calculateSimilarity(normalizedInput, normalizedFullName);
    const nameOnlyScore = calculateSimilarity(
      normalizedInput,
      normalizedNameOnly,
    );
    const score = Math.max(fullScore, nameOnlyScore);

    if (score > bestScore && score > 0.5) {
      // Minimum threshold
      bestScore = score;
      bestMatch = {
        fragranceId: frag.fragranceId,
        userFragranceId: frag.userFragranceId,
        confidence: score,
        fullName,
      };
    }
  }

  return bestMatch;
}

function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s]/g, "") // Remove special chars
    .trim();
}

function calculateSimilarity(a: string, b: string): number {
  // Exact match
  if (a === b) return 1;

  // Substring match
  if (b.includes(a) || a.includes(b)) {
    return Math.min(a.length, b.length) / Math.max(a.length, b.length);
  }

  // Levenshtein distance
  const distance = levenshteinDistance(a, b);
  const maxLength = Math.max(a.length, b.length);
  return 1 - distance / maxLength;
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  // Initialize first column
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // Initialize first row
  for (let j = 0; j <= a.length; j++) {
    matrix[0]![j] = j;
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i]![j] = matrix[i - 1]![j - 1]!;
      } else {
        matrix[i]![j] = Math.min(
          matrix[i - 1]![j - 1]! + 1, // substitution
          matrix[i]![j - 1]! + 1, // insertion
          matrix[i - 1]![j]! + 1, // deletion
        );
      }
    }
  }

  return matrix[b.length]![a.length]!;
}
