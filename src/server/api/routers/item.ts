import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

const itemRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const items = await ctx.prisma.item.findMany({ take: 10 });
    if (!items) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Error retrieving items",
      });
    }
    return items;
  }),
});

export default itemRouter;
