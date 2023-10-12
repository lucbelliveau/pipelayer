import {
  createTRPCRouter,
  publicProcedure,
  // protectedProcedure,
} from "~/server/api/trpc";

import { blocks } from "~/server/blocks";

export const blocksRouter = createTRPCRouter({
  list: publicProcedure.query(() => {
    return blocks;
  }),
});
