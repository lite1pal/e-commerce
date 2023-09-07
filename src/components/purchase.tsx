import Image from "next/image";
import { type IPurchasedItem } from "~/interfaces/interfaces";

export default function Purchase({
  purchasedItem,
}: {
  purchasedItem: IPurchasedItem;
}) {
  const { item } = purchasedItem;
  return (
    <div className="relative z-0 flex aspect-square w-full max-w-xs flex-col justify-between rounded-lg border border-gray-100 border-opacity-10 bg-slate-950 hover:border-blue-700">
      <div className="w-full max-w-full">
        <Image
          src={
            item.images.length > 0 && item.images[0]
              ? item.images[0]
              : "/tshirt.png"
          }
          alt={`image-tshirt.png`}
          width={1920}
          height={1080}
          className="w-full"
          quality={100}
        />
      </div>

      <div className="absolute bottom-0 flex w-full items-center justify-between gap-3 bg-slate-950 p-3">
        <div className="flex w-full flex-col rounded border-gray-100 border-opacity-10 ">
          <div className="px-4 py-2 text-sm">{item.name}</div>
          <div className="ml-3 w-fit rounded bg-slate-600 p-1 text-xs font-bold">
            ${item.price}.00 USD
          </div>
        </div>
      </div>
    </div>
  );
}
