"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CartContext from "@/context/cartcontext";
import UserContext from "@/context/usercontext";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Btn } from "@/components/UI/btn";
import buildUrl from "@/functions/buildUrl";
import getProductsData from "@/functions/getProducts";
import getTotalPrice from "@/functions/getTotalPrice";
import handleHeaderHeight from "@/functions/setHeaderHeight";

export default function CartPage() {
  const { cart, addToCart, removeFromCart, removeAll, getTotalNum } =
    useContext(CartContext);
  const { logedUser } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState("");
  const [headerHeight, setHeaderHeight] = useState(0);
  const route = useRouter();

  useEffect(() => {
    handleHeaderHeight(setHeaderHeight);
  }, []);

  useEffect(() => {
    if (products.length == 0) {
      getProductsData(setProducts, cart);
    }
  }, [cart]);

  useEffect(() => {
    if (products.length != 0) {
      setTotal(getTotalPrice(cart, products));
    }
  }, [cart, products]);

  function handleShopping() {
    if (!logedUser) {
      route.push("/account?backTo=shipment");
    } else {
      route.push("/shipment");
    }
  }

  return (
    <>
      <section className="px-7 sm:px-12 py-2.5 flex justify-between">
        <div className="flex gap-2.5 items-center">
          <h1 className="font-bold sm:text-xl text-lg">سبد خرید</h1>
          {cart.length != 0 && (
            <p className="sm:text-sm text-xs">
              <span className="font-bold">{getTotalNum()} </span>
              <span>عدد کالا</span>
            </p>
          )}
        </div>
        <div className="sm:hidden">
          {cart.length != 0 && (
            <button
              className="text-xs"
              onClick={() => {
                removeAll(logedUser ? logedUser.id : null);
              }}
            >
              <span>حذف کل سبد خرید </span>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
        </div>
      </section>
      {cart.length == 0 ? (
        <section className="px-5 sm:px-10 mb-25">
          <div className="border-2 border-gray-300 rounded-xl flex flex-col items-center gap-5 py-5">
            <div>
              <Image
                alt="Your cart is empty"
                src="/image/empty-cart.webp"
                width={300}
                height={300}
              />
            </div>
            <div>
              <h2 className="font-bold text-2xl">سبد خرید شما خالیه!</h2>
            </div>
          </div>
        </section>
      ) : (
        products.length != 0 && (
          <section className="flex flex-col sm:grid grid-cols-4 gap-5 sm:mb-0 px-5 sm:px-10 pb-2.5">
            <div className="col-span-3 flex flex-col gap-5 sm:gap-10">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-2xl p-8 grid sm:grid-cols-4 grid-cols-3 gap-5 *:w-full relative pb-[150px] sm:pb-5"
                >
                  <div className="sm:col-span-3 col-span-2 flex flex-col justify-between">
                    <div>
                      <Link
                        className="sm:text-lg font-bold"
                        href={`/product/${buildUrl(
                          products.find((product) => product._id == item.id)
                            .title
                        )}?product=${
                          products.find((product) => product._id == item.id)._id
                        }`}
                        target="_blank"
                      >
                        {
                          products.find((product) => product._id == item.id)
                            .title
                        }
                      </Link>
                    </div>
                    <div
                      className="sm:grid grid-cols-3 justify-items-center flex flex-col gap-2.5 items-center border
                     border-gray-200 rounded-lg py-5 sm:py-10 absolute right-5 left-5 bottom-5 sm:static"
                    >
                      <div className="col-span-2">
                        <p className="font-bold">
                          {(
                            products.find((product) => product._id == item.id)
                              .price * item.num
                          ).toLocaleString("fa-IR") + " تومان"}
                        </p>
                      </div>
                      <div className="flex justify-center gap-5 sm:justify-evenly items-center w-full">
                        <div>
                          <button
                            className="personal-shadow2 sm:rounded-lg flex justify-center items-center w-[30px] h-[30px] rounded-lg text-xs sm:text-base sm:w-[36px] sm:h-[36px]"
                            style={
                              item.num ==
                              products.find((product) => product._id == item.id)
                                .stock
                                ? { opacity: 0.5, cursor: "auto" }
                                : null
                            }
                            onClick={() => {
                              if (
                                !(
                                  item.num ==
                                  products.find(
                                    (product) => product._id == item.id
                                  ).stock
                                )
                              ) {
                                addToCart(item.id);
                              }
                            }}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                        </div>
                        <div className="text-center">
                          <p className="sm:text-lg">
                            {item.num.toLocaleString("fa-IR")}
                          </p>
                          <p className="text-sm text-gray-500 font-bold">
                            تعداد در انبار:
                            {Number(
                              products.find((product) => product._id == item.id)
                                .stock
                            ).toLocaleString("fa-IR")}
                          </p>
                        </div>
                        <div>
                          <button
                            className="personal-shadow2 sm:rounded-lg flex justify-center items-center w-[30px] h-[30px] rounded-lg text-xs sm:text-base sm:w-[36px] sm:h-[36px]"
                            onClick={() => {
                              removeFromCart(
                                item.id,
                                logedUser ? logedUser.id : null
                              );
                            }}
                          >
                            {item.num == 1 ? (
                              <FontAwesomeIcon icon={faTrash} />
                            ) : (
                              <FontAwesomeIcon icon={faMinus} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <img
                      className="max-h-[206px]"
                      src={
                        products.find((product) => product._id == item.id)
                          .currentImage
                      }
                      alt={
                        products.find((product) => product._id == item.id).title
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden sm:block">
              <div
                className="sticky"
                style={{
                  top: `${headerHeight + 20}px`,
                  transitionDuration: "0.1s",
                }}
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold text-lg">صورتحساب</h3>
                  </div>
                  <div>
                    <button
                      className="text-sm"
                      onClick={() => {
                        removeAll(logedUser ? logedUser.id : null);
                      }}
                    >
                      <span>حذف کل سبد خرید </span>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
                <div className="personal-shadow p-2.5 flex flex-col gap-2.5 rounded-xl mt-2.5">
                  <div className="flex justify-between font-bold">
                    <div>
                      <p>جمع کل</p>
                    </div>
                    <div>
                      <p>{total}</p>
                    </div>
                  </div>
                  <div className="*:w-full">
                    <Btn onClick={handleShopping}>ادامه خرید</Btn>
                  </div>
                </div>
              </div>
            </div>
            <div className="sm:hidden *:w-full">
              <Btn onClick={handleShopping}>{`ادامه خرید | ${total}`}</Btn>
            </div>
          </section>
        )
      )}
    </>
  );
}
