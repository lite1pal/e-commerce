import { type Session } from "next-auth";
import { useState } from "react";
import { api } from "~/utils/api";
import CartMenu from "../cart/cartMenu";
import Icon from "../helpful/icon";
import LoadingSpinner from "../helpful/loading";
import NavbarMobileMenu from "../navbarMobileMenu";
import Item from "./item";

export default function Catalog(props: { sessionData: Session }) {
  const { sessionData } = props;
  const { data: items, isLoading: itemsLoading } = api.item.getAll.useQuery();

  const { data: cart } = api.cart.getCartByUserId.useQuery({
    userId: sessionData.user.id,
  });

  const [fadeIn, setFadeIn] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cartMenu, setCartMenu] = useState(false);

  // onClick functions
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
      } flex min-h-screen flex-col gap-10 bg-slate-900 text-white selection:bg-pink-600`}
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
          className="relative z-0 flex cursor-pointer justify-between rounded border border-gray-100 border-opacity-30 p-3"
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
      </nav>

      {/*   ITEMS    */}
      <div
        className={`${
          mobileMenu && ""
        } m-5 flex flex-row flex-wrap justify-center gap-5 transition duration-300`}
      >
        {itemsLoading ? <LoadingSpinner /> : null}
        {items
          ? items.map((item) => {
              return <Item key={item.id} {...{ item, cart, openCartMenu }} />;
            })
          : null}
      </div>
    </main>
  );
}
