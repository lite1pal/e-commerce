import { type Dispatch, type SetStateAction } from "react";
import Icon from "../helpful/icon";
import { type ICart } from "~/interfaces/interfaces";
import Link from "next/link";
import SearchInput from "../helpful/searchInput";

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
              img="https://static.vecteezy.com/system/resources/previews/009/384/332/original/old-vintage-book-clipart-design-illustration-free-png.png"
              w={40}
              h={40}
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
                img="https://static.vecteezy.com/system/resources/previews/009/384/332/original/old-vintage-book-clipart-design-illustration-free-png.png"
                w={40}
                h={40}
              />
            </div>
          </Link>

          <div className="flex items-center gap-10 font-light text-slate-300 max-lg:hidden">
            <div className="flex gap-3">
              <Link href="/components/catalog">
                <div className="cursor-pointer">All</div>
              </Link>
              <div className="cursor-pointer">Fiction</div>
              <div className="cursor-pointer">Non-fiction</div>

              {/* <Link href="/components/purchases">
                <div className="cursor-pointer">Purchases</div>
              </Link> */}
            </div>
          </div>
        </div>

        {/* <div className="font-medium text-slate-300 max-lg:hidden">
          {sessionData && sessionData.user ? (
            <div className="cursor-pointer" onClick={() => void signOut()}>
              Sign out
            </div>
          ) : (
            <div className="cursor-pointer" onClick={() => void signIn()}>
              Sign in
            </div>
          )}
        </div> */}

        <SearchInput className={"w-1/3 max-lg:hidden"} />

        <div
          onClick={openCartMenu}
          className={`${
            cartMenu && "pointer-events-none"
          } relative flex cursor-pointer justify-between rounded border border-gray-100 border-opacity-30 p-3`}
        >
          <Icon img="/shopping-cart.svg" w={15} h={15} />
          {cart && cart.cartItems.length > 0 ? (
            <span className="absolute -right-1 -top-2 flex h-5 w-5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-600 opacity-50"></span>
              <span className="relative h-5 w-5 rounded-full bg-green-700 pl-1.5 text-sm">
                2
              </span>
            </span>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

{
  /* <div
  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-700 text-white transition duration-1000" // Adjust styling as needed
>
  {cart.cartItems.length}
</div>; */
}
