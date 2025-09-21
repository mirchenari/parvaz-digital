"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ProductPreview from "./ProductPreview";
import Spinner from "../UI/spinner";

export default function CategoryPreview({ category }) {
  const [categoryId, setCategoryId] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoad, setIsLoad] = useState(true);
  const scroll = useRef(null);

  function getId() {
    fetch("/api/get-data/categories")
      .then(async (e) => {
        let data = await e.json();
        if (!e.ok) {
          throw new Error(data.message);
        }
        return data;
      })
      .then((e) => {
        let categoryArray = e.filter((item) => item.title === category);
        if (categoryArray.length > 0) {
          setCategoryId(categoryArray[0]._id);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function getData() {
    fetch("/api/get-data/products")
      .then(async (e) => {
        let data = await e.json();
        if (!e.ok) {
          throw new Error(data.message);
        }
        return data;
      })
      .then((e) => {
        let productsArray = e.filter((item) => item.categoryId == categoryId);
        setProducts(productsArray);
        setIsLoad(false);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(getId, []);

  useEffect(() => {
    if (categoryId) {
      getData();
    }
  }, [categoryId]);

  function handleScroll(dir) {
    let scrollDiv = scroll.current;
    if (dir === "left") {
      scrollDiv.scrollBy({ left: -200, behavior: "smooth" });
    } else {
      scrollDiv.scrollBy({ left: 200, behavior: "smooth" });
    }
  }

  return (
    <section className="border-[#919EBC] border-[1px] rounded-2xl p-7 relative m-10 overflow-hidden">
      {isLoad && <Spinner/>}
      <div className="flex justify-between mb-5">
        <div>
          <h3 className="font-bold text-2xl">{category} ها در پرواز دیجیتال</h3>
        </div>
        <div>
          <Link href="/" className="text-blue-500">
            نمایش همه <span>{`>`}</span>
          </Link>
        </div>
      </div>
      <div
        ref={scroll}
        className="flex overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-hide"
      >
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
          <button
            onClick={() => handleScroll("right")}
            className="bg-white text-2xl shadow flex items-center justify-center rounded-full w-10 h-10"
          >{`<`}</button>
        </div>
        <div className="absolute left-2.5 top-1/2 -translate-y-1/2">
          <button
            onClick={() => handleScroll("left")}
            className="bg-white text-2xl shadow flex items-center justify-center rounded-full w-10 h-10"
          >{`>`}</button>
        </div>
        {products.map((item) => (
          <ProductPreview key={item._id} product={item} />
        ))}
      </div>
    </section>
  );
}
