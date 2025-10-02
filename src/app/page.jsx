import Image from "next/image";
import CategoryPreview from "@/components/server/categoryPreview";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="w-[100%] h-[350px] hidden sm:block">
        <Link href="/">
          <div className="relative h-[100%]">
            <Image src="/image/banner.webp" alt="banner" fill />
          </div>
        </Link>
      </section>
      <CategoryPreview category="لپ تاپ" />
      <section className="flex flex-col items-center gap-5 m-5 sm:m-10">
        <div>
          <h4 className="font-bold text-xl sm:text-2xl">برترین های موبایل</h4>
        </div>
        <div className="grid grid-cols-2 justify-items-center sm:flex sm:justify-center sm:gap-16">
          <div>
            <Link href="/">
              <Image
                src="/image/samsung.webp"
                alt="samsung"
                width={180}
                height={180}
              />
            </Link>
          </div>
          <div>
            <Link href="/">
              <Image
                src="/image/poco.webp"
                alt="poco"
                width={180}
                height={180}
              />
            </Link>
          </div>
          <div>
            <Link href="/">
              <Image
                src="/image/iphone.webp"
                alt="iphone"
                width={180}
                height={180}
              />
            </Link>
          </div>
          <div>
            <Link href="/">
              <Image
                src="/image/xiaomi.webp"
                alt="xiaomi"
                width={180}
                height={180}
              />
            </Link>
          </div>
        </div>
      </section>
      <CategoryPreview category="آیفون" />
      <section className="flex flex-col sm:flex-row gap-5 sm:gap-10 m-5 sm:m-10">
        <div className="flex-1">
          <Link href="/">
            <div className="w-[100%] relative h-[250px]">
              <Image
                src="/image/banner-game.webp"
                alt="iphone"
                fill
                className="rounded-2xl"
              />
            </div>
          </Link>
        </div>
        <div className="flex-1">
          <Link href="/">
            <div className="w-[100%] relative h-[250px]">
              <Image
                src="/image/banner-iphone.webp"
                alt="iphone"
                fill
                className="rounded-2xl"
              />
            </div>
          </Link>
        </div>
      </section>
      <CategoryPreview category="سامسونگ" />
    </>
  );
}
