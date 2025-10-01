import { octetInputParser } from "@trpc/server/unstable-core-do-not-import";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { fragrances, userFragrances } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

export const fragrancesRouter = createTRPCRouter({
  loadFragranceDataFromFragrantica: privateProcedure
    .input(octetInputParser)
    .mutation(({ input }) => {
      console.log({ input });
      return { valid: true };
    }),
  getFragranceName: privateProcedure
    .input(
      z.object({
        userFragranceId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { userFragranceId } = input;
      const { currentUserId, db } = ctx;
      const results = await db
        .select({
          name: fragrances.name,
        })
        .from(userFragrances)
        .innerJoin(fragrances, eq(userFragrances.fragranceId, fragrances.id))
        .where(and(
          eq(userFragrances.id, userFragranceId),
          eq(userFragrances.userId, currentUserId)
        ));
      if (results.length === 0) {
        throw new Error("Fragrance not found");
      }
      return results[0];
    }),
});
