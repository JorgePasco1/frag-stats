import { createTRPCRouter, privateProcedure } from "../../trpc";
import { z } from "zod";
import { checkRecentSummary } from "./chatGptHelper";
import { createNoteSummary, getFragranceDetails, getUserFragranceStats } from "./dbHelper";

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

      const fragrance = await getFragranceDetails(db, fragranceId);
      const userFragranceStats = await getUserFragranceStats(db, currentUserId, fragranceId);

      // Check for recent summary
      const existingSummary = await checkRecentSummary(
        db,
        currentUserId,
        fragranceId,
      );

      // If no recent summary exists, generate a new one
      if (!existingSummary) {
        const newSummary = await createNoteSummary(db, currentUserId, fragranceId);
        return {
          fragrance,
          userFragranceStats,
          noteSummary: newSummary,
        };
      }

      return {
        fragrance,
        userFragranceStats,
        noteSummary: existingSummary?.summary,
      };
    }),
  regenerateNoteSummary: privateProcedure
    .input(z.object({ fragranceId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { currentUserId, db } = ctx;
      const { fragranceId } = input;

      const newSummary = await createNoteSummary(db, currentUserId, fragranceId);
      return { summary: newSummary };
    }),
});
