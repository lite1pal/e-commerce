import { createTRPCRouter } from "~/server/api/trpc";
import itemRouter from "./routers/item";
import cartRouter from "./routers/cart";
import { purchaseRouter } from "./routers/purchase";
import { reviewRouter } from "./routers/review";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  item: itemRouter,
  cart: cartRouter,
  purchase: purchaseRouter,
  review: reviewRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
