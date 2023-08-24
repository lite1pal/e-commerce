import { prisma } from "~/server/db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

const itemRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const items = ctx.prisma.item.findMany({ take: 10 });
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
