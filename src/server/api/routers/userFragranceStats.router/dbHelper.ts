import {
  fragrances,
  userFragranceLogs,
  fragranceNoteSummaries,
} from "~/server/db/schema";
import { and, eq, sql, desc, inArray } from "drizzle-orm";
import {  generateNoteSummary } from "./chatGptHelper";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "~/server/db/schema";

export async function getUserFragranceStats(
  db: PostgresJsDatabase<typeof schema>,
  currentUserId: string,
  fragranceId: number,
) {
  // First, get the IDs of the 20 most recent entries
  const recentLogIds = await db
    .select({ id: userFragranceLogs.id })
    .from(userFragranceLogs)
    .where(
      and(
        eq(userFragranceLogs.userId, currentUserId),
        eq(userFragranceLogs.fragranceId, fragranceId),
        eq(userFragranceLogs.testedInBlotter, false),
        sql`${userFragranceLogs.useCase} != 'guess_game'`,
      ),
    )
    .orderBy(desc(userFragranceLogs.logDate))
    .limit(20);

  // If no logs found, return empty array
  if (recentLogIds.length === 0) {
    return [];
  }

  // Then, get the full details of those entries, sorted from oldest to most recent
  return db
    .select({
      enjoyment: userFragranceLogs.enjoyment,
      logDate: userFragranceLogs.logDate,
      notes: userFragranceLogs.notes,
      useCase: userFragranceLogs.useCase,
      fragranceName: fragrances.name,
      fragranceHouse: fragrances.house,
      weather: userFragranceLogs.weather,
      timeOfDay: userFragranceLogs.timeOfDay,
    })
    .from(userFragranceLogs)
    .innerJoin(fragrances, eq(userFragranceLogs.fragranceId, fragrances.id))
    .where(
      inArray(
        userFragranceLogs.id,
        recentLogIds.map((log) => log.id),
      ),
    )
    .orderBy(userFragranceLogs.logDate);
}

export async function createNoteSummary(
  db: PostgresJsDatabase<typeof schema>,
  currentUserId: string,
  fragranceId: number,
) {
  const userFragranceStats = await getUserFragranceStats(db, currentUserId, fragranceId);

  if (userFragranceStats.length === 0) return null;

  const notes = userFragranceStats.map((stat) => ({
    notes: stat.notes ?? "",
    useCase: stat.useCase ?? "unspecified",
    enjoyment: stat.enjoyment,
    fragranceName: stat.fragranceName,
    fragranceHouse: stat.fragranceHouse,
    weather: stat.weather,
    timeOfDay: stat.timeOfDay,
  }));

  const summary = await generateNoteSummary(notes);

  // Save the new summary
  const [newSummary] = await db
    .insert(fragranceNoteSummaries)
    .values({
      userId: currentUserId,
      fragranceId,
      summary,
    })
    .returning();

  return newSummary?.summary;
}

export async function getFragranceDetails(
  db: PostgresJsDatabase<typeof schema>,
  fragranceId: number,
) {
  const fragrance = (
    await db
      .select({
        house: fragrances.house,
        name: fragrances.name,
      })
      .from(fragrances)
      .where(eq(fragrances.id, fragranceId))
      .limit(1)
  )[0];

  if (!fragrance) {
    throw new Error("Fragrance not found");
  }

  return fragrance;
}