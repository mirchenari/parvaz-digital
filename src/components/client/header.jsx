"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";
import UserContext from "@/context/usercontext";
import CartContext from "@/context/cartcontext";

export default function Header() {
  const { logedUser } = useContext(UserContext);
  const { cart, getTotalNum } = useContext(CartContext);
  const [cartTotal, setCartTotal] = useState(0);
  const [scroll, setScroll] = useState(0);
  const [isTop, setIsTop] = useState(true);
  const route = useRouter();

  useEffect(() => {
    setCartTotal(getTotalNum());
  }, [cart]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > scroll) {
        setIsTop(false);
      } else {
        setIsTop(true);
      }
      setScroll(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scroll]);

  return (
    <motion.header
      layout
      className="z-10 bg-white border-b-gray-200 border-b  fixed top-0 left-0 right-0"
    >
      <section className="grid grid-cols-2 h-[100px] px-10 items-center">
        <div className="flex flex-1 items-center gap-10">
          <Link href="/">
            <Image
              src="/image/logo.png"
              alt="ParvazDigital"
              width={100}
              height={100}
            />
          </Link>
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
          <div className="relative">
            <button
              onClick={() => {
                route.push("/cart");
              }}
              className="border-gray-300 border-[1px] flex items-center px-2.5 h-[45px] rounded-sm"
            >
              <FontAwesomeIcon icon={faCartShopping} />
            </button>
            {cartTotal !== (0).toLocaleString("fa-IR") && (
              <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full text-[12px] bg-blue-400 text-white flex justify-center items-center">
                {cartTotal}
              </div>
            )}
          </div>
          <div>
            <Link
              href={
                typeof logedUser === "undefined" ? "/account" : "/dashboard"
              }
              className="flex items-center border-[#223c78] border-[1px] px-2.5 h-[45px] rounded-sm"
            >
              {typeof logedUser === "undefined"
                ? "ورود | ثبت نام"
                : "پنل کاربری"}
            </Link>
          </div>
        </div>
      </section>
      <motion.section
        className="py-3.5 px-10 overflow-hidden"
        initial={false}
        animate={{
          height: isTop ? 56 : 0,
          padding: isTop ? "14px 40px" : "0 40px",
        }}
      >
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
      </motion.section>
    </motion.header>
  );
}
