import {
  fragrances,
  userFragranceLogs,
  userFragrances,
} from "~/server/db/schema";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

export const userFragrancesRouter = createTRPCRouter({
  getAll: privateProcedure
    .input(
      z
        .object({
          orderBy: z.enum(["name", "rating", "lastUsed"]).optional(),
        })
        .optional(),
    )
    .query(({ ctx, input }) => {
      const { currentUserId, db } = ctx;
      const { orderBy } = input ?? {};
      const orderByClause = () => {
        if (orderBy === "name")
          return sql`${fragrances.house} ASC, ${fragrances.name} ASC`;
        if (orderBy === "rating")
          return sql`AVG(${userFragranceLogs.enjoyment}) DESC NULLS LAST`;
        if (orderBy === "lastUsed")
          return sql`MAX(${userFragranceLogs.logDate}) ASC`;
        return sql`${fragrances.house} ASC, ${fragrances.name} ASC`;
      };

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
          averageRating: sql<
            number | null
          >`CAST(AVG(${userFragranceLogs.enjoyment}) AS FLOAT)`,
          lastUsed: sql<string>`MAX(${userFragranceLogs.logDate})`,
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
        )
        .orderBy(orderByClause());
    }),
  getLogOptions: privateProcedure.query(({ ctx }) => {
    const { currentUserId, db } = ctx;
    return db
      .select({
        house: fragrances.house,
        name: fragrances.name,
        fragranceId: fragrances.id,
        isDecant: userFragrances.isDecant,
      })
      .from(userFragrances)
      .innerJoin(fragrances, eq(userFragrances.fragranceId, fragrances.id))
      .where(
        and(
          eq(userFragrances.userId, currentUserId),
          eq(userFragrances.status, "have"),
        ),
      )
      .orderBy(sql`${fragrances.house} ASC, ${fragrances.name} ASC`);
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
  registerGone: privateProcedure
    .input(
      z.object({
        fragranceId: z.number(),
        goneDate: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD"),
        hadDetails: z.enum(["emptied", "sold", "gifted", "lost"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { currentUserId, db } = ctx;
      const { fragranceId, goneDate, hadDetails } = input;
      await db
        .update(userFragrances)
        .set({
          status: "had",
          goneDate,
          hadDetails,
        })
        .where(
          and(
            eq(userFragrances.userId, currentUserId),
            eq(userFragrances.fragranceId, fragranceId),
          ),
        );
    }),
});
