"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Spinner from "../UI/spinner";
import { Btn } from "../UI/btn";
import buildUrl from "@/functions/buildUrl";
import handleStars from "@/functions/handleStars";

export default function DashComments() {
  const [comments, setComments] = useState([]);
  const [more, setMore] = useState("");
  const [isLoad, setIsLoad] = useState(false);
  const div = useRef(null);
  const [height, setHeight] = useState(0);

  function getData() {
    setIsLoad(true);
    fetch("/api/get-data/comments")
      .then(async (e) => {
        let data = await e.json();
        if (!e.ok) {
          throw new Error(data.message);
        }
        return data;
      })
      .then((e) => {
        setComments(e);
        setIsLoad(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoad(false);
        alert("مشکلی پیش آمده دوباره سعی کنید.");
      });
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (div.current) {
      setHeight(div.current.offsetHeight);
    }
  }, [more]);

  function handleApi(id, method) {
    setIsLoad(true);
    fetch("/api/comment", {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
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
        setIsLoad(false);
        console.error(err);
        alert("مشکلی پیش آمده دوباره سعی کنید.");
      });
  }

  return (
    <section>
      {isLoad && <Spinner />}
      {comments.map((e) => (
        <motion.div
          layout
          key={e._id}
          className="my-5 bg-gray-200 p-2.5 rounded-xl"
          onClick={() => {
            if (more == e._id) {
              setMore("");
            } else {
              setMore(e._id);
            }
          }}
        >
          <div className="flex justify-between gap-10 items-center cursor-pointer">
            <div>
              <h3 className="font-bold text-xl mb-2 line-clamp-1">
                {e.comment}
              </h3>
              {handleStars(e.score)}
            </div>
            <div className="flex gap-2.5">
              {!e.isConfirm && (
                <Btn
                  onClick={() => {
                    handleApi(e._id, "PUT");
                  }}
                >
                  تایید
                </Btn>
              )}
              <Btn
                color="red"
                onClick={() => {
                  handleApi(e._id, "DELETE");
                }}
              >
                حذف
              </Btn>
            </div>
          </div>
          <motion.div
            initial={false}
            animate={{
              height: more == e._id ? height + 20 : 0,
            }}
            transition={{ type: "tween", duration: 0.4, ease: "linear" }}
            className="overflow-hidden"
          >
            <div ref={more == e._id ? div : null}>
              <div className="grid mt-2.5 grid-cols-4 gap-2.5 *:bg-white *:rounded-lg *:flex *:justify-center *:items-center *:p-2.5">
                <div>
                  <p>{e.userName}</p>
                </div>
                <div className="col-span-2">
                  <Link
                    href={`/product/${
                      e.productTitle ? buildUrl(e.productTitle) : null
                    }?product=${e.productId}`}
                    target="_blank"
                    className="line-clamp-1"
                  >
                    {e.productTitle}
                  </Link>
                </div>
                <div>
                  <p>{new Date(e.createdAt).toLocaleString("fa-IR")}</p>
                </div>
              </div>
              <div className="bg-white mt-2.5 rounded-lg p-2.5">
                <p>{e.comment}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </section>
  );
}
