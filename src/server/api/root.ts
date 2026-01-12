import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userFragrancesRouter } from "./routers/userFragrances.router";
import { userFragranceLogsRouter } from "./routers/fragranceLogs.router";
import { userFragranceStatsRouter } from "./routers/userFragranceStats.router";
import { fragrancesRouter } from "./routers/fragrances.router";
import { globalStatsRouter } from "./routers/globalStats.router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  userFragrances: userFragrancesRouter,
  userFragranceLogs: userFragranceLogsRouter,
  userFragranceStats: userFragranceStatsRouter,
  fragrances: fragrancesRouter,
  globalStats: globalStatsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
