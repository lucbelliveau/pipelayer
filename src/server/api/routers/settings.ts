import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const settingsRouter = createTRPCRouter({
  restart: protectedProcedure.mutation(() => {
    process.exit();
  }),
  get: protectedProcedure.query(({ ctx }) => {
    const user = ctx.session.user;
    return ctx.prisma.user.findFirstOrThrow({
      select: { hiddenHandles: true },
      where: { id: user.id },
    });
  }),

  set: protectedProcedure
    .input(
      z.object({
        k8s: z.boolean(),
        kafka: z.boolean(),
        avro: z.boolean(),
        topic: z.boolean(),
        postgres: z.boolean(),
      })
    )
    .mutation(({ input, ctx }) => {
      const { id } = ctx.session.user;
      return ctx.prisma.user.update({
        where: { id },
        data: {
          hiddenHandles: JSON.stringify(input),
        },
      });
    }),
});
