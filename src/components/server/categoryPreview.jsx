"use client";

import Link from "next/link";
import { useRef } from "react";
import ProductPreview from "./ProductPreview";

export default function CategoryPreview({ category }) {
  const scroll = useRef(null);

  const exampleProduct = {
    title: "لپ تاپ ایسوس 15.6 اینچی مدل Vivobook 15 X1504VA i3 1315U 8GB",
    currentImage:
      "https://www.technolife.com/image/small_product-TLP-55931_0af36dcc-5633-43e8-bc15-3d84489379d8.png",
    price: "18،980،000",
  };

  function handleScroll(dir) {
    let scrollDiv = scroll.current;
    if (dir === "left") {
      scrollDiv.scrollBy({ left: -200, behavior: "smooth" });
    } else {
      scrollDiv.scrollBy({ left: 200, behavior: "smooth" });
    }
  }

  return (
    <section className="border-[#919EBC] border-[1px] rounded-2xl p-7 relative m-10">
      <div className="flex justify-between mb-5">
        <div>
          <h3 className="font-bold text-2xl">لپ تاپ ها در پرواز دیجیتال</h3>
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
        <ProductPreview product={exampleProduct} />
        <ProductPreview product={exampleProduct} />
        <ProductPreview product={exampleProduct} />
        <ProductPreview product={exampleProduct} />
        <ProductPreview product={exampleProduct} />
        <ProductPreview product={exampleProduct} />
        <ProductPreview product={exampleProduct} />
        <ProductPreview product={exampleProduct} />
      </div>
    </section>
  );
}
