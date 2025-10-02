"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Spinner from "../UI/spinner";
import { Btn } from "../UI/btn";
import Confirm from "../UI/confirm";

export default function DashProducts() {
  const [isLoad, setIsLoad] = useState(false);
  const [products, setProducts] = useState([]);
  const [showMore, setShowMore] = useState({
    isMore: false,
    moreId: "",
  });
  const [category, setCategory] = useState("");
  const [confirm, setConfirm] = useState({
    isShow: false,
    text: "",
    onOk: null,
  });
  const route = useRouter();

  function getData() {
    setIsLoad(true);
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
        setIsLoad(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoad(false);
      });
  }

  function getCategory(id) {
    fetch(`/api/get-data/categories/${id}`)
      .then(async (e) => {
        let data = await e.json();
        if (!e.ok) {
          throw new Error(data.message);
        }
        return data;
      })
      .then((e) => {
        setCategory(e.title);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(getData, []);

  function handleDel(id) {
    setConfirm({ isShow: false });
    setIsLoad(true);
    fetch("/api/product", {
      method: "DELETE",
      body: JSON.stringify({ id: id }),
      headers: { "Content-Type": "application/json" },
    })
      .then(async (e) => {
        let data = await e.json();
        if (!e.ok) {
          throw new Error(data.message);
        }
        return data;
      })
      .then((e) => {
        getData();
        setIsLoad(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoad(false);
      });
  }

  return (
    <section className="py-5">
      <Confirm
        isShow={confirm.isShow}
        text={confirm.text}
        onOk={confirm.onOk}
        onCancel={() => setConfirm({ isShow: false })}
      />
      {isLoad && <Spinner />}
      <div className="flex flex-col gap-5">
        {products.map((e) => (
          <div
            key={e._id}
            className="cursor-pointer bg-gray-200 rounded-lg"
            onClick={() => {
              if (showMore.moreId == e._id) {
                setShowMore({ isMore: false, moreId: "" });
              } else {
                setShowMore({ isMore: true, moreId: e._id });
                getCategory(e.categoryId);
              }
            }}
          >
            <div className="flex items-center justify-between gap-5 p-2.5">
              <div className="flex flex-col gap-2.5">
                <h4 className="text-lg font-bold text-justify">{e.title}</h4>
                <p>موجودی: {e.stock}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <Btn
                  onClick={() => {
                    route.push(`/dashboard?select=editProduct&edit-id=${e._id}`);
                  }}
                >
                  ویرایش
                </Btn>
                <Btn
                  color="red"
                  onClick={() => {
                    setConfirm({
                      isShow: true,
                      text: "از حذف این محصول مطمئن هستید؟",
                      onOk: () => {
                        handleDel(e._id);
                      },
                    });
                  }}
                >
                  حذف
                </Btn>
              </div>
            </div>
            <motion.div layout>
              <motion.div
                initial={false}
                animate={{
                  height: showMore.isMore && showMore.moreId == e._id ? 270 : 0,
                }}
                transition={{ type: "tween", duration: 0.4, ease: "linear" }}
                className="overflow-hidden grid grid-cols-4 items-center px-5"
              >
                <div>
                  <div>
                    <img
                      src={e.currentImage}
                      alt={e.title}
                      className="max-h-[230px] rounded-lg"
                    />
                  </div>
                </div>
                <div className="col-span-3 mr-5 flex flex-col gap-4">
                  <div>
                    <p className="line-clamp-4">{e.description}</p>
                  </div>
                  <div>
                    <p className="font-bold">{Number(e.price).toLocaleString("fa-IR") + " تومان"}</p>
                  </div>
                  <div>
                    <p>دسته بندی: {category}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
