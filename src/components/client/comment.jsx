"use client";

import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import UserContext from "@/context/usercontext";
import { Btn } from "../UI/btn";
import Spinner from "../UI/spinner";
import handleStars from "@/functions/handleStars";

function AddComment({ product, close }) {
  const [values, setValues] = useState({ comment: "", score: 0 });
  const [mess, setMess] = useState({ isMess: false, color: "red", mess: "" });
  const { logedUser } = useContext(UserContext);
  const [isLoad, setIsLoad] = useState(false);

  function handleScore(score) {
    setValues((prev) => ({ ...prev, score: score }));
  }

  function handleAdd() {
    if (values.comment.trim() == "") {
      setMess({
        isMess: true,
        color: "red",
        mess: "لطفا نظر خود را وارد کنید.",
      });
    } else if (values.score == 0) {
      setMess({
        isMess: true,
        color: "red",
        mess: "لطفا امتیاز خود را انتخاب کنید.",
      });
    } else {
      setMess({ isMess: false, color: "", mess: "" });
      setIsLoad(true);
      fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          productTitle: product.title,
          productId: product._id,
          userName:
            typeof logedUser === "undefined"
              ? "کاربر ناشناس"
              : `${logedUser.fName} ${logedUser.lName}`,
        }),
      })
        .then(async (e) => {
          let data = await e.json();
          if (!e.ok) {
            throw new Error(data.message);
          }
          return data;
        })
        .then((e) => {
          setValues({ comment: "", score: 0 });
          setMess({
            isMess: true,
            color: "green",
            mess: "نظر شما با موفقیت افزوده شد، بعد از بررسی و تایید، نظر شما نمایش داده می شود.",
          });
          setIsLoad(false);
        })
        .catch((err) => {
          setMess({
            isMess: true,
            color: "red",
            mess: err.message,
          });
          setIsLoad(false);
          console.error(err);
        });
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"
    >
      <div className="bg-white p-5 max-w-[95%] xl:max-w-[30%] rounded-xl flex flex-col gap-7 relative overflow-hidden">
        {isLoad && <Spinner />}
        <div className="flex justify-between items-center pb-5 border-b-2 border-b-gray-300">
          <div>
            <h3>افزودن نظر</h3>
          </div>
          <div>
            <button onClick={close}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        </div>
        {mess.isMess && (
          <div>
            <p
              className={`text-center ${
                mess.color === "red" ? "text-red-500" : "text-green-500"
              }`}
            >
              {mess.mess}
            </p>
          </div>
        )}
        <div className="flex items-center personal-shadow p-2.5 rounded-xl">
          <div>
            <img
              src={product.currentImage}
              alt={product.title}
              className="min-w-[61px] max-w-[61px]"
            />
          </div>
          <div>
            <p className="text-sm font-semibold">{product.title}</p>
          </div>
        </div>
        <div className="text-center">
          <div className="mb-2.5">
            <h4>به این کالا امیتاز دهید.</h4>
          </div>
          <div className="flex justify-evenly *:cursor-pointer" id="score">
            <Image
              src={`/image/static_${
                values.score == 5 ? "c" : ""
              }excellent.webp`}
              alt="excellent"
              height={87}
              width={62}
              onClick={() => handleScore(5)}
            />
            <Image
              src={`/image/static_${values.score == 4 ? "c" : ""}good.webp`}
              alt="good"
              height={87}
              width={62}
              onClick={() => handleScore(4)}
            />
            <Image
              src={`/image/static_${values.score == 3 ? "c" : ""}medium.webp`}
              alt="medium"
              height={87}
              width={62}
              onClick={() => handleScore(3)}
            />
            <Image
              src={`/image/static_${values.score == 2 ? "c" : ""}weak.webp`}
              alt="weak"
              height={87}
              width={62}
              onClick={() => handleScore(2)}
            />
            <Image
              src={`/image/static_${values.score == 1 ? "c" : ""}bad.webp`}
              alt="bad"
              height={87}
              width={62}
              onClick={() => handleScore(1)}
            />
          </div>
        </div>
        <div>
          <form
            className="flex flex-col gap-2.5"
            onSubmit={(e) => {
              e.preventDefault();
              handleAdd();
            }}
          >
            <div>
              <textarea
                placeholder="نظر خود را وارد کنید."
                className="border-2 border-gray-300 rounded-lg p-2.5 w-full"
                value={values.comment}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, comment: e.target.value }))
                }
              ></textarea>
            </div>
            <div className="*:w-full">
              <Btn>ثبت نظر</Btn>
            </div>
          </form>
        </div>
      </div>
    </motion.section>
  );
}

