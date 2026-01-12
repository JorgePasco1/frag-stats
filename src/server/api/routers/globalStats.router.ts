import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import {
  fragrances,
  userFragranceLogs,
  userFragrances,
} from "~/server/db/schema";
import { and, eq, sql, desc, gte } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "~/server/db/schema";

const periodInput = z.object({
  period: z.enum(["monthly", "yearly"]),
});

type Period = "monthly" | "yearly";

function getDateThreshold(period: Period): string {
  const days = period === "monthly" ? 30 : 365;
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split("T")[0]!;
}

// Helper to calculate streaks
async function calculateStreaks(
  db: PostgresJsDatabase<typeof schema>,
  userId: string,
): Promise<{ currentStreak: number; maxStreak: number }> {
  const logs = await db
    .select({ logDate: userFragranceLogs.logDate })
    .from(userFragranceLogs)
    .where(
      and(
        eq(userFragranceLogs.userId, userId),
        eq(userFragranceLogs.testedInBlotter, false),
        sql`${userFragranceLogs.useCase} != 'testing'`,
        sql`${userFragranceLogs.useCase} != 'guess_game'`,
      ),
    )
    .orderBy(desc(userFragranceLogs.logDate));

  if (logs.length === 0) {
    return { currentStreak: 0, maxStreak: 0 };
  }

  // Get unique dates
  const uniqueDates = [
    ...new Set(logs.map((log) => new Date(log.logDate).toISOString().split("T")[0])),
  ];

  // Calculate current streak
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // eslint-disable-next-line prefer-const
  let checkDate = new Date(today);

  for (const dateStr of uniqueDates) {
    const logDate = new Date(dateStr!);
    logDate.setHours(0, 0, 0, 0);

    // Check if this log is for the date we're checking
    if (logDate.getTime() === checkDate.getTime()) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (logDate.getTime() < checkDate.getTime()) {
      // If we found an older date without hitting our check date, streak is broken
      break;
    }
  }

  // Calculate max streak
  let maxStreak = 0;
  let tempStreak = 1;
  let prevDate = new Date(uniqueDates[0]!);
  prevDate.setHours(0, 0, 0, 0);

  for (let i = 1; i < uniqueDates.length; i++) {
    const currDate = new Date(uniqueDates[i]!);
    currDate.setHours(0, 0, 0, 0);

    const expectedPrevDate = new Date(currDate);
    expectedPrevDate.setDate(expectedPrevDate.getDate() + 1);

    if (expectedPrevDate.getTime() === prevDate.getTime()) {
      tempStreak++;
    } else {
      maxStreak = Math.max(maxStreak, tempStreak);
      tempStreak = 1;
    }

    prevDate = currDate;
  }
  maxStreak = Math.max(maxStreak, tempStreak);

  return { currentStreak, maxStreak };
}

