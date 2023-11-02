import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

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
