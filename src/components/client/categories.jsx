"use client";
import { useEffect, useState } from "react";
import { Btn } from "../UI/btn";
import Spinner from "../UI/spinner";
import Confirm from "../UI/confirm";

export default function Categories() {
  const [data, setData] = useState([]);
  const [isLoad, setIsLoad] = useState(false);
  const [err, setErr] = useState({ isErr: false, errMess: "" });
  const [title, setTitle] = useState("");
  const [confirm, setConfirm] = useState({
    isShow: false,
    text: "",
    warText: "",
    onOk: null,
  });
  const [categorySelect, setCategorySelect] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  function getData() {
    setIsLoad(true);
    fetch(`/api/get-data/categories`)
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

  useEffect(getData, []);

  function handleAddCategory() {
    setIsLoad(true);
    fetch("/api/category", {
      method: "POST",
      body: JSON.stringify({ title: title.trim() }),
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
        setErr({ isErr: false, errMess: "" });
        setIsLoad(false);
        getData();
        setTitle("");
      })
      .catch((err) => {
        setIsLoad(false);
        setErr({ isErr: true, errMess: err.message });
        console.error(err);
      });
  }

  function handleDel(id) {
    setIsLoad(true);
    fetch("/api/category", {
      method: "DELETE",
      body: JSON.stringify({ id: id }),
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
        setConfirm({ isShow: false });
        getData();
      })
      .catch((err) => {
        setIsLoad(false);
        setConfirm({ isShow: false });
        setErr({ isErr: true, errMess: err.message });
        console.error(err);
      });
  }

  function handleEdit(id) {
    setIsLoad(true);
    fetch("/api/category", {
      method: "PUT",
      body: JSON.stringify({ id: id, title: title.trim() }),
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
        setIsEdit(false);
        setConfirm({ isShow: false });
        getData();
        setTitle("");
      })
      .catch((err) => {
        setIsLoad(false);
        setConfirm({ isShow: false });
        setErr({ isErr: true, errMess: err.message });
        console.error(err);
      });
  }

  return (
    <>
      <Confirm
        isShow={confirm.isShow}
        onCancel={() => setConfirm({ isShow: false })}
        onOk={confirm.onOk}
        text={confirm.text}
        warningTxt={confirm.warText}
      />
      <section className="flex flex-col gap-10 h-[100%] mt-10">
        {isLoad && <Spinner />}
        <div>
          <div className="flex flex-col gap-4">
            {data.map((e) => (
              <div
                key={e._id}
                className="bg-gray-200 py-1.5 px-3.5 rounded-sm flex justify-between items-center"
              >
                <h4 className="text-lg">
                  {e.title}(تعداد محصول: {e.productsNum})
                </h4>
                <div className="flex gap-2.5">
                  <Btn
                    onClick={() => {
                      setCategorySelect(e._id);
                      setIsEdit(true);
                      setTitle(e.title);
                    }}
                  >
                    ویرایش
                  </Btn>
                  <Btn
                    color="red"
                    onClick={() => {
                      setConfirm({
                        isShow: true,
                        text: "از حذف این دسته بندی مطمئن هستید؟",
                        warText:
                          "با حذف دسته بندی، تمام محصولات آن نیز حذف می شوند.",
                        onOk: () => {
                          handleDel(e._id);
                        },
                      });
                    }}
                  >
                    حذف
                  </Btn>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={`flex justify-center items-center`}>
          <form
            className="relative flex flex-col gap-5 w-[70%] bg-gray-200 p-4 rounded-lg"
            onSubmit={(e) => {
              e.preventDefault();
              if (title.trim() === "") {
                setErr({
                  isErr: true,
                  errMess: "لطفا اسم دسته بندی را وارد کنید.",
                });
              } else if (!isEdit) {
                handleAddCategory();
              } else {
                setConfirm({
                  isShow: true,
                  text: "از ویرایش دسته بندی مطمئن هستید؟",
                  onOk: () => {
                    handleEdit(categorySelect);
                  },
                });
              }
            }}
          >
            {err.isErr && (
              <p className="text-red-500 text-center">{err.errMess}</p>
            )}
            <div>
              <input
                type="text"
                placeholder={
                  isEdit
                    ? "نام جدید دسته بندی را وارد کنید."
                    : "دسته بندی جدید را وارد کنید."
                }
                className="w-[100%] p-2.5 rounded-lg bg-white"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex justify-center gap-2.5">
              <Btn>{isEdit ? "ویرایش دسته بندی" : "ثبت دسته بندی"}</Btn>
              {isEdit && (
                <Btn color="red" onClick={() => setIsEdit(false)}>
                  انصراف
                </Btn>
              )}
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
