import { signIn, signOut, useSession } from "next-auth/react";
import Icon from "./helpful/icon";
import Link from "next/link";
import { SearchInput } from "~/pages/components/catalog";

export default function NavbarMobileMenu(props: {
  fadeIn: boolean;
  closeMobileMenu: () => void;
  mobileMenu: boolean;
  test: boolean;
}) {
  const { fadeIn, closeMobileMenu, mobileMenu, test } = props;
  const { data: sessionData } = useSession();
  return (
    <div
      className={`${!mobileMenu && "hidden"} ${fadeIn && "-translate-x-full"} ${
        !test && "pointer-events-none"
      } fixed top-0 z-20 flex h-screen w-screen flex-col gap-5 bg-slate-950 p-4 transition duration-700`}
    >
      <div
        onClick={closeMobileMenu}
        className="w-fit cursor-pointer rounded border border-gray-100 border-opacity-30 p-3"
      >
        <Icon img="/x.svg" w={20} h={20} />
      </div>
      <SearchInput className={undefined} />
      <div className="flex flex-col gap-3 text-xl font-light">
        <Link href="/components/catalog">
          <div className="cursor-pointer">Books</div>
        </Link>
        <div className="cursor-pointer">About</div>

        <Link href="/components/purchases">
          <div className="cursor-pointer">Purchases</div>
        </Link>

        {sessionData && sessionData.user ? (
          <div className="cursor-pointer" onClick={() => void signOut()}>
            Sign out
          </div>
        ) : (
          <div className="cursor-pointer" onClick={() => void signIn()}>
            Sign in
          </div>
        )}
      </div>
    </div>
  );
}
