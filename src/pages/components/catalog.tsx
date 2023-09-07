import { api } from "~/utils/api";
import LoadingSpinner from "../../components/helpful/loading";
import Item from "../../components/catalog/item";
import Layout from "~/components/layout/layout";
import { useSession } from "next-auth/react";

function Filter({ filter, options }: { filter: string; options: string[] }) {
  return (
    <div className="flex flex-col gap-3">
      <div>{filter}</div>
      <div className="flex flex-col gap-1 text-sm text-slate-400">
        {options.map((option, index) => {
          return (
            <div key={index} className="flex gap-2">
              <input type="checkbox" className="w-3" />
              <div>{option}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Filters() {
  return (
    <div
      className={`m-8 flex flex-col gap-8 transition duration-700 max-lg:hidden`}
    >
      <Filter
        filter="Availability"
        options={["Ready for shipping", "Unavailable"]}
      />

      <Filter filter="Language" options={["English", "Ukrainian"]} />

      <Filter
        filter="Book type"
        options={["Paperback", "Digital", "Audiobook"]}
      />

      <Filter
        filter="Publisher"
        options={[
          "HarperCollins Publishers",
          "Macmillan Ltd",
          "Ebury Press",
          "Random House",
        ]}
      />

      <div className="flex flex-col gap-3">
        <div>Price</div>
        <div className="flex flex-col items-center gap-5">
          <div className="flex gap-4 text-sm  text-slate-400">
            <div className="flex gap-2">
              <div>From</div>
              <input
                type="number"
                className="w-16 rounded-full bg-slate-700 text-white outline-none"
              />
            </div>
            <div className="flex gap-2">
              <div>To</div>
              <input
                type="number"
                className="w-16 rounded-full bg-slate-700 text-white"
              />
            </div>
          </div>
          <button className="rounded bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 hover:text-white">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Catalog() {
  const { data: sessionData, status } = useSession();

  if (status === "loading" || !sessionData) {
    return <div className="h-screen w-screen bg-slate-900"></div>;
  }

  const { data: items, isLoading: itemsLoading } = api.item.getAll.useQuery();

  const { data: cart } = api.cart.getCartByUserId.useQuery({
    userId: sessionData.user.id,
  });

  return (
    <Layout>
      <div className="flex flex-col gap-5">
        <div className="mx-auto flex w-11/12 flex-col justify-between gap-5 bg-slate-900 p-5 lg:flex-row lg:items-center">
          <div className=" flex flex-col gap-5 text-2xl font-light text-slate-100">
            <div className="">Fiction books</div>
            {itemsLoading ? <LoadingSpinner /> : null}
          </div>
          <hr className="mx-auto w-full opacity-30 lg:hidden" />
        </div>
        <hr className="mx-auto w-11/12 opacity-30 max-lg:hidden" />

        <div className="flex">
          <Filters />
          <div
            className={`flex flex-row flex-wrap gap-5 p-5 transition duration-300 max-xl:justify-center`}
          >
            {items
              ? items.map((item) => {
                  return (
                    <Item
                      key={item.id}
                      {...{ item, cart }}
                      popularNow={undefined}
                    />
                  );
                })
              : null}
          </div>
        </div>
      </div>
    </Layout>
  );
}
