import { fragrances, userFragranceLogs } from "~/server/db/schema";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { z } from "zod";
import { and, eq } from "drizzle-orm";

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
        })
        .from(userFragranceLogs)
        .where(
          and(
            eq(userFragranceLogs.userId, currentUserId),
            eq(userFragranceLogs.fragranceId, fragranceId),
          ),
        );

      return {
        fragrance,
        userFragranceStats,
      };
    }),
});
