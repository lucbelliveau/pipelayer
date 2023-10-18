import { createTRPCRouter } from "~/server/api/trpc";
import { workflowRouter } from "~/server/api/routers/workflow";
import { pulumiRouter } from "~/server/api/routers/pulumi";
import { blocksRouter } from "~/server/api/routers/blocks";
import { settingsRouter } from "~/server/api/routers/settings";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  workflow: workflowRouter,
  pulumi: pulumiRouter,
  blocks: blocksRouter,
  settings: settingsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
