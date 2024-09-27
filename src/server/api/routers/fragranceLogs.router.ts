import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import {
  fragrances,
  userFragranceLogs,
  userFragrances,
} from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const userFragranceLogsRouter = createTRPCRouter({
  createUserFragranceLog: privateProcedure
    .input(
      z.object({
        fragranceId: z.number(),
        logDate: z.date(),
        notes: z.string().optional(),
        sprays: z.number().int().min(1).optional(),
        enjoyment: z.number().int().min(1).max(10).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { currentUserId } = ctx;
      const { fragranceId, logDate, notes, sprays, enjoyment } = input;
      console.log({
        userId: currentUserId,
        fragranceId,
        logDate,
        notes,
        sprays,
        enjoyment,
      });
      return await ctx.db.insert(userFragranceLogs).values({
        userId: currentUserId,
        fragranceId,
        logDate,
        notes,
        sprays,
        enjoyment,
      });
    }),
  getAllUserFragranceLogs: privateProcedure.query(({ ctx }) => {
    const { currentUserId, db } = ctx;
    return db
      .select({
        id: userFragranceLogs.id,
        logDate: userFragranceLogs.logDate,
        fragranceName: fragrances.name,
        fragranceHouse: fragrances.house,
      })
      .from(userFragranceLogs)
      .innerJoin(fragrances, eq(userFragranceLogs.fragranceId, fragrances.id))
      .where(eq(userFragranceLogs.userId, currentUserId));
  }),
});
