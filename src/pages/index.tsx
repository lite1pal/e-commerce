import Layout from "../components/layout/layout";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { api } from "~/utils/api";
import Item from "~/components/catalog/item";
import { useRef, type MouseEvent } from "react";
import LoadingSpinner from "~/components/helpful/loading";

export default function Home() {
  const { data: sessionData, status } = useSession();

  const popularItemsDiv = useRef<HTMLDivElement>(null);

  // Handles the smooth scroll buttons for the popular items
  const scrollPopularItems = (e: MouseEvent<HTMLDivElement>) => {
    if (popularItemsDiv.current) {
      const div = popularItemsDiv.current;

      if (e.target instanceof HTMLElement) {
        // const targetElement = e.target as HTMLElement;

        div.scrollTo({
          left:
            e.target.id === "scroll-right"
              ? div.scrollLeft - 700
              : div.scrollLeft + 700,
          behavior: "smooth",
        });
      }
    }
  };

  if (status === "loading" || !sessionData) {
    return <div className="h-screen w-screen bg-slate-900"></div>;
  }

  const { data: cart } = api.cart.getCartByUserId.useQuery({
    userId: sessionData.user.id,
  });

  const { data: items, isLoading: itemsLoading } = api.item.getAll.useQuery();

  return (
    <Layout>
      <div className="m-5 flex flex-col justify-center gap-5 max-lg:items-center lg:flex-row">
        {itemsLoading && (
          <div className="h-screen">
            <LoadingSpinner />
          </div>
        )}
        {items && (
          <Link href={`/components/item/${items[4]?.id}`}>
            <Image
              src={items[4]?.images[0] ? items[4].images[0] : ""}
              alt={`image-tshirt.png`}
              width={1920}
              height={1080}
              quality={100}
              style={{ objectFit: "contain", overflow: "hidden" }}
              className="aspect-square rounded-lg border border-gray-100 border-opacity-10 hover:border-blue-700"
            />
          </Link>
        )}

        <div className="flex w-fit flex-col gap-5">
          {items && (
            <Link href={`/components/item/${items[1]?.id}`}>
              <Image
                src={items[1]?.images[0] ? items[1].images[0] : ""}
                alt={`image-tshirt.png`}
                width={1920}
                height={1920}
                quality={100}
                style={{ objectFit: "cover", overflow: "hidden" }}
                className="aspect-square rounded-lg border border-gray-100 border-opacity-10 hover:border-blue-700 md:max-w-xl lg:max-w-md"
              />
            </Link>
          )}
          {items && (
            <Link href={`/components/item/${items[5]?.id}`}>
              <Image
                src={items[5]?.images[0] ? items[5].images[0] : ""}
                alt={`image-tshirt.png`}
                width={1920}
                height={1920}
                quality={100}
                style={{ objectFit: "cover", overflow: "hidden" }}
                className="aspect-square rounded-lg border border-gray-100 border-opacity-10 bg-slate-950 hover:border-blue-700 md:max-w-xl lg:max-w-md"
              />
            </Link>
          )}
        </div>
      </div>

      <div className="m-5 flex w-10/12 items-center justify-between font-extralight">
        <div className="text-2xl md:text-3xl">Popular now</div>
        <div className="flex items-center gap-5 lg:gap-16">
          <Link href="/components/catalog">
            <div className="cursor-pointer p-1 text-xl text-slate-300 underline transition hover:bg-slate-200 hover:text-black md:text-2xl">
              View all
            </div>
          </Link>
          <div className="flex gap-2 text-base lg:gap-5">
            <div
              id="scroll-right"
              onClick={scrollPopularItems}
              className="cursor-pointer p-2 hover:bg-slate-300 hover:text-black"
            >
              {"<"}
            </div>
            <div
              id="scroll-left"
              onClick={scrollPopularItems}
              className="cursor-pointer p-2 hover:bg-slate-300 hover:text-black"
            >
              {">"}
            </div>
          </div>
        </div>
      </div>

      <div
        ref={popularItemsDiv}
        className="max-w-screen m-5 flex flex-col gap-7 overflow-x-auto"
      >
        <div
          className={`flex min-w-max flex-row justify-center gap-5 transition`}
        >
          {items
            ? items.map((item) => {
                return (
                  <Item
                    key={item.id}
                    item={item}
                    cart={cart}
                    popularNow={true}
                  />
                );
              })
            : null}
        </div>
      </div>
    </Layout>
  );
}
