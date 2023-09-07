import { CheckoutInput } from "~/pages/components/checkout";

export default function Newsletter() {
  return (
    <div className="mx-auto flex w-fit flex-col items-center justify-center gap-5 p-10 font-light">
      <div className="text-3xl">Book Newsletter</div>
      <div className="break-words text-lg">
        Get the latest books, discounts and updates straight to your inbox.
      </div>
      <div className="flex flex-col items-center gap-5">
        {/* <input className="bg-transparent p-3" type="email" /> */}
        <CheckoutInput
          placeholder={"Email"}
          className={"w-60"}
          value={""}
          type={"email"}
        />
        <button className=" w-1/2 rounded-xl bg-gray-700 py-3 uppercase text-white hover:bg-gray-800">
          Subscribe
        </button>
      </div>
    </div>
  );
}
