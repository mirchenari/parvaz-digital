import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-l from-[#1A3670] to-[#0078B0] text-white p-20">
      <section className="flex justify-between items-center">
        <div className="flex flex-col gap-5">
          <h5 className="font-bold text-lg">ارتباط با ما</h5>
          <p>تلفن: 021 - 91077500</p>
          <p>ایمیل: info@technolife.com</p>
        </div>
        <div>
          <h5 className="font-bold text-lg">دانلود اپلیکیشن</h5>
          <div className="flex gap-2.5 mt-2.5">
            <Link href="/">
              <Image
                src="/image/bazzar.svg"
                alt="bazzar"
                width={135}
                height={50}
              />
            </Link>
            <Link href="/">
              <Image
                src="/image/mayket.svg"
                alt="mayket"
                width={135}
                height={50}
              />
            </Link>
          </div>
        </div>
      </section>
      <section className="absolute bottom-0 left-0 right-0 text-center pb-2.5">
        <p className="text-sm">
          1404 - تمامی حقوق مادی و معنوی این سایت محفوظ می باشد.
        </p>
      </section>
    </footer>
  );
}
