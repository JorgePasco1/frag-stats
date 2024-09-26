import { fragrances, userFragrances } from "~/server/db/schema";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const userFragrancesRouter = createTRPCRouter({
  getAll: privateProcedure.query(({ ctx }) => {
    const { currentUserId } = ctx;
    return ctx.db
      .select({
        fragranceId: userFragrances.fragranceId,
        name: fragrances.name,
        house: fragrances.house,
        imageUrl: fragrances.imageUrl,
        createdAt: userFragrances.createdAt,
        updatedAt: fragrances.updatedAt,
        isDecant: userFragrances.isDecant,
        status: userFragrances.status,
        hadDetails: userFragrances.hadDetails,
      })
      .from(userFragrances)
      .innerJoin(fragrances, eq(userFragrances.fragranceId, fragrances.id))
      .where(eq(userFragrances.userId, currentUserId));
  }),
  create: privateProcedure
    .input(
      z.object({
        name: z.string(),
        house: z.string(),
        imageUrl: z.string(),
        isDecant: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { currentUserId } = ctx;
      const { name, house, imageUrl, isDecant } = input;
      const fragranceInsertResult = await ctx.db
        .insert(fragrances)
        .values({
          name,
          house,
          imageUrl,
        })
        .returning({ insertedId: fragrances.id });
      const fragrance = fragranceInsertResult[0];
      if (!fragrance) return;
      await ctx.db.insert(userFragrances).values({
        userId: currentUserId,
        fragranceId: fragrance.insertedId,
        isDecant,
      });
    }),
});
