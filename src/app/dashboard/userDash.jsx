"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserContext from "@/context/usercontext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";
import { Btn } from "@/components/UI/btn";
import Spinner from "@/components/UI/spinner";
import handleHeaderHeight from "@/functions/setHeaderHeight";

export default function UserDash() {
  const { logedUser, logout, login } = useContext(UserContext);
  const [activeOrder, setActiveOrder] = useState({});
  const [isShowEdit, setIsShowEdit] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [passValues, setPassValues] = useState({
    current: "",
    new: "",
    newRepeat: "",
  });
  const [changeMess, setChangeMess] = useState(["", ""]);
  const [isLoad, setIsLoad] = useState(false);
  const route = useRouter();
  const userProfile = [
    ["نام", "fName"],
    ["نام خانوادگی", "lName"],
    ["ایمیل", "email"],
    ["کدپستی", "post"],
    ["آدرس", "address"],
  ];

  useEffect(() => {
    handleHeaderHeight(setHeaderHeight);
  }, []);

  useEffect(() => {
    if (logedUser) {
      if (logedUser.activeOrder) {
        fetch(`/api/get-data/orders/${logedUser.activeOrder}`)
          .then(async (e) => {
            let data = await e.json();
            if (!e.ok) {
              throw new Error(data.message);
            }
            return data;
          })
          .then((e) => {
            setActiveOrder(e);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  }, [logedUser]);

  function EditProfile() {
    const [values, setValues] = useState({ ...logedUser });
    const [err, setErr] = useState("");

    function handleChange(value, prop) {
      let newValues = { ...values };
      newValues[prop] = value;
      setValues(newValues);
    }

    function handleFetchChange() {
      setErr("");
      if (Object.values(values).some((item) => item == "")) {
        setErr("لطفا همه مقادیر خواسته شده را وارد کنید.");
      } else if (values.post.length != 10) {
        setErr("کد پستی وارد شده نامعتبر است.");
      } else {
        setErr("");
        setIsLoad(true);
        fetch("/api/user/edit", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: logedUser.id, ...values }),
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
            login(e.user);
            setIsShowEdit(false);
          })
          .catch((err) => {
            setIsLoad(false);
            setErr(err);
            console.error(err);
          });
      }
    }

    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex justify-center items-center bg-black/30 z-40"
      >
        <div className="bg-white p-5 w-[90%] sm:max-w-[50%] rounded-2xl">
          <div className="flex justify-between pb-5 mb-2.5 border-b-2 border-gray-300">
            <p className="font-bold text-lg">ویرایش اطلاعات کاربری</p>
            <button
              onClick={() => {
                setIsShowEdit(false);
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleFetchChange();
            }}
          >
            <div className="mb-2.5 text-center font-bold">
              {err && <p className="text-red-500">{err}</p>}
            </div>
            <div className="flex flex-col gap-5 *:*:border-2 *:*:border-gray-400 *:*:rounded-sm *:*:p-2 *:*:w-full">
              <div>
                <input
                  type="text"
                  placeholder="نام خود را وارد کنید."
                  value={values.fName}
                  onChange={(e) => {
                    handleChange(e.target.value, "fName");
                  }}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="نام خانوادگی خود را وارد کنید."
                  value={values.lName}
                  onChange={(e) => {
                    handleChange(e.target.value, "lName");
                  }}
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="کدپستی خود را وارد کنید."
                  value={values.post}
                  onChange={(e) => {
                    handleChange(e.target.value, "post");
                  }}
                />
              </div>
              <div>
                <textarea
                  placeholder="آدرس خود را وارد کنید."
                  value={values.address}
                  onChange={(e) => {
                    handleChange(e.target.value, "address");
                  }}
                ></textarea>
              </div>
            </div>
            <div className="mt-2.5 flex justify-center">
              <Btn>ویرایش اطلاعات</Btn>
            </div>
          </form>
        </div>
      </motion.section>
    );
  }

  function handleChangePass() {
    if (Object.values(passValues).some((item) => item == "")) {
      setChangeMess(["لطفا همه مقادیر خواسته شده را وارد کنید.", "red"]);
    } else if (passValues.new.trim() !== passValues.newRepeat.trim()) {
      setChangeMess(["رمز عبور جدید و تکرار آن یکسان نیست.", "red"]);
    } else {
      setChangeMess(["", ""]);
      setIsLoad(true);
      fetch("/api/user/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: logedUser.id,
          currentPass: passValues.current,
          newPass: passValues.new,
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
          setChangeMess([e.message, "green"]);
          setIsLoad(false);
        })
        .catch((err) => {
          console.error(err);
          setChangeMess([err.message, "red"]);
          setIsLoad(false);
        });
    }
  }

  return (
    <>
      <AnimatePresence>{isShowEdit && <EditProfile />}</AnimatePresence>
      {isLoad && (
        <div className="fixed inset-0 z-40">
          <Spinner />
        </div>
      )}
      <section className="flex flex-col sm:grid grid-cols-3 gap-10 px-5 sm:px-10 py-5">
        <div className="col-span-2 flex flex-col gap-10">
          <div>
            <div className="px-2.5 mb-2.5">
              <p className="text-lg font-bold">اطلاعات شخصی</p>
            </div>
            <div className="border border-gray-300 rounded-2xl p-5 flex flex-col sm:grid grid-cols-2 justify-items-center gap-5 text-center">
              {userProfile.map((item, index) => (
                <div
                  key={index}
                  style={
                    item[1] == "address"
                      ? {
                          gridColumn: "span 2",
                        }
                      : null
                  }
                >
                  <p className="text-gray-500 mb-1.5 text-lg">{item[0]}</p>
                  <p>{logedUser[item[1]]}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-lg font-bold px-2.5 mb-2.5">
              <p>تغییر رمز عبور</p>
            </div>
            <div className="border border-gray-300 rounded-2xl p-5">
              {changeMess[0] && (
                <div className="mb-2.5 text-center font-bold">
                  <p style={{ color: changeMess[1] }}>{changeMess[0]}</p>
                </div>
              )}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleChangePass();
                }}
              >
                <div className="*:*:border-2 *:*:border-gray-400 *:*:rounded-sm *:*:p-2 *:*:w-full">
                  <div className="mb-5">
                    <input
                      type="password"
                      placeholder="رمز عبور فعلی خود را وارد کنید."
                      value={passValues.current}
                      onChange={(e) => {
                        setPassValues((prev) => ({
                          ...prev,
                          current: e.target.value,
                        }));
                      }}
                    />
                  </div>
                  <div className="flex gap-2.5 mb-5">
                    <input
                      type="password"
                      placeholder="رمز عبور جدید را وارد کنید."
                      value={passValues.new}
                      onChange={(e) => {
                        setPassValues((prev) => ({
                          ...prev,
                          new: e.target.value,
                        }));
                      }}
                    />
                    <input
                      type="password"
                      placeholder="تکرار رمز عبور جدید را وارد کنید."
                      value={passValues.newRepeat}
                      onChange={(e) => {
                        setPassValues((prev) => ({
                          ...prev,
                          newRepeat: e.target.value,
                        }));
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-center">
                  <Btn>تغییر رمز عبور</Btn>
                </div>
              </form>
            </div>
          </div>
          <div className="flex justify-evenly mb-5">
            <Btn
              onClick={() => {
                setIsShowEdit(true);
              }}
            >
              ویرایش اطلاعات شخصی
            </Btn>
            <Btn
              color="red"
              onClick={() => {
                logout();
              }}
            >
              خروج از حساب کاربری
            </Btn>
          </div>
        </div>
        <div>
          <div
            className="sticky"
            style={{
              top: `${headerHeight + 20}px`,
              transitionDuration: "0.1s",
            }}
          >
            <div className="px-2.5 mb-2.5 font-bold text-lg">
              <p>سفارش فعال</p>
            </div>
            <div className="personal-shadow p-5 rounded-2xl">
              {logedUser.activeOrder ? (
                Object.values(activeOrder).length != 0 && (
                  <>
                    <div className="*:flex *:justify-between flex flex-col gap-2.5 mb-2.5 font-bold">
                      <div>
                        <p>زمان ثبت سفارش: </p>
                        <p>
                          {new Date(activeOrder.createdAt).toLocaleString(
                            "fa-IR"
                          )}
                        </p>
                      </div>
                      <div>
                        <p>تعداد محصول: </p>
                        <p>{activeOrder.cart.length.toLocaleString("fa-IR")}</p>
                      </div>
                      <div className="text-red-500">
                        <p>وضعیت سفارش:</p>
                        <p>{activeOrder.status}</p>
                      </div>
                    </div>
                    <div className="*:w-full">
                      <Btn
                        onClick={() => {
                          route.push(`/payment?order=${logedUser.activeOrder}`);
                        }}
                      >
                        ادامه سفارش
                      </Btn>
                    </div>
                  </>
                )
              ) : (
                <>
                  <div className="mb-2.5 text-red-500 font-bold text-center">
                    <p>سفارش فعالی ندارید.</p>
                  </div>
                  <div className="*:w-full">
                    <Btn
                      onClick={() => {
                        route.push("/");
                      }}
                    >
                      خرید کنید!
                    </Btn>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
