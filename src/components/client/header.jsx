"use client";

import { useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import UserContext from "@/context/usercontext";

export default function Header() {
  const { logedUser } = useContext(UserContext);

  return (
    <header>
      <section className="z-10 grid grid-cols-2 h-[100px] px-10 bg-white items-center fixed top-0 left-0 right-0">
        <div className="flex flex-1 items-center gap-10">
          <Link href="/">
            <Image
              src="/image/logo.png"
              alt="ParvazDigital"
              width={100}
              height={100}
            />
          </Link>
          <div></div>
          <div className="flex-1">
            <form className="flex items-center w-[100%] gap-2.5 px-4 bg-gray-200 rounded-sm">
              <div className="text-xl">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="محصول، برند یا دسته مورد نظرتان را جستجو کنید."
                  className="w-[100%] py-4 focus:outline-none"
                />
              </div>
            </form>
          </div>
        </div>
        <div className="flex-1 flex items-center gap-5" dir="ltr">
          <div>
            <button className="border-gray-300 border-[1px] flex items-center px-2.5 h-[45px] rounded-sm">
              <FontAwesomeIcon icon={faCartShopping} />
            </button>
          </div>
          <div>
            <Link
              href="/account"
              className="flex items-center border-[#223c78] border-[1px] px-2.5 h-[45px] rounded-sm"
            >
              {Object.keys(logedUser).length == 0
                ? "ورود | ثبت نام"
                : "پنل کاربری"}
            </Link>
          </div>
        </div>
      </section>
      <section className="py-3.5 pt-[100px] px-10 bg-white">
        <div>
          <nav className="flex gap-10">
            <h4 className="text-lg font-bold text-[#223c78]">
              دسته بندی محصولات
            </h4>
            <Link href="/">لپ تاپ</Link>
            <Link href="/">کنسول بازی</Link>
            <Link href="/">آیفون</Link>
            <Link href="/">سامسونگ</Link>
            <Link href="/">شیائومی</Link>
            <Link href="/">ابزار</Link>
          </nav>
        </div>
      </section>
    </header>
  );
}
