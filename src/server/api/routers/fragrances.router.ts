import { octetInputParser } from "@trpc/server/unstable-core-do-not-import";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { fragrances } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const fragrancesRouter = createTRPCRouter({
  loadFragranceDataFromFragrantica: privateProcedure
    .input(octetInputParser)
    .mutation(({ input }) => {
      console.log({ input });
      return { valid: true };
    }),
  getFragranceName: publicProcedure
    .input(
      z.object({
        fragranceId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { fragranceId } = input;
      const { db } = ctx;
      const results = await db
        .select({
          name: fragrances.name,
        })
        .from(fragrances)
        .where(eq(fragrances.id, fragranceId));
      if (results.length === 0) {
        throw new Error("Fragrance not found");
      }
      return results[0];
    }),
});
