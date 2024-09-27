import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { userFragranceLogs } from "~/server/db/schema";

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
});
