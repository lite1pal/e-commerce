import { type ICart, type ICartItem } from "~/interfaces/interfaces";
import Image from "next/image";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import Icon from "../helpful/icon";
import { useState } from "react";
import LoadingSpinner from "../helpful/loading";

export default function CartItem({
  cartItem,
  cart,
}: {
  cartItem: ICartItem;
  cart: ICart;
}) {
  const { item } = cartItem;
  const ctx = api.useContext();

  // Deletes the cart item
  const [deleteCartItemLoading, setDeleteCartItemLoading] = useState(false);
  const { mutate: deleteCartItem } = api.cart.deleteCartItemById.useMutation({
    onMutate: () => {
      setDeleteCartItemLoading(true);
    },
    onSuccess: () => {
      void ctx.cart.getCartByUserId.invalidate().then(() => {
        setDeleteCartItemLoading(false);
      });
    },
    onError: (err) => {
      toast.error(err.message);
      setDeleteCartItemLoading(false);
    },
  });

  // Increments the quantity of the cart item
  const [increaseQuantityLoading, setIncreaseQuantityLoading] = useState(false);
  const { mutate: increaseQuantity } = api.cart.increaseQuantity.useMutation({
    onMutate: () => {
      setIncreaseQuantityLoading(true);
    },
    onSuccess: () => {
      void ctx.cart.getCartByUserId.invalidate().then(() => {
        setIncreaseQuantityLoading(false);
      });
    },
    onError: (err) => {
      toast.error(err.message);
      setIncreaseQuantityLoading(false);
    },
  });

  // Decrements the quantity of the cart item
  const [decreaseQuantityLoading, setDecreaseQuantityLoading] = useState(false);
  const { mutate: decreaseQuantity } = api.cart.decreaseQuantity.useMutation({
    onMutate: () => {
      setDecreaseQuantityLoading(true);
    },
    onSuccess: () => {
      void ctx.cart.getCartByUserId.invalidate();
      setDecreaseQuantityLoading(false);
    },
    onError: (err) => {
      toast.error(err.message);
      setDecreaseQuantityLoading(false);
    },
  });

  return (
    <div
      key={cartItem.id}
      className="flex items-center justify-between border-b border-gray-100 border-opacity-40 py-3"
    >
      <div className="flex items-center gap-2 ">
        <div className="aspect-square h-24 w-24 overflow-hidden rounded border border-gray-700 md:h-32 md:w-32 2xl:h-40 2xl:w-40">
          <Image
            src={
              item.images.length > 0 && item.images[0]
                ? item.images[0]
                : "/tshirt.png"
            }
            alt={`image-tshirt.png`}
            width={1920}
            height={1080}
            className="w-full"
          />
        </div>
        <div className="flex flex-col">
          <div className="md:text-lg 2xl:text-2xl">{item.name}</div>
          {/* <div>T-Shirt</div> */}
          <div className="text-sm text-gray-400 md:text-base 2xl:text-xl">
            {item.category}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-7">
        {deleteCartItemLoading ? (
          <LoadingSpinner />
        ) : (
          <div
            onClick={() =>
              deleteCartItem({
                cartId: cart.id,
                cartItemId: cartItem.id,
              })
            }
            className={`${deleteCartItemLoading && "pointer-events-none"} ${
              decreaseQuantityLoading && "pointer-events-none"
            } mr-2 flex cursor-pointer justify-end`}
          >
            <Icon img="/bin.png" w={20} h={20} />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <div className="m3-5 text-sm md:text-base 2xl:text-xl">
            ${cartItem.totalPrice}.00 USD
          </div>
          <div className="mr-2 flex gap-4 rounded-full border border-gray-500 border-opacity-80 px-5 py-1">
            <div
              onClick={() => {
                cartItem.quantity <= 1
                  ? deleteCartItem({
                      cartId: cart.id,
                      cartItemId: cartItem.id,
                    })
                  : decreaseQuantity({
                      cartItemId: cartItem.id,
                      price: item.price,
                    });
              }}
              className={`${
                (decreaseQuantityLoading || cartItem.quantity < 1) &&
                "pointer-events-none"
              } cursor-pointer opacity-60 transition hover:opacity-40`}
            >
              -
            </div>
            <div className="md:text-lg 2xl:text-xl">{cartItem.quantity}</div>
            <div
              onClick={() =>
                increaseQuantity({
                  cartItemId: cartItem.id,
                  price: item.price,
                })
              }
              className={`${
                increaseQuantityLoading && "pointer-events-none"
              } cursor-pointer opacity-60 transition hover:opacity-40`}
            >
              +
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