export default function Comment({ product }) {
  const [comments, setComments] = useState([]);
  const [isLoad, setIsLoad] = useState(false);
  const [isShowAddBox, setIsShowAddBox] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  function getData() {
    setIsLoad(true);
    fetch(`/api/get-data/comments/${product._id}`)
      .then(async (e) => {
        let data = await e.json();
        if (!e.ok) {
          throw new Error(data.message);
        }
        return data;
      })
      .then((e) => {
        let reverseE = [...e].reverse();
        setComments(reverseE);
        setIsLoad(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoad(false);
      });
  }

  useEffect(() => {
    getData();
    const header = document.querySelector("header");
    if (header) {
      const updateHeight = (height) => {
        setHeaderHeight(height);
      };

      updateHeight(header.offsetHeight);

      const observer = new ResizeObserver((items) => {
        items.forEach((item) => {
          updateHeight(item.contentRect.height);
        });
      });

      observer.observe(header);

      return () => {
        observer.unobserve(header);
        observer.disconnect();
      };
    }
  }, []);

  function getAverage(comments) {
    let total = 0;
    comments.forEach((item) => {
      total += item.score;
    });
    let average = total / comments.length;
    return Number(average.toFixed(1)).toLocaleString("fa-IR");
  }

  function handleUIAverage(comments) {
    let percent = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    comments.forEach((item) => {
      percent[item.score] += 1;
    });

    Object.values(percent).forEach((item, index) => {
      percent[index + 1] = Math.floor((item / comments.length) * 100);
    });

    return (
      <>
        {Object.keys(percent).map((item) => (
          <div className="flex gap-2.5 items-center justify-between" key={item}>
            <div className="h-3 rounded-full w-[120px] flex bg-gray-200">
              <div
                className="h-full rounded-full bg-yellow-500"
                style={{ width: percent[item] + "%" }}
              ></div>
            </div>
            <p className="text-gray-500">
              {Number(item).toLocaleString("fa-IR")}
            </p>
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      <AnimatePresence>
        {isShowAddBox && (
          <AddComment product={product} close={() => setIsShowAddBox(false)} />
        )}
      </AnimatePresence>
      <div className="flex flex-col-reverse gap-2.5 sm:grid grid-cols-3 relative mt-5">
        {isLoad && <Spinner />}
        <div className="col-span-2 p-2.5 flex flex-col gap-4">
          {!comments.some((e) => e.isConfirm) ? (
            <p>هنوز هیچ نظری برای این محصول ثبت نشده است.</p>
          ) : (
            comments.map((e) => (
              <div key={e._id} className="flex flex-col gap-4 p-2.5">
                <div className="flex justify-between gap-1.5">
                  <div>
                    <div className="flex gap-2.5 items-center mb-1.5">
                      <FontAwesomeIcon icon={faUser} />
                      <p className="font-bold text-sm">{e.userName}</p>
                    </div>
                    {handleStars(e.score)}
                  </div>
                  <div>
                    <p>
                      {new Date(e.createdAt).toLocaleDateString("fa-IR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-justify">{e.comment}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div>
          <div
            className="sticky flex flex-col gap-5"
            style={{
              top: `${headerHeight + 10}px`,
              transitionDuration: "0.1s",
            }}
          >
            {comments.length !== 0 && (
              <div className="grid grid-cols-2 items-center justify-items-center px-2.5 sm:px-0">
                <div className="flex flex-col-reverse w-full">
                  {handleUIAverage(comments)}
                </div>
                <div className="text-center">
                  <div>
                    <p className="text-[#223C78] font-bold text-3xl relative hover:*:block cursor-pointer">
                      {getAverage(comments)}
                      <span className="text-sm bg-white text-black personal-shadow p-2.5 rounded-full absolute left-0 hidden w-[150px]">
                        نمره کالا از نظر کاربران
                      </span>
                    </p>
                  </div>
                  <div>
                    <p>{comments.length.toLocaleString("fa-IR")} نظر</p>
                  </div>
                </div>
              </div>
            )}
            <div className="personal-shadow p-5 rounded-2xl flex flex-col gap-3">
              <div className="flex text-sm items-center justify-center gap-2.5">
                <FontAwesomeIcon icon={faComments} />
                <p>نظر خود را درباره این محصول بنویسید...</p>
              </div>
              <div className="*:w-[100%]">
                <Btn onClick={() => setIsShowAddBox(true)}>افزودن نظر</Btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
