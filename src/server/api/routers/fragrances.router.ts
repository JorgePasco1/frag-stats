import { octetInputParser } from "@trpc/server/unstable-core-do-not-import";
import { createTRPCRouter, privateProcedure } from "../trpc";

export const fragrancesRouter = createTRPCRouter({
  loadFragranceDataFromFragrantica: privateProcedure
    .input(octetInputParser)
    .mutation(({input}) => {
      console.log({ input });
      return { valid: true };
    }),
});
