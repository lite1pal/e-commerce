import { type Dispatch, type SetStateAction } from "react";
import Icon from "../helpful/icon";
import { type ICart } from "~/interfaces/interfaces";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { SearchInput } from "~/pages/components/catalog";

export default function Navbar(props: {
  mobileMenu: boolean;
  cartMenu: boolean;
  setMobileMenu: Dispatch<SetStateAction<boolean>>;
  setCartMenu: Dispatch<SetStateAction<boolean>>;
  cart: ICart | undefined;
  setFadeIn: Dispatch<SetStateAction<boolean>>;
  scrollPosition: number;
  setScrollBeforeCart: Dispatch<SetStateAction<number>>;
  setTest: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    mobileMenu,
    cartMenu,
    setMobileMenu,
    setCartMenu,
    cart,
    setFadeIn,
    scrollPosition,
    setScrollBeforeCart,
  } = props;

  const { data: sessionData, status } = useSession();

  const openMobileMenu = () => {
    setScrollBeforeCart(scrollPosition);
    setMobileMenu(true);
    setFadeIn(true);

    setTimeout(() => {
      setFadeIn(false);
    }, 50);
  };

  const openCartMenu = () => {
    setScrollBeforeCart(scrollPosition); // sets a vertical scroll that was before cart menu
    setCartMenu(true); // makes cart menu visible
    setFadeIn(true); // puts cart menu out of screen to let it appear animated

    setTimeout(() => {
      setFadeIn(false);
    }, 50);
  };

  // if (status === "loading" || !sessionData) {
  //   return <LoadingSpinner />;
  // }

  return (
    <nav className="sticky top-0 z-10 bg-slate-900 px-4 py-4">
      {/*       MOBILE      */}
      <div className="flex items-center justify-between lg:hidden">
        <div
          onClick={openMobileMenu}
          className={`${
            mobileMenu && "pointer-events-none"
          } cursor-pointer rounded border border-gray-100 border-opacity-30 p-3 lg:hidden`}
        >
          <Icon img="/list.svg" w={15} h={15} />
        </div>
        <Link href="/">
          <div className="flex cursor-pointer items-center justify-center">
            <Icon
              img="https://i.pinimg.com/originals/dd/64/da/dd64da585bc57cb05e5fd4d8ce873f57.png"
              w={80}
              h={80}
            />
          </div>
        </Link>
        <div
          onClick={openCartMenu}
          className={`${
            cartMenu && "pointer-events-none"
          } relative flex cursor-pointer justify-between rounded border border-gray-100 border-opacity-30 p-3`}
        >
          <Icon img="/shopping-cart.svg" w={15} h={15} />
          {cart && cart.cartItems.length > 0 ? (
            <div
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-700 text-white" // Adjust styling as needed
            >
              {cart.cartItems.length}
            </div>
          ) : null}
        </div>
      </div>

      {/*      TABLET AND DESKTOP      */}
      <div className="flex items-center justify-between max-lg:hidden">
        <div className="flex lg:gap-10">
          <div
            onClick={openMobileMenu}
            className={`${
              mobileMenu && "pointer-events-none"
            } cursor-pointer rounded border border-gray-100 border-opacity-30 p-3 lg:hidden`}
          >
            <Icon img="/list.svg" w={15} h={15} />
          </div>
          <Link href="/">
            <div className="flex cursor-pointer items-center justify-center">
              <Icon
                img="https://i.pinimg.com/originals/dd/64/da/dd64da585bc57cb05e5fd4d8ce873f57.png"
                w={120}
                h={120}
              />
            </div>
          </Link>

          <div className="flex items-center gap-10 font-light text-slate-300 max-lg:hidden">
            <div className="flex items-center gap-7">
              <Link href="/components/catalog">
                <div className="cursor-pointer font-medium">Books</div>
              </Link>
              <div className="cursor-pointer font-medium">About</div>
              {sessionData?.user && (
                <button
                  onClick={() => signOut()}
                  className="ml-10 cursor-pointer justify-between rounded border border-gray-100 border-opacity-30 p-2 transition hover:border-black hover:bg-slate-50 hover:text-black"
                >
                  Log out
                </button>
              )}
            </div>
          </div>
        </div>

        <SearchInput className={"w-1/3 max-lg:hidden"} />

        {!sessionData?.user ? (
          <a
            className="mr-8 cursor-pointer justify-between rounded border border-gray-100 border-opacity-30 p-2 transition hover:border-black hover:bg-slate-50 hover:text-black"
            href="/api/auth/signin"
          >
            Sign in
          </a>
        ) : (
          <div
            onClick={openCartMenu}
            className={`${
              cartMenu && "pointer-events-none"
            } relative mr-8 flex cursor-pointer justify-between rounded border border-gray-100 border-opacity-30 p-3`}
          >
            <Icon img="/shopping-cart.svg" w={15} h={15} />
            {cart && cart.cartItems.length > 0 ? (
              <span className="absolute -right-1 -top-2 flex h-5 w-5 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-600 opacity-50"></span>
                <span className="relative h-5 w-5 rounded-full bg-green-700 pl-1.5 text-sm">
                  {cart.cartItems.length}
                </span>
              </span>
            ) : null}
          </div>
        )}
      </div>
    </nav>
  );
}
