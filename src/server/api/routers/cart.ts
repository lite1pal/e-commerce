import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

const cartRouter = createTRPCRouter({
  getCartByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const cart = await ctx.prisma.cart.findFirst({
        where: { userId: input.userId },
        include: { items: { include: { item: true } } },
      });
      if (!cart) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Error retrieving the cart by user id",
        });
      }
      //   const cartItems = await ctx.prisma.cartItem.findMany({
      //     where: { cartId: cart.id },
      //     include: { item: true },
      //   });
      //   if (!cartItems) {
      //     throw new TRPCError({
      //       code: "BAD_REQUEST",
      //       message: "Error retrieving cart items by cart id",
      //     });
      //   }
      return cart;
    }),
  addItem: protectedProcedure
    .input(z.object({ userId: z.string(), itemId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      let cart = await ctx.prisma.cart.findFirst({
        where: { userId: input.userId },
      });
      if (!cart) {
        cart = await ctx.prisma.cart.create({
          data: {
            userId: input.userId,
            items: {
              create: {
                itemId: input.itemId,
              },
            },
          },
        });
        if (!cart) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Error adding an item to the cart",
          });
        }
      } else {
        const cartItem = await ctx.prisma.cartItem.create({
          data: {
            cartId: cart.id,
            itemId: input.itemId,
          },
        });
        if (!cartItem) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Error creating a cart item",
          });
        }
        cart = await ctx.prisma.cart.findFirst({
          where: { userId: input.userId },
          include: { items: true },
        });
      }
      return cart;
    }),
  deleteAll: protectedProcedure
    .input(z.object({ cartId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      //   await ctx.prisma.cartItem.deleteMany({ where: { cartId: input.cartId } });
      await ctx.prisma.cart.delete({ where: { id: input.cartId } });
      return 1;
    }),
});

export default cartRouter;
