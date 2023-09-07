import { useSession } from "next-auth/react";
import LoadingSpinner from "~/components/helpful/loading";
import Layout from "~/components/layout/layout";
import Purchase from "~/components/purchase";
import { api } from "~/utils/api";

export default function Purchases() {
  const { data: sessionData, status } = useSession();

  if (status === "loading" || !sessionData) {
    return <div className="h-screen w-screen bg-slate-900"></div>;
  }

  const { data: purchasedItems, isLoading: purchasedItemsLoading } =
    api.purchase.getAllByUserId.useQuery({
      userId: sessionData.user.id,
    });

  return (
    <Layout>
      <div className="flex flex-col">
        <div className="flex flex-col items-center justify-center gap-5">
          <div className="flex flex-col gap-5 text-lg">
            <div>Purchases</div>
            {purchasedItemsLoading ? <LoadingSpinner /> : null}
          </div>
        </div>
        <div
          className={`m-5 flex flex-row flex-wrap justify-center gap-5 transition duration-300`}
        >
          {purchasedItems
            ? purchasedItems.map((purchasedItem) => {
                return (
                  <Purchase key={purchasedItem.id} {...{ purchasedItem }} />
                );
              })
            : null}
        </div>
      </div>
    </Layout>
  );
}
