import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { fragrances, timeOfDayEnum, useCaseEnum, userFragranceLogs, weatherEnum } from "~/server/db/schema";
import { eq, sql, and } from "drizzle-orm";


export const userFragranceLogsRouter = createTRPCRouter({
  createUserFragranceLog: privateProcedure
    .input(
      z.object({
        fragranceId: z.number(),
        logDate: z.string(),
        notes: z.string().optional(),
        sprays: z.number().int().min(1).optional(),
        enjoyment: z.number().int().min(1).max(10).optional(),
        duration: z.number().int().optional(),
        testedInBlotter: z.boolean().optional(),
        timeOfDay: z.enum(timeOfDayEnum.enumValues).optional(),
        weather: z.enum(weatherEnum.enumValues).optional(),
        useCase: z.enum(useCaseEnum.enumValues).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { currentUserId } = ctx;
      const {
        fragranceId,
        logDate,
        notes,
        sprays,
        enjoyment,
        duration,
        testedInBlotter,
        timeOfDay,
        weather,
        useCase,
      } = input;
      return await ctx.db.insert(userFragranceLogs).values({
        userId: currentUserId,
        fragranceId,
        logDate,
        notes,
        sprays,
        enjoyment,
        duration,
        testedInBlotter,
        timeOfDay,
        weather,
        useCase,
      });
    }),
  updateUserFragranceLog: privateProcedure
    .input(
      z.object({
        logId: z.number(),
        updateValues: z.object({
          logDate: z.string().optional(),
          notes: z.string().optional(),
          sprays: z.number().int().min(1).optional(),
          enjoyment: z.number().int().min(1).max(10).optional(),
          duration: z.number().int().optional(),
          testedInBlotter: z.boolean().optional(),
          timeOfDay: z.enum(timeOfDayEnum.enumValues).optional(),
          weather: z.enum(weatherEnum.enumValues).optional(),
          useCase: z.enum(useCaseEnum.enumValues).optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { currentUserId, db } = ctx;
      const { logId, updateValues } = input;

      // First verify the log belongs to the current user
      const existingLog = await db
        .select()
        .from(userFragranceLogs)
        .where(and(
          eq(userFragranceLogs.id, logId),
          eq(userFragranceLogs.userId, currentUserId)
        ))
        .limit(1);

      if (existingLog.length === 0) {
        throw new Error("Log not found or access denied");
      }

      // Update the log
      return await db
        .update(userFragranceLogs)
        .set(updateValues)
        .where(and(
          eq(userFragranceLogs.id, logId),
          eq(userFragranceLogs.userId, currentUserId)
        ));
    }),
  getAllUserFragranceLogs: privateProcedure.query(({ ctx }) => {
    const { currentUserId, db } = ctx;
    return db
      .select({
        id: userFragranceLogs.id,
        logDate: userFragranceLogs.logDate,
        fragranceFullName: sql<string>`${fragrances.house} || ' ' || ${fragrances.name}`,
      })
      .from(userFragranceLogs)
      .innerJoin(fragrances, eq(userFragranceLogs.fragranceId, fragrances.id))
      .where(eq(userFragranceLogs.userId, currentUserId));
  }),
});
