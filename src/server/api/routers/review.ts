import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const reviewRouter = createTRPCRouter({
  postReview: protectedProcedure
    .input(
      z.object({ userId: z.string(), itemId: z.string(), content: z.string() })
    )
    .mutation(async ({ ctx, input: { userId, itemId, content } }) => {
      const newReview = await ctx.prisma.itemReview.create({
        data: {
          userId,
          itemId,
          content,
          rating: 5,
        },
      });

      if (!newReview) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Error creating a new review",
        });
      }

      return newReview;
    }),
});
