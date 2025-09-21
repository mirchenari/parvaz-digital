"useclient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "@/components/UI/spinner";
import AddProduct from "@/components/client/addProduct";
import Categories from "@/components/client/categories";
import DashProducts from "@/components/client/dashProducts";
import EditProduct from "@/components/client/editProduct";
import { Btn } from "@/components/UI/btn";
import DashComments from "@/components/client/dashComments";

export default function AdminDash({ logedUser, logout, select, editId }) {
  const [isLoad, setIsLoad] = useState(false);
  const [data, setData] = useState([]);
  const route = useRouter();

  useEffect(() => {
    if (select != "addProduct" || select != "editProduct") {
      setIsLoad(true);
      fetch(`/api/get-data/${select}`)
        .then(async (e) => {
          let data = await e.json();
          if (!e.ok) {
            throw new Error(data.message);
          }
          return data;
        })
        .then((e) => {
          setData(e);
          setIsLoad(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [select]);

  const persianSelect = {
    orders: "سفارشات",
    products: "محصولات",
    categories: "دسته بندی ها",
    addProduct: "افزودن محصول",
    editProduct: "ویرایش محصول",
    comments: "نظرات",
  };

  return (
    <section className="bg-white fixed inset-0 z-50 grid grid-cols-4">
      <div className="bg-gray-200 p-5 flex flex-col justify-between">
        <div>
          <nav className="flex flex-col gap-5 *:text-lg">
            <h1 className="text-center font-bold !text-2xl">
              داشبورد مدیریت پرواز دیجیتال
            </h1>
            <Link href="/dashboard?select=orders">سفارشات</Link>
            <Link href="/dashboard?select=products">محصولات</Link>
            <Link href="/dashboard?select=categories">دسته بندی ها</Link>
            <Link href="/dashboard?select=addProduct">افزودن محصول</Link>
            <Link href="/dashboard?select=comments">نظرات</Link>
          </nav>
        </div>
        <div className="flex justify-evenly">
          <Btn onClick={() => route.push("/")}>صفحه اصلی</Btn>
          <Btn
            color="red"
            onClick={() => {
              logout();
              route.push("/");
            }}
          >
            خروج
          </Btn>
        </div>
      </div>
      <div className="col-span-3 flex flex-col p-5 relative min-h-0">
        <div className="border-b pb-5 text-center shrink-0">
          <h1 className="text-3xl font-bold ">{persianSelect[select]}</h1>
        </div>
        <div className="flex-1 overflow-auto">
          {isLoad && <Spinner />}
          {select == "addProduct" ? (
            <AddProduct />
          ) : select == "categories" ? (
            <Categories />
          ) : select == "editProduct" ? (
            <EditProduct id={editId} />
          ) : data.length == 0 ? (
            <h2>هیچ چیزی وجود ندارد...</h2>
          ) : select == "comments" ? (
            <DashComments />
          ) : (
            select == "products" && <DashProducts />
          )}
        </div>
      </div>
    </section>
  );
}
