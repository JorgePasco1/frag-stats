import {
  fragrances,
  userFragranceLogs,
  fragranceNoteSummaries,
} from "~/server/db/schema";
import { createTRPCRouter, privateProcedure } from "../../trpc";
import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import { checkRecentSummary, generateNoteSummary } from "./chatGptHelper";

export const userFragranceStatsRouter = createTRPCRouter({
  getUserFragranceStats: privateProcedure
    .input(
      z.object({
        fragranceId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { currentUserId, db } = ctx;
      const { fragranceId } = input;

      // Fragrance house and name
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

      const userFragranceStats = await db
        .select({
          enjoyment: userFragranceLogs.enjoyment,
          logDate: userFragranceLogs.logDate,
          notes: userFragranceLogs.notes,
        })
        .from(userFragranceLogs)
        .where(
          and(
            eq(userFragranceLogs.userId, currentUserId),
            eq(userFragranceLogs.fragranceId, fragranceId),
            eq(userFragranceLogs.testedInBlotter, false),
            sql`${userFragranceLogs.useCase} != 'guess_game'`,
          ),
        );

      // Check for recent summary
      const existingSummary = await checkRecentSummary(
        db,
        currentUserId,
        fragranceId,
      );

      // If no recent summary exists, generate a new one
      if (!existingSummary) {
        const notes = userFragranceStats
          .map((stat) => stat.notes)
          .filter((note): note is string => note !== null);

        if (notes.length > 0) {
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

          return {
            fragrance,
            userFragranceStats,
            noteSummary: newSummary?.summary,
          };
        }
      }

      return {
        fragrance,
        userFragranceStats,
        noteSummary: existingSummary?.summary,
      };
    }),
});
