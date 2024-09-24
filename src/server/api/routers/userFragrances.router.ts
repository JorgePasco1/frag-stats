import { fragrances, userFragrances } from "~/server/db/schema";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { eq } from "drizzle-orm";

export const userFragrancesRouter = createTRPCRouter({
  getAll: privateProcedure.query(({ ctx }) => {
    const { currentUserId } = ctx;
    return ctx.db
      .select({
        fragranceId: userFragrances.fragranceId,
        name: fragrances.name,
        house: fragrances.house,
        imageUrl: fragrances.imageUrl,
        createdAt: fragrances.createdAt,
        updatedAt: fragrances.updatedAt,
      })
      .from(userFragrances)
      .innerJoin(fragrances, eq(userFragrances.fragranceId, fragrances.id))
      .where(eq(userFragrances.userId, currentUserId));
  }),
});
