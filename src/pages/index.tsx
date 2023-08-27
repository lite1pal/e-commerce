import { useSession } from "next-auth/react";
import Catalog from "~/components/catalog/catalog";
import { redirect, useRouter } from "next/navigation";
import LoadingSpinner from "~/components/helpful/loading";
import SignIn from "~/components/signIn";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { data: sessionData, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/"); // Redirect authenticated users to the catalog page
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="h-screen w-screen bg-slate-900"></div>;
  }

  return status === "authenticated" ? (
    <Catalog sessionData={sessionData} />
  ) : (
    <SignIn />
  );
}
