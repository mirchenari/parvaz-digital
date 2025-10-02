"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faCartShopping,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import UserContext from "@/context/usercontext";
import CartContext from "@/context/cartcontext";
import buildUrl from "@/functions/buildUrl";

function SearchBack({ onClick }) {
  useEffect(() => {
    const body = document.querySelector("body");
    if (body) {
      body.style.overflow = "hidden";
    }
    return () => {
      body.style.overflow = "auto";
    };
  }, []);

  return (
    <motion.section
      className="bg-white sm:bg-black/30 fixed inset-0 z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClick}
    ></motion.section>
  );
}

function SearchBar({ className, isMobile, products }) {
  const [searchValue, setSearchValue] = useState("");
  const searchedProducts = products.filter((item) =>
    item.title.toLowerCase().includes(searchValue.toLowerCase().trim())
  );

  return (
    <>
      <AnimatePresence>
        {searchValue && (
          <SearchBack
            onClick={() => {
              setSearchValue("");
            }}
          />
        )}
      </AnimatePresence>
      <div
        className={"flex-1 relative z-30" + " " + className}
        style={
          isMobile
            ? searchValue
              ? {
                  position: "fixed",
                  inset: 0,
                  paddingTop: "20px",
                  overflowY: "auto",
                }
              : null
            : null
        }
      >
        <div className="flex gap-2">
          <form
            className="flex items-center w-[100%] gap-2.5 px-4 bg-gray-200 rounded-sm"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="text-xl">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="محصول یا برند مورد نظرتان را جستجو کنید."
                className="w-[100%] py-4 focus:outline-none"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
              />
            </div>
          </form>
          {searchValue && isMobile && (
            <button
              className="sm:hidden text-xl"
              onClick={() => {
                setSearchValue("");
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          )}
        </div>
        <AnimatePresence>
          {searchValue && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-5 sm:px-0 sm:bg-white absolute right-0 left-0 sm:personal-shadow p-2.5 rounded-xl mt-2.5 flex flex-col gap-5"
            >
              {searchedProducts.length == 0 ? (
                <p className="text-red-500 font-bold">هیچ محصولی پیدا نشد.</p>
              ) : (
                searchedProducts.map((item) => (
                  <Link
                    href={`/product/${buildUrl(item.title)}?product=${
                      item._id
                    }`}
                    target="_blank"
                    key={item._id}
                  >
                    <div className="flex gap-2.5 items-center">
                      <div>
                        <img
                          src={item.currentImage}
                          alt={item.title}
                          className="max-w-[56px]"
                        />
                      </div>
                      <div>
                        <p className="line-clamp-1">{item.title}</p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default function Header() {
  const { logedUser } = useContext(UserContext);
  const { cart, getTotalNum } = useContext(CartContext);
  const [cartTotal, setCartTotal] = useState(0);
  const [scroll, setScroll] = useState(0);
  const [isTop, setIsTop] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isSideBar, setIsSideBar] = useState(false);
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

  useEffect(() => {
    fetch("/api/get-data/products")
      .then(async (e) => {
        let data = await e.json();
        if (!e.ok) {
          throw new Error(data.message);
        }
        return data;
      })
      .then((e) => {
        setProducts(e);
      })
      .catch((err) => {
        console.error(err);
      });

    fetch("/api/get-data/categories")
      .then(async (e) => {
        let data = await e.json();
        if (!e.ok) {
          throw new Error(data.message);
        }
        return data;
      })
      .then((e) => {
        setCategories(e);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <motion.header
      layout
      className="z-10 bg-white border-b-gray-200 border-b sm:fixed top-0 left-0 right-0"
    >
      <section className="flex justify-between sm:grid sm:grid-cols-2 h-[100px] px-5 sm:px-10 items-center">
        <div className="sm:hidden text-xl">
          <button
            onClick={() => {
              setIsSideBar(true);
            }}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
        <AnimatePresence>
          {isSideBar && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-50"
            >
              <motion.nav
                initial={{ opacity: 0, translateX: 300 }}
                animate={{ opacity: 1, translateX: 0 }}
                exit={{ opacity: 0, translateX: 100 }}
                className="flex flex-col gap-8 bg-white h-full w-64 p-2.5"
              >
                <div className="flex justify-between items-center text-lg font-bold">
                  <h4 className="text-[#223c78]">دسته بندی محصولات</h4>
                  <button
                    onClick={() => {
                      setIsSideBar(false);
                    }}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
                {categories.map((item) => (
                  <Link
                    key={item._id}
                    href={`/category/${buildUrl(item.title)}?category=${item._id}`}
                  >
                    {item.title}
                  </Link>
                ))}
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-center gap-10">
          <Link href="/">
            <Image
              src="/image/logo.png"
              alt="ParvazDigital"
              width={100}
              height={100}
            />
          </Link>
          <SearchBar className="hidden sm:block" products={products} />
        </div>
        <div className="flex items-center gap-2.5 sm:gap-5" dir="ltr">
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
              پنل کاربری
            </Link>
          </div>
        </div>
      </section>
      <section className="sm:hidden">
        <SearchBar
          className="px-5 pb-2.5"
          isMobile={true}
          products={products}
        />
      </section>
      <motion.section
        className="py-3.5 px-10 overflow-hidden hidden sm:block"
        initial={false}
        animate={{
          height: isTop ? 56 : 0,
          padding: isTop ? "14px 40px" : "0 40px",
        }}
      >
        <div>
          <nav className="flex gap-8">
            <h4 className="text-lg font-bold text-[#223c78]">
              دسته بندی محصولات
            </h4>
            {categories.map((item) => (
              <Link
                key={item._id}
                href={`/category/${buildUrl(item.title)}?category=${item._id}`}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </motion.section>
    </motion.header>
  );
}
