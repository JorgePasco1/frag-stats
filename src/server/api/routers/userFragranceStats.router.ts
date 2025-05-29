import { fragrances, userFragranceLogs, fragranceNoteSummaries } from "~/server/db/schema";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { z } from "zod";
import { and, eq, gte, desc } from "drizzle-orm";
import OpenAI from "openai";
import { env } from "~/env";
import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "~/server/db/schema";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const checkRecentSummary = async (db: PostgresJsDatabase<typeof schema>, userId: string, fragranceId: number) => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const recentSummary = await db
    .select()
    .from(fragranceNoteSummaries)
    .where(
      and(
        eq(fragranceNoteSummaries.userId, userId),
        eq(fragranceNoteSummaries.fragranceId, fragranceId),
        gte(fragranceNoteSummaries.createdAt, oneMonthAgo)
      )
    )
    .orderBy(desc(fragranceNoteSummaries.createdAt))
    .limit(1);

  return recentSummary[0];
};

const generateNoteSummary = async (notes: string[]) => {
  const prompt = `Analyze the following fragrance notes and provide a concise summary of the user's experience and observations. Focus on patterns, preferences, and notable experiences:

${notes.join("\n")}

Please provide a brief, insightful summary that captures the key points.`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo",
    max_tokens: 200,
  });

  return completion.choices[0]?.message?.content ?? "No summary generated";
};

export const userFragranceStatsRouter = createTRPCRouter({
  getUserFragranceStats: privateProcedure
    .input(
      z.object({
        fragranceId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { currentUserId, db } = ctx;
      const { fragranceId } = input;

      // Fragrance house and name
      const fragrance = (
        await db
          .select({
            house: fragrances.house,
            name: fragrances.name,
          })
          .from(fragrances)
          .where(eq(fragrances.id, fragranceId))
          .limit(1)
      )[0];
      if (!fragrance) {
        throw new Error("Fragrance not found");
      }

      const userFragranceStats = await db
        .select({
          enjoyment: userFragranceLogs.enjoyment,
          logDate: userFragranceLogs.logDate,
          notes: userFragranceLogs.notes,
        })
        .from(userFragranceLogs)
        .where(
          and(
            eq(userFragranceLogs.userId, currentUserId),
            eq(userFragranceLogs.fragranceId, fragranceId),
          ),
        );

      // Check for recent summary
      const existingSummary = await checkRecentSummary(db, currentUserId, fragranceId);

      // If no recent summary exists, generate a new one
      if (!existingSummary) {
        const notes = userFragranceStats
          .map((stat) => stat.notes)
          .filter((note): note is string => note !== null);

        if (notes.length > 0) {
          const summary = await generateNoteSummary(notes);

          // Save the new summary
          const [newSummary] = await db.insert(fragranceNoteSummaries).values({
            userId: currentUserId,
            fragranceId,
            summary,
          }).returning();
          return {
            fragrance,
            userFragranceStats,
            noteSummary: newSummary?.summary,
          };
        }
      }

      return {
        fragrance,
        userFragranceStats,
        noteSummary: existingSummary?.summary,
      };
    }),
});
