import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { IItem, ICart } from "~/interfaces/interfaces";
import { api } from "~/utils/api";
import Icon from "../helpful/icon";
import Image from "next/image";
import LoadingSpinner from "../helpful/loading";

export default function Item(props: {
  item: IItem;
  cart: ICart | null | undefined;
  openCartMenu: () => void;
}) {
  const { item, cart, openCartMenu } = props;
  const { data: sessionData } = useSession();

  const ctx = api.useContext();

  // Adds an item to the cart
  const [addItemToCartLoading, setAddItemToCartLoading] = useState(false);
  const { mutate: addItemToCart } = api.cart.addItem.useMutation({
    onMutate: () => {
      setAddItemToCartLoading(true);
    },
    onSuccess: (data) => {
      console.log("CART DATA:  ", data);
      void ctx.cart.getCartByUserId.invalidate().then(() => {
        setAddItemToCartLoading(false);
      });
    },
    onError: (err: any) => {
      toast.error(err.message);
      setAddItemToCartLoading(false);
    },
  });

  // Deletes an item from the cart if it is already in the cart
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
    onError: (err: any) => {
      toast.error(err.message);
      setDeleteCartItemLoading(false);
    },
  });

  // Looks over the cart items to see if the item in catalog is already in the cart
  const isItemInCart = () => {
    if (!cart) return false;
    return cart.cartItems.some((cartItem) => {
      return cartItem.item.id === item.id;
    });
  };

  return (
    <div className="flex aspect-square w-full max-w-xs flex-col justify-between rounded-lg border border-gray-100 border-opacity-10 bg-slate-950 hover:border-blue-700">
      <div className="w-full max-w-full">
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
          quality={100}
        />
      </div>

      <div className="flex items-center justify-between gap-3 p-3">
        <div className="flex w-full flex-col rounded-full border-gray-100 border-opacity-10 bg-slate-950">
          <div className="px-4 py-2 md:text-lg">{item.name}</div>
          <div className="ml-3 w-fit rounded-full bg-blue-600 p-2 text-xs font-bold md:text-sm">
            ${item.price}.00 USD
          </div>
        </div>
        {addItemToCartLoading || deleteCartItemLoading ? (
          <div className="p-2">
            <LoadingSpinner />
          </div>
        ) : (
          //
          <div
            onClick={() =>
              isItemInCart() && cart
                ? deleteCartItem({ cartId: cart.id, itemId: item.id })
                : addItemToCart({
                    userId: sessionData?.user.id!,
                    itemId: item.id,
                    price: item.price,
                  })
            }
            className={`${
              isItemInCart() && "bg-green-700"
            } flex cursor-pointer gap-1 rounded border border-gray-100 border-opacity-30 p-2 `}
          >
            <Icon img="/shopping-cart.svg" w={15} h={15} />
            <div>+</div>
          </div>
        )}
      </div>
    </div>
  );
}
