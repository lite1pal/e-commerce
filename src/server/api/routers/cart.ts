import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

const cartRouter = createTRPCRouter({
  // Retrieves a cart by user id and returns this cart
  getCartByUserId: protectedProcedure
    .input(z.object({ userId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const { userId } = input;

      // Retrieves a cart by user id provided by the input object
      const cart = await ctx.prisma.cart.findFirst({
        where: { userId },
        include: {
          cartItems: {
            include: { item: true },
            orderBy: { createdAt: "desc" },
          },
        },
      });

      // Throws an error if the user does not have a cart yet
      if (!cart) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Error retrieving the cart by user id",
        });
      }

      // Returns the cart
      return cart;
    }),
  // Adds a new item to the cart
  addItem: protectedProcedure
    .input(
      z.object({ userId: z.string(), itemId: z.string(), price: z.number() })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, itemId, price } = input;
      // Retrieves the cart to know if a new one should be created
      let cart = await ctx.prisma.cart.findFirst({
        where: { userId },
        include: { cartItems: { include: { item: true } } },
      });

      // In the case when the cart does not exist yet
      if (!cart) {
        // Creates a new cart
        cart = await ctx.prisma.cart.create({
          data: {
            userId,
            cartItems: {
              create: {
                itemId,
                totalPrice: price,
              },
            },
            totalPrice: price,
          },
          include: { cartItems: { include: { item: true } } },
        });

        // Throws an error if something went wrong while creating a new cart
        if (!cart) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Error adding an item to the cart",
          });
        }
      }
      // The cart exists already
      else {
        // Adds a new item to the existing cart
        const cartItem = await ctx.prisma.cartItem.create({
          data: {
            cartId: cart.id,
            itemId,
            totalPrice: price,
          },
        });

        // Throws an TRPCError if something went wrong while adding a new item to the cart
        if (!cartItem) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Error creating a cart item",
          });
        }

        // Updates the total price of the cart by incrementing it by the item's price
        await ctx.prisma.cart.update({
          where: { id: cartItem.cartId },
          data: { totalPrice: { increment: price } },
        });
      }

      // Retrieves relevant cart with an added item and updated total price
      cart = await ctx.prisma.cart.findFirst({
        where: { userId },
        include: { cartItems: { include: { item: true } } },
      });

      return cart;
    }),

  // Increases the quantity of a cart item in the cart
  increaseQuantity: protectedProcedure
    .input(z.object({ cartItemId: z.string(), price: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { cartItemId, price } = input;

      // Updates the cart item by incrementing its quantity and price
      const incrementedCartItem = await ctx.prisma.cartItem.update({
        where: { id: cartItemId },
        data: {
          quantity: { increment: 1 },
          totalPrice: { increment: price },
        },
      });

      // Increments the cart's total price by the item's price
      await ctx.prisma.cart.update({
        where: {
          id: incrementedCartItem.cartId,
        },
        data: { totalPrice: { increment: price } },
      });

      // Returns the incremented cart item
      return incrementedCartItem;
    }),
  // Decreases the quantity of a cart item in the cart
  decreaseQuantity: protectedProcedure
    .input(z.object({ cartItemId: z.string(), price: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { cartItemId, price } = input;

      // Updates the cart item by decrementing its quantity and price
      const decrementedCartItem = await ctx.prisma.cartItem.update({
        where: { id: cartItemId },
        data: {
          quantity: { decrement: 1 },
          totalPrice: { decrement: price },
        },
      });

      // Decrements the cart's total price by the item's price
      await ctx.prisma.cart.update({
        where: {
          id: decrementedCartItem.cartId,
        },
        data: { totalPrice: { decrement: price } },
      });

      // Returns the decremented cart item
      return decrementedCartItem;
    }),
  // Deletes a cart item from the cart by its id, then updates the cart's total price
  deleteCartItemById: protectedProcedure
    .input(
      z.object({
        cartId: z.string(),
        cartItemId: z.string().optional(),
        itemId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { cartId, cartItemId, itemId } = input;

      // Figures out how many cart items are in the cart currently
      const cartItemsCount = await ctx.prisma.cartItem.count({
        where: { cartId },
      });

      // Throws an error if nor item id or cart item id wasn't provided
      if (!itemId && !cartItemId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "Item id or cart item id is required to delete a cart item from the cart",
        });
      }

      // Determines the appropriate filter based on the provided inputs
      const itemWhere = itemId
        ? { cartId, itemId }
        : { cartId, id: cartItemId };

      // Retrieves a cart item from the cart
      const cartItem = await ctx.prisma.cartItem.findFirst({
        where: itemWhere,
      });

      // Throws an error if the cart item is not found
      if (!cartItem) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      // Deletes a cart item from the cart
      const deletedCartItem = await ctx.prisma.cartItem.delete({
        where: { id: cartItem.id, cartId },
        include: { item: true },
      });

      // Updates the cart's total price by decrementing it after deleting an item
      if (cartItemsCount > 0) {
        await ctx.prisma.cart.update({
          where: { id: cartId },
          data: {
            totalPrice: {
              decrement: deletedCartItem.item.price * deletedCartItem.quantity,
            },
          },
        });
      }
      // Deletes the whole cart if the item that have been deleted was last one in the cart
      else {
        await ctx.prisma.cart.delete({ where: { id: cartId } });
      }

      // Returns the deleted cart item
      return deletedCartItem;
    }),
});

export default cartRouter;
