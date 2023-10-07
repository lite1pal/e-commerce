import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { type IItem, type ICart } from "~/interfaces/interfaces";
import { api } from "~/utils/api";
import Icon from "../helpful/icon";
import Image from "next/image";
import LoadingSpinner from "../helpful/loading";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Item(props: {
  item: IItem;
  cart: ICart | null | undefined;
  popularNow: boolean | null | undefined;
}) {
  const { item, cart, popularNow } = props;
  const { data: sessionData } = useSession();

  const router = useRouter();

  const ctx = api.useContext();

  // Adds an item to the cart
  const [addItemToCartLoading, setAddItemToCartLoading] = useState(false);
  const { mutate: addItemToCart } = api.cart.addItem.useMutation({
    onMutate: () => {
      setAddItemToCartLoading(true);
    },
    onSuccess: () => {
      void ctx.cart.getCartByUserId.invalidate().then(() => {
        setAddItemToCartLoading(false);
      });
    },
    onError: (err) => {
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
    onError: (err) => {
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

  // if (!sessionData) {
  //   return <LoadingSpinner />;
  // }

  return (
    <div
      className={`group relative z-0 flex aspect-square flex-col justify-between border border-gray-100 border-opacity-0 bg-slate-950 hover:border-blue-700 hover:border-opacity-100 ${
        popularNow && "max-sm:w-56"
      } h-80 max-sm:max-w-md sm:w-72 lg:w-52`}
    >
      <Link href={`/components/item/${item.id}`}>
        <Image
          src={
            item.images.length > 0 && item.images[0]
              ? item.images[0]
              : "/tshirt.png"
          }
          alt={`image-tshirt.png`}
          // width={1920}
          // height={1080}
          quality={100}
          fill
          objectFit="cover"
          className=""
        />
      </Link>

      <div className="absolute left-1 top-1 w-fit rounded bg-green-800 p-1 text-sm font-bold text-white transition group-hover:-translate-y-2">
        ${item.price}.00 USD
      </div>
      <div className="absolute bottom-0 flex w-full items-center justify-between gap-3 border border-t-0 border-gray-100 border-opacity-20 bg-slate-900 p-3 group-hover:border-opacity-0">
        <div className="flex w-full flex-col rounded border-gray-100 border-opacity-10 ">
          <div className="text-sm">{item.name}</div>
        </div>
        {addItemToCartLoading || deleteCartItemLoading ? (
          <div className="p-3">
            <LoadingSpinner />
          </div>
        ) : (
          <div
            onClick={() => {
              if (!sessionData?.user) {
                router.push("/api/auth/signin");
                return;
              }

              isItemInCart() && cart
                ? deleteCartItem({ cartId: cart.id, itemId: item.id })
                : addItemToCart({
                    userId: sessionData?.user.id!,
                    itemId: item.id,
                    price: item.price,
                  });
            }}
            className={`${
              isItemInCart() && "bg-green-700 hover:bg-green-800"
            } flex cursor-pointer gap-1 rounded border border-gray-100 border-opacity-20 p-3  hover:bg-slate-700 `}
          >
            <Icon img="/shopping-cart.svg" w={20} h={20} />
          </div>
        )}
      </div>
    </div>
  );
}
