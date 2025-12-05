"useclient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Spinner from "@/components/UI/spinner";
import AddProduct from "@/components/client/addProduct";
import Categories from "@/components/client/categories";
import DashProducts from "@/components/client/dashProducts";
import EditProduct from "@/components/client/editProduct";
import { Btn } from "@/components/UI/btn";
import DashComments from "@/components/client/dashComments";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import Orders from "@/components/client/orders";

export default function AdminDash({ logout, select, editId }) {
  const [isLoad, setIsLoad] = useState(false);
  const [data, setData] = useState([]);
  const [isShowSideBar, setIsShowSideBar] = useState(true);
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

  function SideBar({ isMobile }) {
    function closeSideBar() {
      setIsShowSideBar(false);
    }
    return (
      <>
        <div>
          <nav className="flex flex-col gap-5 *:text-lg">
            <div className="flex justify-between">
              <h1 className="text-center font-bold sm:!text-2xl">
                داشبورد مدیریت پرواز دیجیتال
              </h1>
              <button className="sm:hidden" onClick={closeSideBar}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <Link
              href="/dashboard?select=orders"
              onClick={isMobile ? closeSideBar : null}
            >
              سفارشات
            </Link>
            <Link
              href="/dashboard?select=products"
              onClick={isMobile ? closeSideBar : null}
            >
              محصولات
            </Link>
            <Link
              href="/dashboard?select=categories"
              onClick={isMobile ? closeSideBar : null}
            >
              دسته بندی ها
            </Link>
            <Link
              href="/dashboard?select=addProduct"
              onClick={isMobile ? closeSideBar : null}
            >
              افزودن محصول
            </Link>
            <Link
              href="/dashboard?select=comments"
              onClick={isMobile ? closeSideBar : null}
            >
              نظرات
            </Link>
          </nav>
        </div>
        <div className="flex justify-evenly">
          <Btn onClick={() => route.push("/")}>صفحه اصلی</Btn>
          <Btn
            color="red"
            onClick={() => {
              logout();
            }}
          >
            خروج
          </Btn>
        </div>
      </>
    );
  }

  return (
    <section className="bg-white fixed inset-0 z-50 sm:grid grid-cols-4 overflow-auto">
      <AnimatePresence>
        {isShowSideBar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 sm:static sm:hidden"
          >
            <motion.div
              initial={{ translateX: 200 }}
              animate={{ translateX: 0 }}
              exit={{ translateX: 200 }}
              className="bg-gray-200 p-5 flex flex-col justify-between h-full w-[80%]"
            >
              <SideBar isMobile={true} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="hidden sm:flex bg-gray-200 p-5 flex-col justify-between">
        <SideBar />
      </div>
      <div className="col-span-3 flex flex-col p-5 relative min-h-0">
        <div className="border-b pb-5 text-center shrink-0 relative">
          <button
            className="sm:hidden absolute right-0 top-2 text-lg"
            onClick={() => {
              setIsShowSideBar(true);
            }}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <h1 className="text-3xl font-bold ">{persianSelect[select]}</h1>
        </div>
        <div className="flex-1 overflow-auto">
          {isLoad && <Spinner />}
          {select == "addProduct" ? (
            <AddProduct />
          ) : select == "editProduct" ? (
            <EditProduct id={editId} />
          ) : data.length == 0 ? (
            <h2>هیچ چیزی وجود ندارد...</h2>
          ) : select == "categories" ? (
            <Categories />
          ) : select == "comments" ? (
            <DashComments />
          ) : select == "orders" ? (
            <Orders />
          ) : (
            select == "products" && <DashProducts />
          )}
        </div>
      </div>
    </section>
  );
}
