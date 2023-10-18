import fs from "fs";
import path from "path";

import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

const dataDir = path.resolve("./data");
const workflowFile = path.join(dataDir, "pipelayer.yaml");
const emptyWorkflow = `main:
   flows:
   topics:
`;

export const workflowRouter = createTRPCRouter({
  restart: protectedProcedure.mutation(() => {
    process.exit();
  }),
  getAll: protectedProcedure.query(({ ctx }) => {
    const user = ctx.session.user;
    return ctx.prisma.workflow.findMany({ where: { userId: user.id } });
  }),

  set: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        yaml: z.string(),
        storage: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      const { id: userId } = ctx.session.user;
      const { id, name, yaml, storage } = input;
      return ctx.prisma.workflow.upsert({
        where: { userId_id: {userId, id} },
        update: {
          name,
          yaml,
          storage,
        },
        create: {
          name,
          yaml,
          storage,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }),
});
