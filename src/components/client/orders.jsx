"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Spinner from "../UI/spinner";

export default function Orders() {
  const [order, setOrder] = useState([]);
  const [products, setProdunct] = useState([]);
  const [isLoad, setIsLoad] = useState(false);
  const [more, setMore] = useState("");
  const div = useRef(null);
  const [height, setHeight] = useState(0);

  function getOrders() {
    setIsLoad(true);
    fetch("/api/get-data/orders")
      .then(async (e) => {
        let data = await e.json();
        if (!e.ok) {
          throw new Error(data.message);
        }
        return data;
      })
      .then((e) => {
        setOrder([...e].reverse());
        setIsLoad(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoad(false);
      });
  }

  function getProducts() {
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
        setIsLoad(false);
        setProdunct(e);
      })
      .catch((err) => {
        setIsLoad(false);
        console.error(err);
      });
  }

  useEffect(() => {
    getOrders();
    getProducts();
  }, []);

  useEffect(() => {
    if (div.current) {
      setHeight(div.current.offsetHeight);
    }
  }, [more]);

  return (
    <section>
      {isLoad && <Spinner />}
      {order.map((item) => (
        <motion.div
          layout
          key={item._id}
          className="cursor-pointer bg-gray-200 p-2.5 rounded-lg my-5"
          onClick={() => {
            if (more == item._id) {
              setMore("");
            } else {
              setMore(item._id);
            }
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-bold mb-2.5">{item.receiverName}</p>
              <p>{item.address}</p>
            </div>
            <div>
              <p className="font-bold text-red-500"> {item.status}</p>
            </div>
          </div>
          <motion.div
            initial={false}
            animate={{
              height: more == item._id ? height + 20 : 0,
            }}
            transition={{ type: "tween", duration: 0.4, ease: "linear" }}
            className="overflow-hidden"
          >
            <div
              ref={more == item._id ? div : null}
              className="*:*:bg-white *:*:rounded-lg *:*:p-2.5 text-center"
            >
              <div className="flex flex-col sm:flex-row gap-2.5 my-2.5">
                <div className="flex-1">
                  <p>{item.receiverEmail}</p>
                </div>
                <div className="flex-1">
                  <p>{new Date(item.createdAt).toLocaleString("fa-IR")}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                {products.length != 0 &&
                  item.cart.map((product) => (
                    <div className="flex flex-col sm:flex-row sm:justify-between" key={product.id}>
                      <p>{products.find((p) => p._id == product.id).title}</p>
                      <p>{product.num.toLocaleString("fa-IR") + " عدد"}</p>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </section>
  );
}