export const globalStatsRouter = createTRPCRouter({
  getHeroStats: privateProcedure
    .input(periodInput)
    .query(async ({ ctx, input }) => {
      const { currentUserId, db } = ctx;
      const { period } = input;
      const dateThreshold = getDateThreshold(period);

      // Wears in period
      const wearsResult = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(userFragranceLogs)
        .where(
          and(
            eq(userFragranceLogs.userId, currentUserId),
            gte(userFragranceLogs.logDate, dateThreshold),
            eq(userFragranceLogs.testedInBlotter, false),
            sql`${userFragranceLogs.useCase} != 'testing'`,
            sql`${userFragranceLogs.useCase} != 'guess_game'`,
          ),
        );
      const wearsInPeriod = wearsResult[0]?.count ?? 0;

      // Most used fragrance in period
      const mostUsedResult = await db
        .select({
          name: fragrances.name,
          house: fragrances.house,
          count: sql<number>`count(*)::int`,
        })
        .from(userFragranceLogs)
        .innerJoin(fragrances, eq(userFragranceLogs.fragranceId, fragrances.id))
        .where(
          and(
            eq(userFragranceLogs.userId, currentUserId),
            gte(userFragranceLogs.logDate, dateThreshold),
            eq(userFragranceLogs.testedInBlotter, false),
            sql`${userFragranceLogs.useCase} != 'testing'`,
            sql`${userFragranceLogs.useCase} != 'guess_game'`,
          ),
        )
        .groupBy(fragrances.name, fragrances.house)
        .orderBy(desc(sql`count(*)`))
        .limit(1);

      const mostUsedFragrance = mostUsedResult[0]
        ? `${mostUsedResult[0].house} - ${mostUsedResult[0].name} (${mostUsedResult[0].count})`
        : "N/A";

      // Average enjoyment in period
      const avgEnjoymentResult = await db
        .select({
          avg: sql<number>`ROUND(AVG(${userFragranceLogs.enjoyment})::numeric, 1)`,
        })
        .from(userFragranceLogs)
        .where(
          and(
            eq(userFragranceLogs.userId, currentUserId),
            gte(userFragranceLogs.logDate, dateThreshold),
            eq(userFragranceLogs.testedInBlotter, false),
            sql`${userFragranceLogs.useCase} != 'testing'`,
            sql`${userFragranceLogs.useCase} != 'guess_game'`,
            sql`${userFragranceLogs.enjoyment} IS NOT NULL`,
          ),
        );
      const avgEnjoyment = avgEnjoymentResult[0]?.avg ?? 0;

      // Streaks (all time)
      const { currentStreak, maxStreak } = await calculateStreaks(
        db,
        currentUserId,
      );

      // Total wears (all time)
      const totalWearsResult = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(userFragranceLogs)
        .where(
          and(
            eq(userFragranceLogs.userId, currentUserId),
            eq(userFragranceLogs.testedInBlotter, false),
            sql`${userFragranceLogs.useCase} != 'testing'`,
            sql`${userFragranceLogs.useCase} != 'guess_game'`,
          ),
        );
      const totalWears = totalWearsResult[0]?.count ?? 0;

      // Cost per wear (all time)
      const totalSpentResult = await db
        .select({ total: sql<number>`SUM(${userFragrances.price})` })
        .from(userFragrances)
        .where(eq(userFragrances.userId, currentUserId));
      const totalSpent = totalSpentResult[0]?.total ?? 0;
      const costPerWear = totalWears > 0 ? totalSpent / totalWears : 0;

      // Best value fragrance (5+ wears, lowest cost per wear)
      const bestValueResult = await db
        .select({
          name: fragrances.name,
          house: fragrances.house,
          costPerWear: sql<number>`
            CASE
              WHEN COUNT(${userFragranceLogs.id}) >= 5
              THEN SUM(${userFragrances.price})::float / COUNT(${userFragranceLogs.id})
              ELSE NULL
            END
          `,
        })
        .from(userFragrances)
        .innerJoin(fragrances, eq(userFragrances.fragranceId, fragrances.id))
        .leftJoin(
          userFragranceLogs,
          and(
            eq(userFragranceLogs.userFragranceId, userFragrances.id),
            eq(userFragranceLogs.userId, currentUserId),
            eq(userFragranceLogs.testedInBlotter, false),
            sql`${userFragranceLogs.useCase} != 'testing'`,
            sql`${userFragranceLogs.useCase} != 'guess_game'`,
          ),
        )
        .where(eq(userFragrances.userId, currentUserId))
        .groupBy(fragrances.name, fragrances.house, userFragrances.id)
        .having(sql`COUNT(${userFragranceLogs.id}) >= 5`)
        .orderBy(
          sql`SUM(${userFragrances.price})::float / COUNT(${userFragranceLogs.id})`,
        )
        .limit(1);

      const bestValueFragrance = bestValueResult[0]
        ? `${bestValueResult[0].house} - ${bestValueResult[0].name} ($${bestValueResult[0].costPerWear?.toFixed(2)})`
        : "N/A";

      // Total ML finished
      const totalMlFinishedResult = await db
        .select({ total: sql<number>`SUM(${userFragrances.sizeInMl})` })
        .from(userFragrances)
        .where(
          and(
            eq(userFragrances.userId, currentUserId),
            eq(userFragrances.status, "had"),
            eq(userFragrances.hadDetails, "emptied"),
          ),
        );
      const totalMlFinished = totalMlFinishedResult[0]?.total ?? 0;

      return {
        wearsInPeriod,
        mostUsedFragrance,
        avgEnjoyment,
        currentStreak,
        maxStreak,
        totalWears,
        costPerWear: costPerWear.toFixed(2),
        bestValueFragrance,
        totalMlFinished,
      };
    }),

  getMostUsedFragrances: privateProcedure
    .input(periodInput)
    .query(async ({ ctx, input }) => {
      const { currentUserId, db } = ctx;
      const { period } = input;
      const dateThreshold = getDateThreshold(period);

      const result = await db
        .select({
          name: fragrances.name,
          house: fragrances.house,
          wearCount: sql<number>`count(*)::int`,
        })
        .from(userFragranceLogs)
        .innerJoin(fragrances, eq(userFragranceLogs.fragranceId, fragrances.id))
        .where(
          and(
            eq(userFragranceLogs.userId, currentUserId),
            gte(userFragranceLogs.logDate, dateThreshold),
            eq(userFragranceLogs.testedInBlotter, false),
            sql`${userFragranceLogs.useCase} != 'testing'`,
            sql`${userFragranceLogs.useCase} != 'guess_game'`,
          ),
        )
        .groupBy(fragrances.name, fragrances.house)
        .orderBy(desc(sql`count(*)`))
        .limit(10);

      return result;
    }),

  getUseCaseDistribution: privateProcedure
    .input(periodInput)
    .query(async ({ ctx, input }) => {
      const { currentUserId, db } = ctx;
      const { period } = input;
      const dateThreshold = getDateThreshold(period);

      const result = await db
        .select({
          useCase: userFragranceLogs.useCase,
          count: sql<number>`count(*)::int`,
        })
        .from(userFragranceLogs)
        .where(
          and(
            eq(userFragranceLogs.userId, currentUserId),
            gte(userFragranceLogs.logDate, dateThreshold),
            eq(userFragranceLogs.testedInBlotter, false),
            sql`${userFragranceLogs.useCase} != 'testing'`,
            sql`${userFragranceLogs.useCase} != 'guess_game'`,
            sql`${userFragranceLogs.useCase} IS NOT NULL`,
          ),
        )
        .groupBy(userFragranceLogs.useCase)
        .orderBy(desc(sql`count(*)`));

      return result;
    }),

  getContextStats: privateProcedure
    .input(periodInput)
    .query(async ({ ctx, input }) => {
      const { currentUserId, db } = ctx;
      const { period } = input;
      const dateThreshold = getDateThreshold(period);

      // Weather distribution
      const weatherResult = await db
        .select({
          weather: userFragranceLogs.weather,
          count: sql<number>`count(*)::int`,
        })
        .from(userFragranceLogs)
        .where(
          and(
            eq(userFragranceLogs.userId, currentUserId),
            gte(userFragranceLogs.logDate, dateThreshold),
            eq(userFragranceLogs.testedInBlotter, false),
            sql`${userFragranceLogs.useCase} != 'testing'`,
            sql`${userFragranceLogs.useCase} != 'guess_game'`,
            sql`${userFragranceLogs.weather} IS NOT NULL`,
          ),
        )
        .groupBy(userFragranceLogs.weather)
        .orderBy(desc(sql`count(*)`));

      // Time of day distribution
      const timeOfDayResult = await db
        .select({
          timeOfDay: userFragranceLogs.timeOfDay,
          count: sql<number>`count(*)::int`,
        })
        .from(userFragranceLogs)
        .where(
          and(
            eq(userFragranceLogs.userId, currentUserId),
            gte(userFragranceLogs.logDate, dateThreshold),
            eq(userFragranceLogs.testedInBlotter, false),
            sql`${userFragranceLogs.useCase} != 'testing'`,
            sql`${userFragranceLogs.useCase} != 'guess_game'`,
            sql`${userFragranceLogs.timeOfDay} IS NOT NULL`,
          ),
        )
        .groupBy(userFragranceLogs.timeOfDay)
        .orderBy(desc(sql`count(*)`));

      // Day of week distribution
      const dayOfWeekResult = await db
        .select({
          dayOfWeek: sql<string>`TO_CHAR(${userFragranceLogs.logDate}, 'Day')`,
          dayNum: sql<number>`EXTRACT(DOW FROM ${userFragranceLogs.logDate})::int`,
          count: sql<number>`count(*)::int`,
        })
        .from(userFragranceLogs)
        .where(
          and(
            eq(userFragranceLogs.userId, currentUserId),
            gte(userFragranceLogs.logDate, dateThreshold),
            eq(userFragranceLogs.testedInBlotter, false),
            sql`${userFragranceLogs.useCase} != 'testing'`,
            sql`${userFragranceLogs.useCase} != 'guess_game'`,
          ),
        )
        .groupBy(sql`TO_CHAR(${userFragranceLogs.logDate}, 'Day')`, sql`EXTRACT(DOW FROM ${userFragranceLogs.logDate})`)
        .orderBy(sql`EXTRACT(DOW FROM ${userFragranceLogs.logDate})`);

      return {
        weather: weatherResult,
        timeOfDay: timeOfDayResult,
        dayOfWeek: dayOfWeekResult,
      };
    }),

  getCollectionOverview: privateProcedure.query(async ({ ctx }) => {
    const { currentUserId, db } = ctx;

    // Total fragrances, bottles, decants
    const fragranceCountsResult = await db
      .select({
        total: sql<number>`count(*)::int`,
        bottles: sql<number>`count(*) FILTER (WHERE ${userFragrances.isDecant} = false)::int`,
        decants: sql<number>`count(*) FILTER (WHERE ${userFragrances.isDecant} = true)::int`,
      })
      .from(userFragrances)
      .where(
        and(
          eq(userFragrances.userId, currentUserId),
          eq(userFragrances.status, "have"),
        ),
      );

    const { total, bottles, decants } = fragranceCountsResult[0] ?? {
      total: 0,
      bottles: 0,
      decants: 0,
    };

    // Total ML in collection (current)
    const totalMlResult = await db
      .select({ total: sql<number>`SUM(${userFragrances.sizeInMl})` })
      .from(userFragrances)
      .where(
        and(
          eq(userFragrances.userId, currentUserId),
          eq(userFragrances.status, "have"),
        ),
      );
    const totalMl = totalMlResult[0]?.total ?? 0;

    // Total collection value
    const totalValueResult = await db
      .select({ total: sql<number>`SUM(${userFragrances.price})` })
      .from(userFragrances)
      .where(
        and(
          eq(userFragrances.userId, currentUserId),
          eq(userFragrances.status, "have"),
        ),
      );
    const totalValue = totalValueResult[0]?.total ?? 0;

    return {
      totalFragrances: total,
      bottles,
      decants,
      totalMl,
      totalValue,
    };
  }),

  getDiscoveryStats: privateProcedure
    .input(periodInput)
    .query(async ({ ctx }) => {
      const { currentUserId, db } = ctx;

      // Shelf queens - oldest fragrances with lowest wear count
      const shelfQueensResult = await db
        .select({
          name: fragrances.name,
          house: fragrances.house,
          daysOwned: sql<number>`EXTRACT(DAY FROM (CURRENT_DATE - ${userFragrances.acquiredDate}))::int`,
          wearCount: sql<number>`count(${userFragranceLogs.id})::int`,
        })
        .from(userFragrances)
        .innerJoin(fragrances, eq(userFragrances.fragranceId, fragrances.id))
        .leftJoin(
          userFragranceLogs,
          and(
            eq(userFragranceLogs.userFragranceId, userFragrances.id),
            eq(userFragranceLogs.userId, currentUserId),
            eq(userFragranceLogs.testedInBlotter, false),
            sql`${userFragranceLogs.useCase} != 'testing'`,
            sql`${userFragranceLogs.useCase} != 'guess_game'`,
          ),
        )
        .where(
          and(
            eq(userFragrances.userId, currentUserId),
            eq(userFragrances.status, "have"),
            sql`${userFragrances.acquiredDate} IS NOT NULL`,
          ),
        )
        .groupBy(
          fragrances.name,
          fragrances.house,
          userFragrances.acquiredDate,
          userFragrances.id,
        )
        .having(sql`count(${userFragranceLogs.id}) <= 3`)
        .orderBy(
          sql`EXTRACT(DAY FROM (CURRENT_DATE - ${userFragrances.acquiredDate})) DESC`,
        )
        .limit(5);

      // Hidden gems - high rating (8+) but low wear count
      const hiddenGemsResult = await db
        .select({
          name: fragrances.name,
          house: fragrances.house,
          avgRating: sql<number>`ROUND(AVG(${userFragranceLogs.enjoyment})::numeric, 1)`,
          wearCount: sql<number>`count(${userFragranceLogs.id})::int`,
        })
        .from(userFragrances)
        .innerJoin(fragrances, eq(userFragrances.fragranceId, fragrances.id))
        .innerJoin(
          userFragranceLogs,
          and(
            eq(userFragranceLogs.userFragranceId, userFragrances.id),
            eq(userFragranceLogs.userId, currentUserId),
            eq(userFragranceLogs.testedInBlotter, false),
            sql`${userFragranceLogs.useCase} != 'testing'`,
            sql`${userFragranceLogs.useCase} != 'guess_game'`,
            sql`${userFragranceLogs.enjoyment} IS NOT NULL`,
          ),
        )
        .where(
          and(
            eq(userFragrances.userId, currentUserId),
            eq(userFragrances.status, "have"),
          ),
        )
        .groupBy(fragrances.name, fragrances.house, userFragrances.id)
        .having(
          and(
            sql`AVG(${userFragranceLogs.enjoyment}) >= 8`,
            sql`count(${userFragranceLogs.id}) < 5`,
          ),
        )
        .orderBy(desc(sql`AVG(${userFragranceLogs.enjoyment})`))
        .limit(5);

      return {
        shelfQueens: shelfQueensResult,
        hiddenGems: hiddenGemsResult,
      };
    }),
});
