import { userFragranceLogs } from "~/server/db/schema";
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
    .query(({ ctx, input }) => {
      const { currentUserId, db } = ctx;
      const { fragranceId } = input;
      return db
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
    }),
});
