"use client";

import { Btn } from "@/components/UI/btn";
import Spinner from "@/components/UI/spinner";
import getProductsData from "@/functions/getProducts";
import getTotalPrice from "@/functions/getTotalPrice";
import handleHeaderHeight from "@/functions/setHeaderHeight";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentPage() {
  const [order, setOrder] = useState({});
  const [products, setProducts] = useState([]);
  const [headerHeight, setHeaderHeight] = useState(0);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  useEffect(() => {
    handleHeaderHeight(setHeaderHeight);
  }, []);

  useEffect(() => {
    fetch(`/api/get-data/orders/${orderId}`)
      .then(async (e) => {
        let data = await e.json();
        if (!e.ok) {
          throw new Error(data.message);
        }
        return data;
      })
      .then((e) => {
        setOrder(e);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [orderId]);

  useEffect(() => {
    if (Object.values(order).length != 0) {
      getProductsData(setProducts, order.cart);
    }
  }, [order]);

  if (Object.values(order).length == 0 || products.length == 0) {
    return <Spinner />;
  } else {
    return (
      <section className="px-5 sm:px-10 my-5 flex flex-col-reverse sm:grid grid-cols-3 gap-10">
        <div className="col-span-2 flex flex-col gap-5">
          <div className="flex flex-col gap-2.5">
            <div className="px-2.5 flex justify-between">
              <p className="font-bold">سفارش در یک نگاه</p>
              <Link href="/shipment" className="text-[#223c78]">
                بازگشت به انتخاب آدرس
              </Link>
            </div>
            <div className="border border-gray-300 rounded-xl p-5">
              <div className="pb-5 font-bold border-b-2 border-gray-300 text-center">
                <p>
                  مجموع مبلغ محصولات: <br className="sm:hidden" />
                  {getTotalPrice(order.cart, products)}
                </p>
              </div>
              <div className="pt-5 grid grid-cols-4 gap-5">
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
                        {order.cart
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
            <div className="text-blue-500 mb-2.5">
              <p>ثبت کد تخفیف</p>
            </div>
            <div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <input
                  className="w-[50%] border border-gray-300 ml-5 px-1.5 py-2.5 rounded-sm"
                  type="text"
                  placeholder="کد مورد نظر را وارد کنید."
                />
                <input
                  className="border p-2.5 rounded-sm cursor-pointer"
                  type="submit"
                  value="ثبت کد"
                />
              </form>
            </div>
          </div>
        </div>
        <div>
          <div
            className="flex flex-col gap-4 sticky"
            style={{
              top: `${headerHeight + 20}px`,
              transitionDuration: "0.1s",
            }}
          >
            <div className="px-2.5 text-lg font-bold ">
              <p>صورتحساب</p>
            </div>
            <div className="personal-shadow p-5 rounded-2xl flex flex-col gap-5 font-bold">
              <div className="*:flex *:justify-between flex flex-col gap-5 text-sm">
                <div>
                  <p>قیمت محصولات</p>
                  <p>{getTotalPrice(order.cart, products)}</p>
                </div>
                <div>
                  <p>هزینه بسته بندی و ارسال</p>
                  <p>{(89_000).toLocaleString("fa-IR") + " تومان"}</p>
                </div>
                <div className="text-red-500">
                  <p>تخفیف محصولات</p>
                  <p>{(0).toLocaleString("fa-IR")}</p>
                </div>
              </div>
              <div className="flex justify-between py-5 border-t border-t-gray-300">
                <p>مبلغ قابل پرداخت</p>
                <p>{getTotalPrice(order.cart, products, 0, 89_000)}</p>
              </div>
              <div className="*:w-full">
                <Btn>پرداخت</Btn>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
