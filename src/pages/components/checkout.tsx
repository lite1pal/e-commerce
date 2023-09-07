import Link from "next/link";
import { useState } from "react";
import Information from "~/components/checkout/information";
import Payment from "~/components/checkout/payment";
import Shipping from "~/components/checkout/shipping";
import Icon from "~/components/helpful/icon";

export function CheckoutInput(props: {
  placeholder: string;
  className: string;
  value: string;
  type: string;
}) {
  const { placeholder, className, type } = props;

  return (
    <div className="relative h-12 w-full rounded-lg border border-white border-opacity-20 text-sm transition duration-1000">
      <input
        placeholder={placeholder}
        className={`${className} h-full w-full bg-transparent p-2 outline-none`}
        type={type}
      />
    </div>
  );
}

export function Checkbox() {
  return (
    <input
      id="link-checkbox"
      type="checkbox"
      value=""
      className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
    />
  );
}

export default function Checkout() {
  const [shippingAccess, setShippingAccess] = useState(false);
  const [paymentAccess, setPaymentAccess] = useState(false);
  const [openedComponent, setOpenedComponent] = useState<
    "info" | "shipping" | "payment"
  >("info");

  const showComponent = () => {
    switch (openedComponent) {
      case "info":
        return <Information />;
      case "shipping":
        return <Shipping />;
      case "payment":
        return <Payment />;
    }
  };

  return (
    <div className="flex min-h-screen w-screen flex-col bg-slate-900 text-white">
      <Link href="/">
        <div className="w-fit p-7">
          <Icon img="/apple.png" w={40} h={40} />
        </div>
      </Link>
      <div className="flex w-full cursor-pointer justify-between bg-slate-800 p-4">
        <div className="flex  items-center gap-2 text-sm text-slate-300">
          <div>
            <Icon img="/shopping-cart.svg" w={15} h={15} />
          </div>
          <div>Show order summary</div>
        </div>
        <div className="text-lg font-bold">$8.90</div>
      </div>
      <div className="flex flex-col gap-6 p-4">
        <div className="flex gap-2 text-xs font-bold">
          <div
            onClick={() => setOpenedComponent("info")}
            className={`${
              openedComponent !== "info" &&
              "pointer-events-auto cursor-pointer text-blue-400"
            } pointer-events-none text-white`}
          >
            Information
          </div>
          <div className="font-light">{">"}</div>
          <div
            onClick={() => setOpenedComponent("shipping")}
            className={`${
              shippingAccess &&
              openedComponent !== "shipping" &&
              "pointer-events-auto cursor-pointer text-blue-400"
            } pointer-events-none ${
              shippingAccess && "text-white"
            }text-slate-400`}
          >
            Shipping
          </div>
          <div className="font-light">{">"}</div>
          <div
            onClick={() => setOpenedComponent("payment")}
            className={`${
              paymentAccess &&
              openedComponent !== "payment" &&
              "pointer-events-auto cursor-pointer text-blue-400"
            } pointer-events-none ${
              paymentAccess && "text-white"
            }text-slate-400`}
          >
            Payment
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="text-lg font-bold">Contact</div>
          <CheckoutInput
            placeholder="Email address"
            className=""
            type="email"
            value=""
          />
          <div className="flex items-center gap-2 text-sm">
            <Checkbox />
            <div>Email me with news and offers</div>
          </div>
        </div>
        {showComponent()}
      </div>
    </div>
  );
}
