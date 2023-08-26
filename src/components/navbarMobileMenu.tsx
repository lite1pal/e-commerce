import { signIn, signOut, useSession } from "next-auth/react";
import Icon from "./helpful/icon";
import SearchInput from "./helpful/searchInput";

export default function NavbarMobileMenu(props: {
  fadeIn: boolean;
  closeMobileMenu: () => void;
  mobileMenu: boolean;
}) {
  const { fadeIn, closeMobileMenu, mobileMenu } = props;
  const { data: sessionData } = useSession();
  return (
    <div
      className={`${!mobileMenu && "hidden"} ${
        fadeIn && "-translate-x-full"
      } absolute flex h-screen w-screen flex-col gap-5 bg-slate-950 p-4 transition duration-700`}
    >
      <div
        onClick={closeMobileMenu}
        className="w-fit cursor-pointer rounded border border-gray-100 border-opacity-30 p-3"
      >
        <Icon img="/x.svg" w={20} h={20} />
      </div>
      <SearchInput />
      <div className="flex cursor-pointer flex-col gap-3 text-xl font-light">
        <div>All</div>
        <div>Books</div>
        <div>Movies</div>
        {sessionData && sessionData.user ? (
          <div onClick={() => signOut()}>Sign out</div>
        ) : (
          <div onClick={() => signIn()}>Sign in</div>
        )}
      </div>
    </div>
  );
}
