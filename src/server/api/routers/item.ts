import { prisma } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "../trpc";

const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const items = ctx.prisma.item.findMany();
    return items;
  }),
});

export default postRouter;
