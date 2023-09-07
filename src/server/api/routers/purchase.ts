import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const purchaseRouter = createTRPCRouter({
  getAllByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input: { userId } }) => {
      // Returns the list of the purchased items
      return await ctx.prisma.purchasedItem.findMany({
        where: { userId: userId },
        include: {
          item: { include: { reviews: { include: { user: true } } } },
        },
      });
    }),
  addItemToPurchasedItems: protectedProcedure
    .input(z.object({ cartId: z.string() }))
    .mutation(async ({ ctx, input: { cartId } }) => {
      const cart = await ctx.prisma.cart.findUnique({
        where: { id: cartId },
        include: { cartItems: { include: { item: true } } },
      });

      if (!cart) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Error getting the cart",
        });
      }

      const purchasedItems = cart.cartItems.map((cartItem) => {
        return { userId: cart.userId, itemId: cartItem.itemId };
      });

      // Adds the items to the purchased items
      const newPurchasedItems = await ctx.prisma.purchasedItem.createMany({
        data: purchasedItems,
      });

      // Throws an error if something went wrong while adding the item
      if (!newPurchasedItems) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Error adding the item to the purchased items",
        });
      }

      // Deletes the cart
      await ctx.prisma.cart.delete({ where: { id: cart.id } });

      // Returns the new purchased item
      return newPurchasedItems;
    }),
});
