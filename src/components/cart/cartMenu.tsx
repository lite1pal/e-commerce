import { type ICart } from "~/interfaces/interfaces";
import Icon from "../helpful/icon";
import CartItem from "./cartItem";

export default function CartMenu(props: {
  fadeIn: boolean;
  closeCartMenu: () => void;
  cartMenu: boolean;
  cart: ICart | null | undefined;
}) {
  const { fadeIn, closeCartMenu, cartMenu, cart } = props;

  return (
    <div
      className={`${!cartMenu && "hidden"} ${
        fadeIn && "translate-x-full"
      } absolute flex min-h-screen w-screen flex-col bg-slate-950 p-6 transition duration-700`}
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
      {cart && cart.cartItems.length > 0 ? (
        <div className="mt-8 flex flex-grow flex-col justify-between gap-10 xl:mx-auto xl:w-10/12">
          <div className="flex flex-col gap-2">
            {/*  CART ITEM   */}

            {cart.cartItems.map((cartItem) => {
              return (
                <CartItem key={cartItem.id} cartItem={cartItem} cart={cart} />
              );
            })}
          </div>

          {/*   PAYMENT INFORMATION   */}
          <div className="flex flex-col gap-2 text-sm text-gray-400 md:mx-auto md:w-1/2 md:text-base">
            <div className="flex justify-between">
              <div>Taxes</div>
              <div className="text-base text-white">
                ${cart?.totalPrice ? cart.totalPrice * 0.03 + " USD" : ""}
              </div>
            </div>
            <hr />
            <div className="flex justify-between">
              <div>Shipping</div>
              <div>Calculated at checkout</div>
            </div>
            <hr />
            <div className="flex justify-between">
              <div>Total</div>
              <div className="text-base text-white">
                ${cart.totalPrice}.00USD
              </div>
            </div>
            <hr />
            <div className="mx-auto my-3 w-2/3 items-center rounded-full bg-blue-700 py-3 text-white transition duration-300 hover:bg-blue-800">
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
