import { useSession } from "next-auth/react";
import Catalog from "~/components/catalog/catalog";
import { redirect } from "next/navigation";
import LoadingSpinner from "~/components/helpful/loading";

export default function Home() {
  const { data: sessionData, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      redirect("/components/signIn");
    },
  });

  if (status === "loading" || !sessionData) {
    return <div className="">hello</div>;
  }

  return <Catalog sessionData={sessionData} />;
}
