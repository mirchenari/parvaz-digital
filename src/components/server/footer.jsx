import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-l from-[#1A3670] to-[#0078B0] text-white px-5 py-10 sm:p-20">
      <section className="flex flex-col gap-5 mb-2.5 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex flex-col gap-5 border-b pb-5 sm:border-b-0 sm:pb-0">
          <h5 className="font-bold text-lg">ارتباط با ما</h5>
          <p>تلفن: 021 - 91077500</p>
          <p>ایمیل: chenarcode@gmail.com</p>
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
        <p className="text-xs sm:text-sm">
          1404 - طراحی و توسعه توسط <a href="https://chenarcode.ir/" id="footer-link">چنار کد</a>
        </p>
      </section>
    </footer>
  );
}
