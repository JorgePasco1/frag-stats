import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import {
  fragrances,
  timeOfDayEnum,
  useCaseEnum,
  userFragranceLogs,
  userFragrances,
  weatherEnum,
} from "~/server/db/schema";
import { eq, sql, and } from "drizzle-orm";

export const userFragranceLogsRouter = createTRPCRouter({
  createUserFragranceLog: privateProcedure
    .input(
      z.object({
        fragranceId: z.number(),
        userFragranceId: z.number(),
        logDate: z.string(),
        notes: z.string().optional(),
        sprays: z.number().int().min(1).optional(),
        enjoyment: z.number().int().min(1).max(10).optional(),
        duration: z.number().int().optional(),
        testedInBlotter: z.boolean().optional(),
        timeOfDay: z.enum(timeOfDayEnum.enumValues).optional(),
        weather: z.enum(weatherEnum.enumValues).optional(),
        useCase: z.enum(useCaseEnum.enumValues).optional(),
        isGone: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { currentUserId, db } = ctx;
      const {
        fragranceId,
        userFragranceId,
        logDate,
        notes,
        sprays,
        enjoyment,
        duration,
        testedInBlotter,
        timeOfDay,
        weather,
        useCase,
        isGone,
      } = input;
      console.log({ isGone });

      // Create the log entry
      const logResult = await db.insert(userFragranceLogs).values({
        userId: currentUserId,
        fragranceId,
        userFragranceId,
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

      // If isGone is true, update the userFragrance status
      if (isGone) {
        await db
          .update(userFragrances)
          .set({
            status: "had",
            goneDate: logDate,
            hadDetails: "emptied",
            wentTo: null,
            sellPrice: null,
          })
          .where(eq(userFragrances.id, userFragranceId));
      }

      return logResult;
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
        .where(
          and(
            eq(userFragranceLogs.id, logId),
            eq(userFragranceLogs.userId, currentUserId),
          ),
        )
        .limit(1);

      if (existingLog.length === 0) {
        throw new Error("Log not found or access denied");
      }

      // Update the log
      return await db
        .update(userFragranceLogs)
        .set(updateValues)
        .where(
          and(
            eq(userFragranceLogs.id, logId),
            eq(userFragranceLogs.userId, currentUserId),
          ),
        );
    }),
  getFragranceLog: privateProcedure
    .input(z.object({ logId: z.number() }))
    .query(async ({ ctx, input }) => {
      const { currentUserId, db } = ctx;
      const { logId } = input;

      const log = await db
        .select({
          id: userFragranceLogs.id,
          logDate: userFragranceLogs.logDate,
          notes: userFragranceLogs.notes,
          sprays: userFragranceLogs.sprays,
          enjoyment: userFragranceLogs.enjoyment,
          duration: userFragranceLogs.duration,
          testedInBlotter: userFragranceLogs.testedInBlotter,
          timeOfDay: userFragranceLogs.timeOfDay,
          weather: userFragranceLogs.weather,
          useCase: userFragranceLogs.useCase,
          fragranceId: userFragranceLogs.fragranceId,
          fragranceFullName: sql<string>`${fragrances.house} || ' ' || ${fragrances.name}`,
          userFragranceId: userFragranceLogs.userFragranceId,
        })
        .from(userFragranceLogs)
        .innerJoin(fragrances, eq(userFragranceLogs.fragranceId, fragrances.id))
        .innerJoin(
          userFragrances,
          eq(userFragranceLogs.userFragranceId, userFragrances.id),
        )
        .where(
          and(
            eq(userFragranceLogs.id, logId),
            eq(userFragranceLogs.userId, currentUserId),
          ),
        )
        .limit(1);

      if (log.length === 0) {
        throw new Error("Log not found or access denied");
      }

      return log[0];
    }),
  getAllUserFragranceLogs: privateProcedure.query(({ ctx }) => {
    const { currentUserId, db } = ctx;
    return db
      .select({
        id: userFragranceLogs.id,
        logDate: userFragranceLogs.logDate,
        fragranceFullName: sql<string>`${fragrances.house} || ' ' || ${fragrances.name}`,
        userFragranceId: userFragranceLogs.userFragranceId,
      })
      .from(userFragranceLogs)
      .innerJoin(fragrances, eq(userFragranceLogs.fragranceId, fragrances.id))
      .innerJoin(
        userFragrances,
        eq(userFragranceLogs.userFragranceId, userFragrances.id),
      )
      .where(eq(userFragranceLogs.userId, currentUserId));
  }),
});
