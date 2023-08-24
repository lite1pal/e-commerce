import { GetStaticPropsContext } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Script from "next/script";
import { useState } from "react";
import { appRouter } from "~/server/api/root";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { prisma } from "~/server/db";
import { useRouter } from "next/router";
import Link from "next/link";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { Session } from "next-auth";

// Types
interface IItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discount: number | null;
  category: string | null;
  tags: string[];
  quantity: number;
  availability: boolean;
  images: string[];
}

interface ICartItem {
  id: string;
  cartId: string;
  item: IItem;
  itemId: string;
  quantity: number;
}

interface ICart {
  id: string;
  userId: string;
  totalItemsCount: number | null;
  totalPrice: number | null;
  createdAt: Date;
  updatedAt: Date;
  items: ICartItem[];
  isCheckedOut: boolean;
}

// Components
function Underline() {
  return <hr className="border-b border-zinc-50" />;
}

function LoadingSpinner() {
  return (
    <div className="m-20 mx-auto w-fit" role="status">
      <svg
        aria-hidden="true"
        className="mr-2 h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

function Icon({ img, w, h }: { img: string; w: number; h: number }) {
  return (
    <Image
      src={img}
      alt={`image-${img}`}
      width={w}
      height={h}
      // className="w-full"
      // layout="responsive"
    />
  );
}

function Item(props: { item: IItem }) {
  const { item } = props;
  const { data: sessionData } = useSession();

  const ctx = api.useContext();

  const { mutate: addItemToCart } = api.cart.addItem.useMutation({
    onSuccess: (data) => {
      console.log("CART DATA:  ", data);
      toast.success("Item added to the cart successfully");
      void ctx.cart.getCartByUserId.invalidate();
    },
    onError: (err: any) => {
      toast.error(err);
    },
  });

  return (
    <div className="flex aspect-square flex-col rounded-lg border border-gray-100 border-opacity-10 bg-slate-950 hover:border-blue-700">
      <div className="w-full max-w-full">
        <Image
          src="/tshirt.png"
          alt={`image-tshirt.png`}
          width={1920}
          height={1080}
          className="w-full"
          layout="responsive"
        />
      </div>
      <div className="m-3 flex items-center justify-between">
        <div className="flex w-fit items-center gap-5 rounded-full border border-gray-100 border-opacity-10 bg-slate-950">
          <div className="px-4 py-2">{item.name}</div>
          <div className="rounded-full bg-blue-600 p-2 text-xs font-bold">
            ${item.price}.00 USD
          </div>
        </div>

        <div
          onClick={() =>
            addItemToCart({ userId: sessionData?.user.id!, itemId: item.id })
          }
          className="flex cursor-pointer gap-1 rounded border border-gray-100 border-opacity-30 p-2 hover:bg-slate-800"
        >
          <Icon img="/shopping-cart.svg" w={15} h={15} />
          <div>+</div>
        </div>
      </div>
    </div>
  );
}

function SearchInput() {
  return (
    <div className="flex items-center justify-between gap-10 rounded-lg border border-white border-opacity-10 p-3">
      <input
        className="bg-transparent text-sm outline-none placeholder:text-sm"
        type="text"
        placeholder="Search for products..."
      />
      <Icon img="/search.svg" w={15} h={15} />
    </div>
  );
}

function NavbarMobileMenu(props: {
  fadeIn: boolean;
  closeMobileMenu: () => void;
  mobileMenu: boolean;
}) {
  const { fadeIn, closeMobileMenu, mobileMenu } = props;
  const { data: sessionData } = useSession();
  return (
    <div
      className={`${!mobileMenu && "hidden"} ${
        fadeIn && "-translate-x-full"
      } absolute flex h-screen w-screen flex-col gap-5 bg-slate-950 p-4 transition duration-700`}
    >
      <div
        onClick={closeMobileMenu}
        className="w-fit cursor-pointer rounded border border-gray-100 border-opacity-30 p-3"
      >
        <Icon img="/x.svg" w={20} h={20} />
      </div>
      <SearchInput />
      <div className="flex cursor-pointer flex-col gap-3 text-xl font-light">
        <div>All</div>
        <div>Books</div>
        <div>Movies</div>
        {sessionData && sessionData.user ? (
          <div onClick={() => signOut()}>Sign out</div>
        ) : (
          <div onClick={() => signIn()}>Sign in</div>
        )}
      </div>
    </div>
  );
}

function CartMenu(props: {
  fadeIn: boolean;
  closeCartMenu: () => void;
  cartMenu: boolean;
  cart: ICart | null | undefined;
}) {
  const { fadeIn, closeCartMenu, cartMenu, cart } = props;
  const { data: sessionData } = useSession();

  const { mutate: deleteCart } = api.cart.deleteAll.useMutation({
    onSuccess: () => {
      toast.success("Cart is deleted successfully");
    },
    onError: (err: any) => {
      toast.error(err);
    },
  });
  return (
    <div
      className={`${!cartMenu && "hidden"} ${
        fadeIn && "translate-x-full"
      } absolute flex h-screen w-screen flex-col bg-slate-950 p-6 transition duration-700`}
    >
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium">My Cart</div>
        <div
          onClick={closeCartMenu}
          className="w-fit cursor-pointer rounded border border-gray-100 border-opacity-30 p-2"
        >
          <Icon img="/x.svg" w={25} h={25} />
        </div>
      </div>
      {cart ? (
        <div className="mt-8 flex h-full flex-col justify-between">
          <div className="flex flex-col gap-2">
            {/*  CART ITEM   */}

            {cart.items.map((item) => {
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-20 w-20 rounded border border-gray-700">
                      <Image
                        src="/tshirt.png"
                        alt={`image-tshirt.png`}
                        width={1920}
                        height={1080}
                        className="w-full"
                      />
                    </div>
                    <div className="flex flex-col">
                      <div>{item.item.name}</div>
                      <div>T-Shirt</div>
                      <div className="text-sm text-gray-600">White / M</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="ml-5 text-sm">
                      ${item.item.price}.00 USD
                    </div>
                    <div className="mr-2 flex gap-4 rounded-full border px-5 py-1">
                      <div
                        onClick={() => deleteCart({ cartId: cart.id })}
                        className="cursor-pointer opacity-60 transition hover:opacity-40"
                      >
                        -
                      </div>
                      <div>1</div>
                      <div className="cursor-pointer opacity-60 transition hover:opacity-40">
                        +
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/*   PAYMENT INFORMATION   */}
          <div className="flex flex-col gap-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <div>Taxes</div>
              <div className="text-base text-white">$0.00 USD</div>
            </div>
            <Underline />
            <div className="flex justify-between">
              <div>Shipping</div>
              <div>Calculated at checkout</div>
            </div>
            <Underline />
            <div className="flex justify-between">
              <div>Total</div>
              <div className="text-base text-white">$15.00USD</div>
            </div>
            <Underline />
            <div className="my-3 w-full items-center rounded-full border bg-blue-700 py-3 text-white">
              <div className="mx-auto w-fit">Proceed to Checkout</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="m-20 mx-auto flex w-full flex-col items-center gap-7">
          <Icon img="/shopping-cart.svg" w={55} h={55} />
          <div className="text-2xl font-bold">Your cart is empty.</div>
        </div>
      )}
    </div>
  );
}

function MainPage(props: { sessionData: Session }) {
  const { sessionData } = props;
  const { data: items, isLoading: itemsLoading } = api.item.getAll.useQuery();

  const { data: cart } = api.cart.getCartByUserId.useQuery({
    userId: sessionData.user.id,
  });

  const [fadeIn, setFadeIn] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cartMenu, setCartMenu] = useState(false);

  const openMobileMenu = () => {
    setMobileMenu(true);
    setFadeIn(true);
    setTimeout(() => {
      setFadeIn(false);
    }, 50);
  };

  const closeMobileMenu = () => {
    setFadeIn(true);
    setTimeout(() => {
      setMobileMenu(false);
    }, 1000);
  };

  const openCartMenu = () => {
    setCartMenu(true);
    setFadeIn(true);
    setTimeout(() => {
      setFadeIn(false);
    }, 50);
  };

  const closeCartMenu = () => {
    setFadeIn(true);
    setTimeout(() => {
      setCartMenu(false);
    }, 1000);
  };
  return (
    <main
      className={`${
        (mobileMenu || cartMenu) && "h-screen overflow-hidden"
      } flex min-h-screen flex-col bg-slate-900 text-white selection:bg-pink-600`}
    >
      {/*   NAVBAR MOBILE MENU   */}
      <NavbarMobileMenu {...{ fadeIn, closeMobileMenu, mobileMenu }} />

      {/*   CART MENU   */}
      <CartMenu {...{ fadeIn, closeCartMenu, cartMenu, cart }} />

      {/*   NAVBAR  */}
      <nav className="mx-4 mt-4 flex items-center justify-between">
        <div
          onClick={openMobileMenu}
          className={`${
            mobileMenu && "pointer-events-none"
          } cursor-pointer rounded border border-gray-100 border-opacity-30 p-3`}
        >
          <Icon img="/list.svg" w={15} h={15} />
        </div>
        <div className="flex items-center justify-center">
          <Icon img="/apple.png" w={40} h={40} />
        </div>
        <div
          onClick={openCartMenu}
          className="cursor-pointer rounded border border-gray-100 border-opacity-30 p-3"
        >
          <Icon img="/shopping-cart.svg" w={15} h={15} />
        </div>
      </nav>

      {/*   ITEMS    */}
      <div
        className={`${
          mobileMenu && ""
        } m-5 flex flex-col gap-5 transition duration-300`}
      >
        {itemsLoading && <LoadingSpinner />}
        {items &&
          items.map((item) => {
            return <Item key={item.id} item={item} />;
          })}
      </div>
    </main>
  );
}

function SignIn() {
  return (
    <div className="flex h-screen w-screen items-center justify-center border">
      <Link
        className="m-5 rounded-full border bg-blue-700 px-5 py-3 font-mono text-white hover:animate-pulse"
        href="/api/auth/signin"
      >
        Sign in
      </Link>
    </div>
  );
}

export default function Home() {
  const { data: sessionData, status } = useSession();

  if (status === "authenticated") {
    return (
      <>
        <Head>
          <title>E-commerce</title>
          <meta name="description" content="Generated by create-t3-app" />
          <link rel="icon" href="/favicon.ico" />
          <Script
            type="module"
            src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"
          />
          <Script
            noModule
            src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"
          />
          <Script
            src="https://kit.fontawesome.com/ce54b8dfe1.js"
            crossOrigin="anonymous"
          />
        </Head>
        {status === "authenticated" ? (
          <MainPage sessionData={sessionData} />
        ) : (
          <SignIn />
        )}
      </>
    );
  }
}
