"use client";

import { useContext, useEffect, useState } from "react";
import CartContext from "@/context/cartcontext";
import UserContext from "@/context/usercontext";
import { Btn } from "../UI/btn";
import { useRouter } from "next/navigation";
import handleHeaderHeight from "@/functions/setHeaderHeight";

export default function AddToCart({ product }) {
  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  const { logedUser } = useContext(UserContext);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isInCart, setIsInCart] = useState(false);
  const route = useRouter();

  useEffect(() => {
    handleHeaderHeight(setHeaderHeight);
    const footer = document.querySelector("footer");
    if (footer) {
      if (footer.offsetWidth < 640) {
        footer.style.marginBottom = "135px";
      }
    }
    return () => {
      footer.style.marginBottom = 0;
    };
  }, []);

  useEffect(() => {
    if (cart) {
      if (cart.some((item) => item.id == product._id)) {
        setIsInCart(true);
      } else {
        setIsInCart(false);
      }
    } else {
      setIsInCart(false);
    }
  }, [cart]);

  return (
    <div
      className="flex flex-col items-end gap-5 sm:rounded-2xl p-5 sticky personal-shadow"
      style={{
        top: `${headerHeight + 10}px`,
        transitionDuration: "0.1s",
      }}
    >
      <div>
        <p className="font-bold text-xl">
          {Number(product.price).toLocaleString("fa-IR") + " تومان"}
        </p>
      </div>
      <div className="w-[100%] *:w-[100%]">
        {!isInCart ? (
          <Btn
            onClick={() => {
              addToCart(product._id);
            }}
          >
            افزودن به سبد خرید
          </Btn>
        ) : (
          <div className="grid grid-cols-4">
            <button
              onClick={() => {
                removeFromCart(product._id, logedUser ? logedUser.id : null);
              }}
              className="text-[#223C78] font-bold"
            >
              حذف
            </button>
            <button
              onClick={() => {
                route.push("/cart");
              }}
              className="col-span-3 border-2 border-[#223C78] rounded-lg text-[#223C78] font-bold py-2.5"
            >
              <span>مشاهده سبد خرید</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
