import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { CheckoutInput, Checkbox } from "~/pages/components/checkout";
import { api } from "~/utils/api";

export default function Information() {
  const { data: sessionData, status } = useSession();

  const { data: cart } = api.cart.getCartByUserId.useQuery({
    userId: sessionData?.user.id!,
  });
  const { mutate: purchaseItem } =
    api.purchase.addItemToPurchasedItems.useMutation({
      onSuccess: () => {
        toast.success("Purchased");
      },
      onError: () => {
        toast.error("Error purchasing");
      },
    });

  return (
    <div className="flex flex-col gap-6">
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
      <div className="flex flex-col gap-4">
        <div className="text-lg font-bold">Shipping address</div>
        <CheckoutInput
          placeholder="Country region"
          className=""
          type="text"
          value=""
        />
        <CheckoutInput
          placeholder="First name (optional)"
          className=""
          type="text"
          value=""
        />
        <CheckoutInput
          placeholder="Last name"
          className=""
          type="text"
          value=""
        />
        <CheckoutInput
          placeholder="Address"
          className=""
          type="text"
          value=""
        />
        <CheckoutInput
          placeholder="Apartment, suit, etc. (optional)"
          className=""
          type="text"
          value=""
        />
        <CheckoutInput placeholder="City" className="" type="text" value="" />
        <CheckoutInput placeholder="State" className="" type="text" value="" />
        <CheckoutInput
          placeholder="ZIP code"
          className=""
          type="text"
          value=""
        />
        <div className="flex items-center gap-2 text-sm">
          <Checkbox />
          <div>Save this information for next time</div>
        </div>
      </div>
      <div
        onClick={() => {
          cart && purchaseItem({ cartId: cart.id });
          //   setShippingAccess(true);
          //   setOpenedComponent("shipping");
        }}
        className="mx-auto rounded bg-blue-700 px-8 py-4 text-sm font-bold"
      >
        <button>Continue to shipping</button>
      </div>
    </div>
  );
}
