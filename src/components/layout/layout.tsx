import { useEffect, useState } from "react";
import Navbar from "~/components/layout/navbar";
import NavbarMobileMenu from "../navbarMobileMenu";
import CartMenu from "../cart/cartMenu";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import LoadingSpinner from "../helpful/loading";
import Footer from "./footer";
import Newsletter from "./newsletter";

export function Discount() {
  return (
    <div className="flex w-full bg-blue-900 p-1 text-slate-200">
      <div className="mx-auto text-xs">UP TO 50% OFF</div>
    </div>
  );
}

export default function Layout({ children }: React.PropsWithChildren<object>) {
  const [fadeIn, setFadeIn] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cartMenu, setCartMenu] = useState(false);

  const [test, setTest] = useState(false);

  const { data: sessionData, status } = useSession();

  // State to keep track of the vertical scroll position
  const [scrollPosition, setScrollPosition] = useState(0);

  const [scrollBeforeCart, setScrollBeforeCart] = useState(0);

  useEffect(() => {
    if (!test) {
      window.scrollTo(0, scrollBeforeCart);
    }
  }, [test]);

  useEffect(() => {
    if ((cartMenu && !fadeIn) || (mobileMenu && !fadeIn)) {
      setTimeout(() => {
        setTest(true);
      }, 1000);
    }
  }, [fadeIn]);

  // Attach the scroll event listener when the component mounts
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const { data: cart } = api.cart.getCartByUserId.useQuery({
    userId: sessionData?.user.id!,
  });

  const closeCartMenu = () => {
    setTest(false); // removes h-screen and overflow-y-auto from main layout
    setFadeIn(true);
    setTimeout(() => {
      setCartMenu(false);
    }, 1000);
  };

  const closeMobileMenu = () => {
    setTest(false);
    setFadeIn(true);
    setTimeout(() => {
      setMobileMenu(false);
    }, 1000);
  };

  // Event handler to update scroll position
  const handleScroll = () => {
    setScrollPosition(window.scrollY);
  };

  return (
    <main
      className={`${
        test && "h-screen overflow-hidden"
      } relative z-0 flex flex-col gap-5 bg-slate-900 text-white selection:bg-pink-600`}
    >
      {/* {router.pathname === "/components/catalog" && <Discount />} */}
      <NavbarMobileMenu
        {...{
          fadeIn,
          closeMobileMenu,
          mobileMenu,
          test,
        }}
      />

      {/*   CART MENU   */}
      <CartMenu
        {...{
          fadeIn,
          closeCartMenu,
          cartMenu,
          cart,
          scrollPosition,
          setTest,
          test,
        }}
      />
      <Navbar
        {...{
          mobileMenu,
          cartMenu,
          setMobileMenu,
          setCartMenu,
          cart,
          setFadeIn,
          scrollPosition,
          setScrollBeforeCart,
          setTest,
        }}
      />
      {children}
      <hr className="mx-auto w-10/12 opacity-30" />
      <Newsletter />
      <hr className="mx-auto w-10/12 opacity-30" />
      <Footer />
    </main>
  );
}
