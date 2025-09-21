"use client";

import { useEffect, useState } from "react";
import Spinner from "../UI/spinner";
import { Btn } from "../UI/btn";

export default function EditProduct({ id }) {
  const [isLoad, setIsLoad] = useState(false);
  const [categories, setCategories] = useState([]);
  const [values, setValues] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    currentImage: "",
    category: "",
  });
  const [mess, setMess] = useState({ isMess: false, messColor: "", mess: "" });
  function getData() {
    setIsLoad(true);
    fetch(`/api/get-data/products/${id}`)
      .then(async (e) => {
        let data = await e.json();
        if (!e.ok) {
          throw new Error(data.message);
        }
        return data;
      })
      .then((e) => {
        setIsLoad(false);
        let { _id, ...product } = e;
        setValues({ ...product });
      })
      .catch((err) => {
        setIsLoad(false);
        setMess({ isMess: true, messColor: "red", mess: err.message });
        console.error(err);
      });
  }

  useEffect(() => {
    console.log(id);
    getData();
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
        setMess({ isMess: true, messColor: "red", mess: err.message });
        console.log(err);
      });
  }, []);

  function handleChange(prop, value) {
    let newValues = { ...values };
    newValues[prop] = value;
    setValues(newValues);
  }

  function handleEditProduct() {
    if (Object.values(values).some((e) => e.trim() == "")) {
      setMess({
        isMess: true,
        messColor: "red",
        mess: "لطفا اطلاعات خواسته شده را وارد کنید.",
      });
    } else {
      setIsLoad(true);
      fetch("/api/product", {
        method: "PUT",
        body: JSON.stringify({ id: id, product: values }),
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
          setMess({
            isMess: true,
            mess: "محصول با موفقیت ویرایش یافت.",
            messColor: "green",
          });
          getData();
        })
        .catch((err) => {
          setIsLoad(false);
          setMess({ isMess: true, messColor: "red", mess: err.message });
          console.error(err);
        });
    }
  }

  const inputClass = "w-[100%] p-2.5 rounded-lg bg-white";
  return (
    <>
      {isLoad && <Spinner />}
      <div className="flex justify-center items-center h-[100%]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditProduct();
          }}
          className="relative flex flex-col gap-5 w-[70%] bg-gray-200 p-4 rounded-lg"
        >
          {mess.isMess && (
            <p
              className={`text-center ${
                mess.messColor == "red" ? "text-red-500" : "text-green-500"
              }`}
            >
              {mess.mess}
            </p>
          )}
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
          <div className="flex justify-center">
            <Btn>ویرایش محصول</Btn>
          </div>
        </form>
      </div>
    </>
  );
}
