import { eq, gte, desc } from "drizzle-orm";
import { and } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import OpenAI from "openai";
import { env } from "~/env";
import type * as schema from "~/server/db/schema";
import { fragranceNoteSummaries } from "~/server/db/schema";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const checkRecentSummary = async (
  db: PostgresJsDatabase<typeof schema>,
  userId: string,
  fragranceId: number,
) => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const recentSummary = await db
    .select()
    .from(fragranceNoteSummaries)
    .where(
      and(
        eq(fragranceNoteSummaries.userId, userId),
        eq(fragranceNoteSummaries.fragranceId, fragranceId),
        gte(fragranceNoteSummaries.createdAt, oneMonthAgo),
      ),
    )
    .orderBy(desc(fragranceNoteSummaries.createdAt))
    .limit(1);

  return recentSummary[0];
};

export const generateNoteSummary = async (notes: string[]) => {
  const prompt = `Write a summary of my thoughts on a fragrance:

${notes.join("\n--------------------------------\n")}

Please provide a insightful summary that captures my feels about it, and my perception and identification of notes. Speak in first person, as if you are me. Try to capture as much as possible, both positive and negative, how my perception has changed over time, etc.

Don't be too explicit with the variations over time, and try to sound natural and relaxed, don't take it too seriously, but do keep a correct writing style.

Avoid talking about:
- Very personal stuff
- Experiences with Ninu
- Compliments or perception of thirds (being noticed, etc.)
- Specific places I've visit or people I've been with.

Avoid being too cheesy, using phrases like "despite my concern".
`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4",
    max_tokens: 800,
  });

  return completion.choices[0]?.message?.content ?? "No summary generated";
};
