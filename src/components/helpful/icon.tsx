import Image from "next/image";

export default function Icon({
  img,
  w,
  h,
}: {
  img: string;
  w: number;
  h: number;
}) {
  return <Image src={img} alt={`image-${img}`} width={w} height={h} />;
}
