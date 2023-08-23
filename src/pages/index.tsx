import { GetStaticPropsContext } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Script from "next/script";
import { useState } from "react";
import { appRouter } from "~/server/api/root";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { prisma } from "~/server/db";

// Components
function Underline() {
  return <hr className="border-b border-zinc-50" />;
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

function Item(props: { item: any }) {
  const { item } = props;
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
      <div className="m-5 flex w-fit items-center gap-5 rounded-full border border-gray-100 border-opacity-10 bg-slate-950">
        <div className="px-4 py-2">{item.name}</div>
        <div className="rounded-full bg-blue-600 p-2 text-xs font-bold">
          ${item.price}.00 USD
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
      <div className="flex flex-col gap-3 text-xl font-light">
        <div>All</div>
        <div>Books</div>
        <div>Movies</div>
      </div>
    </div>
  );
}

function CartMenu(props: {
  fadeIn: boolean;
  closeCartMenu: () => void;
  cartMenu: boolean;
}) {
  const { fadeIn, closeCartMenu, cartMenu } = props;
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
      {true && (
        <div className="mt-8 flex h-full flex-col justify-between">
          <div className="flex flex-col gap-2">
            {/*  CART ITEM   */}
            <div className="flex items-center justify-between">
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
                  <div>Acme Circles</div>
                  <div>T-Shirt</div>
                  <div className="text-sm text-gray-600">White / M</div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="ml-5 text-sm">$15.00 USD</div>
                <div className="mr-2 flex gap-4 rounded-full border px-5 py-1">
                  <div className="cursor-pointer opacity-60 transition hover:opacity-40">
                    -
                  </div>
                  <div>1</div>
                  <div className="cursor-pointer opacity-60 transition hover:opacity-40">
                    +
                  </div>
                </div>
              </div>
            </div>
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
      )}

      {/* <div className="m-20 mx-auto flex w-full flex-col items-center gap-7">
        <Icon img="/shopping-cart.svg" w={55} h={55} />
        <div className="text-2xl font-bold">Your cart is empty.</div>
      </div> */}
    </div>
  );
}

export default function Home() {
  const { data: sessionData } = useSession();
  const items = [
    { name: "Fairy tale", price: 20 },
    { name: "It", price: 15 },
    { name: "Outsider", price: 25 },
  ];

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
    <>
      <Head>
        <title>Create T3 App</title>
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

      {/* 
      
        BODY
      
      */}
      <main
        className={`${
          (mobileMenu || cartMenu) && "h-screen overflow-hidden"
        } flex min-h-screen flex-col bg-slate-900 text-white selection:bg-pink-600`}
      >
        {/*   NAVBAR MOBILE MENU   */}
        <NavbarMobileMenu {...{ fadeIn, closeMobileMenu, mobileMenu }} />

        {/*   CART MENU   */}
        <CartMenu {...{ fadeIn, closeCartMenu, cartMenu }} />

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
            {/* <div className="font-mono text-lg">Apple</div> */}
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
          {items.map((item) => {
            return <Item item={item} />;
          })}
        </div>
      </main>
    </>
  );
}
