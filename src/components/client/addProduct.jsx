"use client";
import { useEffect, useState } from "react";
import { Btn } from "../UI/btn";
import Spinner from "../UI/spinner";
import Link from "next/link";

export default function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [isLoad, setIsLoad] = useState(false);
  const [err, setErr] = useState({ isErr: false, errMess: "" });
  const [values, setValues] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    currentImage: "",
    category: "",
  });

  useEffect(() => {
    fetch(`/api/get-data/categories`)
      .then(async (e) => {
        let data = await e.json();
        if (!e.ok) {
          throw new Error(data.message);
        }
        return data;
      })
      .then((e) => {
        setCategories(e);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleChange(prop, value) {
    let newValues = { ...values };
    newValues[prop] = value;
    setValues(newValues);
  }

  function handleAddProduct() {
    if (Object.values(values).some((e) => e.trim() == "")) {
      setErr({
        isErr: true,
        errMess: "لطفا همه مقادیر خواسته شده را وارد کنید.",
      });
    } else {
      const { category, ...product } = values;
      setIsLoad(true);
      fetch("/api/product", {
        method: "POST",
        body: JSON.stringify({
          category: category,
          product: product,
        }),
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
          setIsLoad(false);
          setValues({
            title: "",
            description: "",
            price: "",
            stock: "",
            currentImage: "",
            category: "",
          });
          setErr({ isErr: false, errMess: "" });
          console.log(e);
        })
        .catch((err) => {
          setIsLoad(false);
          console.error(err);
          setErr({ isErr: true, errMess: err.message });
        });
    }
  }

  const inputClass = "w-[100%] p-2.5 rounded-lg bg-white";
  return (
    <div className="flex justify-center items-center h-[100%]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddProduct();
        }}
        className="relative flex flex-col gap-5 w-[70%] bg-gray-200 p-4 rounded-lg"
      >
        {isLoad && <Spinner />}
        {err.isErr && <p className="text-red-500 text-center">{err.errMess}</p>}
        <div>
          <input
            className={inputClass}
            type="text"
            placeholder="نام محصول را وارد کنید."
            value={values.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>
        <div>
          <textarea
            className={inputClass}
            placeholder="توضیحات محصول را وارد کنید."
            value={values.description}
            onChange={(e) => handleChange("description", e.target.value)}
          ></textarea>
        </div>
        <div>
          <input
            className={inputClass}
            type="number"
            placeholder="قیمت محصول را وارد کنید."
            value={values.price}
            onChange={(e) => handleChange("price", e.target.value)}
          />
        </div>
        <div>
          <input
            className={inputClass}
            type="number"
            placeholder="موجودی محصول را وارد کنید."
            value={values.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
          />
        </div>
        <div>
          <input
            className={inputClass}
            type="text"
            placeholder="آدرس عکس اصلی محصول را وارد کنید."
            value={values.currentImage}
            onChange={(e) => handleChange("currentImage", e.target.value)}
          />
        </div>
        <div>
          <select
            className={inputClass}
            value={values.category}
            onChange={(e) => handleChange("category", e.target.value)}
          >
            <option disabled value="">
              {categories.length === 0
                ? "هیچ دسته بندی ای وجود ندارد."
                : "دسته بندی محصول را انتخاب کنید."}
            </option>

            {categories.map((e) => (
              <option key={e._id} value={e.title}>
                {e.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Link href="/dashboard?select=categories">افزودن دسته بندی جدید</Link>
        </div>
        <div className="flex justify-center">
          <Btn>ثبت محصول</Btn>
        </div>
      </form>
    </div>
  );
}
