import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

const itemRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const items = await ctx.prisma.item.findMany({
      take: 10,
      include: { reviews: { include: { user: true } } },
    });
    if (!items) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Error retrieving items",
      });
    }
    return items;
  }),
  getByItemId: publicProcedure
    .input(z.object({ itemId: z.string() }))
    .query(async ({ ctx, input: { itemId } }) => {
      const item = await ctx.prisma.item.findUnique({
        where: { id: itemId },
        include: { reviews: { include: { user: true } } },
      });

      if (!item) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Error getting an item",
        });
      }

      return item;
    }),
});

export default itemRouter;
