"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import UserContext from "@/context/usercontext";
import CartContext from "@/context/cartcontext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faPhone,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";
import { Btn } from "@/components/UI/btn";
import getProductsData from "@/functions/getProducts";
import Spinner from "@/components/UI/spinner";
import getTotalPrice from "@/functions/getTotalPrice";
import handleHeaderHeight from "@/functions/setHeaderHeight";

export default function ShipmentPage() {
  const { logedUser, setActiveOrder } = useContext(UserContext);
  const { cart, getTotalNum } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [newReceiver, setNewReceiver] = useState("");
  const [isShowEdit, setIsShowEdit] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const route = useRouter();

  useEffect(() => {
    getProductsData(setProducts, cart);
  }, [cart]);

  useEffect(() => {
    handleHeaderHeight(setHeaderHeight);
  }, []);

  useEffect(() => {
    if (logedUser) {
      if (logedUser.activeOrder) {
        setIsLoad(true);
        fetch(`/api/get-data/orders/${logedUser.activeOrder}`)
          .then(async (e) => {
            let data = await e.json();
            if (!e.ok) {
              throw new Error(data.message);
            }
            return data;
          })
          .then((e) => {
            setNewReceiver({
              name: e.receiverName,
              address: e.address,
              email: e.receiverEmail,
            });
            setIsLoad(false);
          })
          .catch((err) => {
            console.error(err);
            setIsLoad(false);
          });
      }
    }
  }, [logedUser]);

  function ChangeAddress() {
    const [isChange, setIsChange] = useState(false);
    const [values, setValues] = useState({
      newAddress: "",
      newName: "",
      newEmail: "",
    });

    function handleChange() {
      if (
        !Object.values(values).some((item) => item == "") &&
        values.newEmail.includes("@") &&
        values.newEmail.includes(".com")
      ) {
        setNewReceiver({
          name: values.newName,
          address: values.newAddress,
          email: values.newEmail,
        });
        setIsShowEdit(false);
      }
    }

    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-black/30 fixed inset-0 flex justify-center items-center z-50"
      >
        <div className="bg-white min-w-[90%] sm:min-w-[60%] p-5 rounded-2xl">
          <div className="flex justify-between items-center pb-5 border-b-2 border-b-gray-300">
            <p>آدرس تحویل</p>
            <button
              onClick={() => {
                setIsShowEdit(false);
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
          {isChange ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleChange();
              }}
            >
              <div className="my-7 *:border-2 *:border-gray-400 *:rounded-sm *:p-2 *:w-full flex flex-col gap-7">
                <textarea
                  placeholder="آدرس جدید را وارد کنید."
                  value={values.newAddress}
                  onChange={(e) => {
                    setValues((prev) => ({
                      ...prev,
                      newAddress: e.target.value,
                    }));
                  }}
                ></textarea>
                <input
                  type="text"
                  placeholder="نام گیرنده را وارد کنید."
                  value={values.newName}
                  onChange={(e) => {
                    setValues((prev) => ({ ...prev, newName: e.target.value }));
                  }}
                />
                <input
                  type="email"
                  placeholder="ایمیل گیرنده را وارد کنید."
                  value={values.newEmail}
                  onChange={(e) => {
                    setValues((prev) => ({
                      ...prev,
                      newEmail: e.target.value,
                    }));
                  }}
                />
              </div>
              <div className="flex justify-center">
                <Btn>تایید آدرس</Btn>
              </div>
            </form>
          ) : (
            <div>
              <div className="personal-shadow p-4 rounded-2xl my-7">
                <div className="*:flex *:gap-2.5 *:items-center flex flex-col gap-4">
                  <div>
                    <FontAwesomeIcon icon={faLocationDot} />
                    <p>
                      {newReceiver ? newReceiver.address : logedUser.address}
                    </p>
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faPhone} />
                    <p>{newReceiver ? newReceiver.email : logedUser.email}</p>
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faUser} />
                    <p>
                      {newReceiver
                        ? newReceiver.name
                        : logedUser.fName + " " + logedUser.lName}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <Btn
                  onClick={() => {
                    setIsChange(true);
                  }}
                >
                  تغییر آدرس
                </Btn>
              </div>
            </div>
          )}
        </div>
      </motion.section>
    );
  }

  function handleSubmitOrder() {
    const order = {
      userId: logedUser.id,
      cart: cart,
      address: newReceiver ? newReceiver.address : logedUser.address,
      receiverName: newReceiver
        ? newReceiver.name
        : logedUser.fName + " " + logedUser.lName,
      receiverEmail: newReceiver ? newReceiver.email : logedUser.email,
      updateId: logedUser.activeOrder || null,
      status: "در انتظار پرداخت",
    };

    fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    })
      .then(async (e) => {
        let data = await e.json();
        if (!e.ok) {
          throw new Error(data.message);
        }
        return data;
      })
      .then((e) => {
        setActiveOrder(e.insertedId);
        route.push(`/payment?order=${e.insertedId}`);
      })
      .catch((err) => {
        setIsLoad(false);
        console.error(err);
      });
  }

  return (
    logedUser && (
      <>
        {isLoad && <Spinner />}
        <AnimatePresence>{isShowEdit && <ChangeAddress />}</AnimatePresence>
        <section className="flex flex-col-reverse sm:grid grid-cols-3 gap-10 px-5 sm:px-20 my-5">
          <div className="col-span-2">
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between px-2.5">
                <p>آدرس تحویل</p>
                <Link href="/cart" className="text-[#223c78]">
                  بازگشت به سبد خرید
                </Link>
              </div>
              <div className="bg-[#F3F8FD] rounded-2xl p-5 flex gap-5 justify-between items-center">
                <div className="flex items-center gap-5">
                  <div className="text-[#223c78] text-3xl hidden sm:block">
                    <FontAwesomeIcon icon={faLocationDot} />
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <p className="text-gray-600">
                      {newReceiver
                        ? newReceiver.name
                        : logedUser.fName + " " + logedUser.lName}
                    </p>
                    <p className="text-justify">
                      {newReceiver ? newReceiver.address : logedUser.address}
                    </p>
                  </div>
                </div>
                <div>
                  <button
                    className="text-gray-600 font-bold text-sm"
                    onClick={() => {
                      setIsShowEdit(true);
                    }}
                  >
                    تغییر
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <div className="flex gap-2 px-5 mb-2.5">
                <p className="font-bold">سفارش شما</p>
                <p className="text-gray-500 font-bold text-sm">
                  {getTotalNum()} عدد کالا
                </p>
              </div>
              <div className="border-2 border-gray-300 rounded-2xl p-5 grid grid-cols-4 gap-5">
                {products.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col justify-evenly items-center gap-2.5 max-w-[160px]"
                  >
                    <div>
                      <img
                        src={item.currentImage}
                        alt={item.title}
                        width={120}
                        height={120}
                      />
                    </div>
                    <div className="border-2 border-gray-300 rounded-sm w-6 h-6 flex justify-center">
                      <p className="text-sm">
                        {cart
                          .find((e) => e.id == item._id)
                          .num.toLocaleString("fa-IR")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div
              className="flex flex-col gap-2.5 sticky"
              style={{
                top: `${headerHeight + 20}px`,
                transitionDuration: "0.1s",
              }}
            >
              <div className="flex justify-between px-2.5">
                <p className="font-bold">صورتحساب</p>
                <p className="text-gray-500">{getTotalNum()} عدد کالا</p>
              </div>
              <div className="personal-shadow p-2.5 rounded-xl flex flex-col gap-3">
                <div className="flex justify-between font-bold">
                  <p>مبلغ قابل پرداخت</p>
                  <p>{getTotalPrice(cart, products)}</p>
                </div>
                <div className="*:w-full">
                  <Btn
                    onClick={() => {
                      setIsLoad(true);
                      handleSubmitOrder();
                    }}
                  >
                    تایید و ادامه خرید
                  </Btn>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    )
  );
}
