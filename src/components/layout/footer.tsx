import Link from "next/link";
import Icon from "../helpful/icon";

export default function Footer() {
  return (
    <div className="mx-auto flex w-10/12 flex-col gap-10  py-5 lg:flex-row lg:gap-20">
      <Link href="/">
        <div className="flex items-center gap-2 text-xl font-light text-slate-200">
          <div className="cursor-pointer">
            <Icon
              img="https://static.vecteezy.com/system/resources/previews/009/384/332/original/old-vintage-book-clipart-design-illustration-free-png.png"
              w={40}
              h={40}
            />
          </div>
          <div>Book Store</div>
        </div>
      </Link>
      <div className="flex flex-col gap-4 text-xl font-extralight text-slate-300">
        <div className="hover:text-white hover:underline">Home</div>
        <div className="hover:text-white hover:underline">About</div>
        <div className="hover:text-white hover:underline">
          Terms & Conditions
        </div>
        <div className="hover:text-white hover:underline">
          Shipping & Return Policy
        </div>
        <div className="hover:text-white hover:underline">Private Policy</div>
        <div className="hover:text-white hover:underline">FAQ</div>
      </div>
    </div>
  );
}
