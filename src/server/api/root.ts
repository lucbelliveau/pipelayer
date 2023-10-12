import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { workflowRouter } from "~/server/api/routers/workflow";
import { pulumiRouter } from "~/server/api/routers/pulumi";
import { blocksRouter } from "~/server/api/routers/blocks";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  workflow: workflowRouter,
  pulumi: pulumiRouter,
  blocks: blocksRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
