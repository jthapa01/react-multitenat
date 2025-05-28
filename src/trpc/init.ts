import { initTRPC } from "@trpc/server";
import { getPayload } from "payload";
import config from "@payload-config";
import superjson from "superjson";

import { cache } from "react";
export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: "user_123" };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Router: it groups related procedures together
export const createTRPCRouter = t.router;
// factory creates server-side callers that can invoke tRPC procedures directly
// without HTTP requests
export const createCallerFactory = t.createCallerFactory;

// procedure: API endpoint/function that can be called from the client
// Types: Query(GET), Mutation(POST,PUT,DELETE), Subscription(real time data streams)
export const baseProcedure = t.procedure.use(async ({ next }) => {
  const payload = await getPayload({ config });
  return next({ ctx: { db: payload } });
});
