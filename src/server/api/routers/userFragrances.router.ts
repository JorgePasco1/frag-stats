import {
  fragrances,
  userFragranceLogs,
  userFragrances,
} from "~/server/db/schema";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

export const userFragrancesRouter = createTRPCRouter({
  getAll: privateProcedure.query(({ ctx }) => {
    const { currentUserId, db } = ctx;
    return db
      .select({
        fragranceId: userFragrances.fragranceId,
        name: fragrances.name,
        house: fragrances.house,
        imageUrl: fragrances.imageUrl,
        createdAt: userFragrances.createdAt,
        updatedAt: fragrances.updatedAt,
        isDecant: userFragrances.isDecant,
        status: userFragrances.status,
        averageRating: sql<number>`COALESCE(CAST(AVG(${userFragranceLogs.enjoyment}) AS FLOAT), 0)`,
      })
      .from(userFragrances)
      .innerJoin(fragrances, eq(userFragrances.fragranceId, fragrances.id))
      .leftJoin(
        userFragranceLogs,
        and(
          eq(userFragranceLogs.fragranceId, userFragrances.fragranceId),
          eq(userFragranceLogs.userId, currentUserId),
        ),
      )
      .where(eq(userFragrances.userId, currentUserId))
      .groupBy(
        userFragrances.fragranceId,
        fragrances.name,
        fragrances.house,
        fragrances.imageUrl,
        userFragrances.createdAt,
        fragrances.updatedAt,
        userFragrances.isDecant,
        userFragrances.status,
      );
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
      const { currentUserId, db } = ctx;
      const { name, house, imageUrl, isDecant } = input;
      const fragranceInsertResult = await db
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
