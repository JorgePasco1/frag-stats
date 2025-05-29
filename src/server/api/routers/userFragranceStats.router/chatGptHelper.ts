import { eq, gte, desc, and } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
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

export const generateNoteSummary = async (notes: {
  notes: string;
  useCase: string;
}[]) => {
  const prompt = `Write a summary of my thoughts on a fragrance:

${notes.map((note) => `${note.notes} (Use case: ${note.useCase})`).join("\n--------------------------------\n")}

Please provide a insightful summary that captures my feels about it, and my perception and identification of notes. Speak in first person, as if you are me. Try to capture as much as possible, both positive and negative, how my perception has changed over time, etc.

Don't be too explicit with the variations over time, and try to sound natural and relaxed, don't take it too seriously, but do keep a correct writing style.

Avoid talking about:
- Very personal stuff
- Experiences with Ninu
- Compliments or perception of thirds (being noticed, etc.)
- Specific places I've visit or people I've been with.

Avoid being too cheesy, using phrases like "despite my concern". Separate your review in paragraphs. Have in mind the use case, but only if it's very noticeable that there's a tendency to use the fragrance in that use case. Some more helpful context:
- I apply fragrance before bed, but not bc it's the best time to wear it, so let's not mention that a fragrance is best worn at bedtime.
- I want to focus on getting a summary of the notes I pick up, and the associations I can make to it. So that I can then write my own version. This should be more a helper than a final review.
`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4",
    max_tokens: 500,
  });

  return completion.choices[0]?.message?.content ?? "No summary generated";
};
