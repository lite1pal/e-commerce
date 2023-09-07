import { useRouter } from "next/router";
import Layout from "~/components/layout/layout";
import { api } from "~/utils/api";
import Image from "next/image";
import { type IItem, type IReview } from "~/interfaces/interfaces";
import { useSession } from "next-auth/react";
import { type Dispatch, type SetStateAction, useState } from "react";
import { toast } from "react-hot-toast";

export function AboutAuthor({ item }: { item: IItem }) {
  return (
    <div className="mx-auto w-10/12">
      <hr className="opacity-30" />
      <div className="flex flex-col gap-7 py-5">
        <div className="text-2xl">About the Author</div>
        <div className="flex gap-7">
          <div className="w-24 lg:w-32">
            <Image
              src="https://m.media-amazon.com/images/S/amzn-author-media-prod/hq6oari96tk6tlqvhqs9qqcvi8._SY600_.jpg"
              alt="author-image"
              width={1920}
              height={1080}
              className="w-fit rounded-full"
            />
          </div>
          <div className="flex w-10/12 flex-col gap-5">
            <div className="w-fit cursor-pointer text-xl text-slate-300 hover:underline">
              <a
                href="https://en.wikipedia.org/wiki/J._R._R._Tolkien"
                target="_blank"
              >
                {item.author}
              </a>
            </div>
            <div className="text-sm text-slate-400">
              J.R.R. Tolkien was born on 3rd January 1892. After serving in the
              First World War, he became best known for The Hobbit and The Lord
              of the Rings, selling 150 million copies in more than 40 languages
              worldwide. Awarded the CBE and an honorary Doctorate of Letters
              from Oxford University, he died in 1973 at the age of 81.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Review({ review }: { review: IReview }) {
  return (
    <div className="flex gap-7">
      <div className="flex flex-col items-center gap-5">
        <div className="flex items-center gap-4">
          <Image
            src={review.user.image!}
            width={1920}
            height={1080}
            alt="user-image"
            className="h-10 w-10 rounded-full"
          />

          <div className="text-lg font-light text-slate-100">
            {review.user.name}
          </div>
        </div>
        <div className="flex gap-1">
          <i className="fa-solid fa-star fa-xs" style={{ color: "orange" }}></i>
          <i className="fa-solid fa-star fa-xs" style={{ color: "orange" }}></i>
          <i className="fa-solid fa-star fa-xs" style={{ color: "orange" }}></i>
          <i className="fa-solid fa-star fa-xs" style={{ color: "orange" }}></i>
          <i className="fa-solid fa-star fa-xs" style={{ color: "orange" }}></i>
        </div>
        <div className="font-light text-slate-300">
          {new Date(review.createdAt).toLocaleDateString()}
        </div>
      </div>
      <div className="font-extralight text-slate-300 lg:w-2/3">
        {review.content}...
        {/* <span className="cursor-pointer text-blue-400 hover:underline">
          {" "}
          Read more
        </span> */}
      </div>
    </div>
  );
}

export function WriteReview({
  item,
  writeReviewVision,
  setWriteReviewVision,
}: {
  item: IItem;
  writeReviewVision: boolean;
  setWriteReviewVision: Dispatch<SetStateAction<boolean>>;
}) {
  const { data: sessionData, status } = useSession();

  const [contentInput, setContentInput] = useState("");

  if (status === "loading" || !sessionData) {
    return <div className="h-screen w-screen bg-slate-900"></div>;
  }
  // const [rating, setRating] = useState(0);
  // const ratingRef = useRef(null);

  const ctx = api.useContext();

  const { mutate: postReview } = api.review.postReview.useMutation({
    onSuccess: () => {
      toast.success("Review is posted!");
      void ctx.item.getByItemId.invalidate();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  // const handleRating = () => {};
  return (
    <div
      className={`${
        !writeReviewVision && "pointer-events-none opacity-0"
      } fixed left-1/2 top-0 z-10 flex h-fit w-3/4 -translate-x-1/2 translate-y-1/3 transform flex-col gap-5 rounded-lg bg-gray-800 p-5 md:w-7/12 lg:w-5/12`}
    >
      <div className="flex flex-col gap-1">
        <div className="text-slate-300">Write a review</div>
        <div className="text-sm text-slate-400">The Hobbit</div>
      </div>
      <hr className="opacity-20" />
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <Image
            src={sessionData.user.image ? sessionData.user.image : ""}
            width={1920}
            height={1080}
            alt="user-image"
            className="h-10 w-10 rounded-full"
          />
          <div className="flex flex-col">
            <div className="text-sm font-semibold">{sessionData.user.name}</div>
            <div className="text-sm font-extralight text-slate-300">
              Posting publicly.{" "}
              <span className="cursor-pointer text-blue-600 hover:underline">
                Learn more
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-1">
          <i id="one" className="fa-solid fa-star"></i>
          <i id="two" className="fa-solid fa-star"></i>
          <i id="three" className="fa-solid fa-star"></i>
          <i id="four" className="fa-solid fa-star"></i>
          <i id="five" className="fa-solid fa-star"></i>
        </div>
      </div>
      <div className="mt-3 w-full rounded border border-gray-100 border-opacity-20">
        <textarea
          onChange={(e) => setContentInput(e.target.value)}
          className="h-44 w-full bg-transparent px-4 py-2 outline-none outline-1 placeholder:text-sm placeholder:opacity-50"
          placeholder="Your feedback helps other to decide which films to watch."
        ></textarea>
      </div>
      <div className="flex justify-end gap-10">
        <button
          onClick={() => setWriteReviewVision(false)}
          className="text-sm text-blue-300"
        >
          Cancel
        </button>
        <button
          onClick={() =>
            postReview({
              userId: sessionData.user.id,
              itemId: item.id,
              content: contentInput,
            })
          }
          className="rounded bg-blue-300 px-6 py-2 text-black transition duration-1000 hover:bg-blue-400"
        >
          Post
        </button>
      </div>
    </div>
  );
}

export function Reviews({ item }: { item: IItem }) {
  const [writeReviewVision, setWriteReviewVision] = useState(false);
  return (
    <div
      className={`mx-auto ${
        item.reviews.length > 0 ? "h-96" : "h-44"
      } w-10/12 overflow-y-auto`}
    >
      <hr className="opacity-30" />
      <div className="flex flex-col gap-7 py-5">
        <div className="flex w-full justify-between">
          <div className="text-2xl">Review</div>
          <button
            onClick={() => setWriteReviewVision(true)}
            className="rounded border px-2 py-2 font-light hover:bg-gray-800"
          >
            Write a review
          </button>
          <WriteReview {...{ item, writeReviewVision, setWriteReviewVision }} />
        </div>
        {item.reviews.length > 0 ? (
          item.reviews.map((review) => {
            return <Review key={review.id} review={review} />;
          })
        ) : (
          <div className="mx-auto w-fit text-slate-300">No reviews yet.</div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  const router = useRouter();

  // const [reducedOpacity, setReducedOpacity] = useState(false);

  const { data: item, isLoading: itemLoading } = api.item.getByItemId.useQuery({
    itemId: router.query.id as string,
  });

  if (itemLoading || !item) {
    return <div className="h-screen w-screen bg-slate-900"></div>;
  }

  return (
    <Layout>
      <div className="mx-auto flex flex-col gap-10 p-5 max-xl:items-center xl:max-h-screen xl:flex-row">
        <div className="order-1 flex flex-col gap-5">
          <div className="order-1 flex flex-col gap-1 xl:hidden">
            <div className="text-2xl">{item.name}</div>
            <div className="text-lg text-slate-400">{item.author}</div>
          </div>
          <Image
            src={
              item.images.length > 0 && item.images[0]
                ? item.images[0]
                : "/tshirt.png"
            }
            alt={`image-tshirt.png`}
            width={1920}
            height={1080}
            quality={100}
            className="order-3 rounded-lg max-sm:w-80 sm:max-w-sm xl:order-2"
          />
          <div className="order-2 flex justify-center gap-5 xl:order-3">
            <div className="w-fit cursor-pointer rounded-full bg-slate-700 px-4 py-3 hover:bg-slate-600">
              <i className="fa-regular fa-heart"></i>
            </div>
            <div className="w-fit cursor-pointer rounded-full bg-slate-700 px-4 py-3 hover:bg-slate-600">
              Read a sample
            </div>
          </div>
        </div>

        <div className="order-3 flex flex-col gap-6 overflow-y-auto sm:p-5 xl:order-2">
          <div className="flex flex-col gap-1 max-xl:hidden">
            <div className="text-2xl">{item.name}</div>
            <div className="text-lg text-slate-400">{item.author}</div>
          </div>

          <div className="flex gap-10 overflow-y-auto">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <div>Format</div>
                <div className="text-slate-400">Paperback</div>
              </div>
              <div className="flex flex-col gap-1">
                <div>Language</div>
                <div className="text-slate-400">English</div>
              </div>
              <div className="flex flex-col gap-1">
                <div>Publisher</div>
                <div className="text-slate-400">Fondo & Cracks</div>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <div>Publication date</div>
                <div className="text-slate-400">Fondo & Cracks</div>
              </div>
              <div className="flex flex-col gap-1">
                <div>Pages</div>
                <div className="text-slate-400">480</div>
              </div>
              <div className="flex flex-col gap-1">
                <div>Dimensions</div>
                <div className="text-slate-400">4.23 x 4.1 x 7.04 inches</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 xl:w-3/4">
            <div>Description</div>
            <div className="text-slate-400">
              When Thorin Oakenshield and his band of dwarves embark upon a
              dangerous quest to reclaim the hoard of gold stolen from them by
              the evil dragon Smaug, Gandalf the wizard suggests an unlikely
              accomplice: Bilbo Baggins, an unassuming Hobbit dwelling in
              peaceful Hobbiton. Along the way, the company faces trolls,
              goblins, giant spiders, and worse. But as they journey from the
              wonders of Rivendell to the terrors of Mirkwood and beyond, Bilbo
              will find that there is more to him than anyone—himself
              included—ever dreamed. Unexpected qualities of courage and
              cunning, and a love of adventure, propel Bilbo toward his great
              destiny . . . a destiny that waits in the dark caverns beneath the
              Misty Mountains, where a twisted creature known as Gollum
              jealously guards a precious magic ring.{" "}
            </div>
          </div>
        </div>

        <div className="order-2 flex w-full flex-col gap-10 sm:p-5 xl:order-3">
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-light">{item.price}.00 USD</div>
            <div className="text-base text-green-500">Available</div>
          </div>
          <div className="flex flex-col gap-3">
            <button className="bg-blue-500 p-3 hover:bg-blue-700">
              Buy now
            </button>
            <button className="bg-orange-700 p-3 hover:bg-orange-800">
              Add to cart
            </button>
          </div>
        </div>
      </div>
      <Reviews item={item} />
      <AboutAuthor item={item} />
    </Layout>
  );
}
