"use client";

import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import UserContext from "@/context/usercontext";
import { Btn } from "@/components/UI/btn";
import Spinner from "@/components/UI/spinner";

export default function Account() {
  const [isLoad, setIsLoad] = useState(false);
  const [email, setEmail] = useState("");
  const [isErr, setIsErr] = useState(false);
  const [errMess, setErrMess] = useState("");
  const [isPass, setIsPass] = useState(false);
  const [pass, setPass] = useState("");
  const [passAgain, setPassAgain] = useState("");
  const [page, setPage] = useState("email");
  const [captchaIn, setCaptchaIn] = useState("");
  const { logedUser, login, logout } = useContext(UserContext);
  const [userValues, setUserValuse] = useState({
    fName: "",
    lName: "",
    phone: "",
    address: "",
    post: "",
  });

  const inputClass = "border border-gray-200 p-2.5 rounded-lg w-[100%]";

  useEffect(() => {
    if (Object.keys(logedUser).length != 0) {
      setPage("account");
    } else {
      setPage("email");
    }
  }, [logedUser]);

  function sendValidation() {
    if (!email) {
      setIsErr(true);
      setErrMess("لطفا ایمیل خود را وارد کنید.");
    } else if (!email.includes("@") || !email.includes(".com")) {
      setIsErr(true);
      setErrMess("ایمیل خود را به درستی وارد کنید.");
    } else {
      setIsLoad(true);
      fetch("/api/user/send-validation", {
        method: "POST",
        body: JSON.stringify({ email: email.trim() }),
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
          if (e.isDone) {
            setIsPass(true);
            setIsLoad(false);
          } else {
            setPage("validation");
            setIsLoad(false);
          }
        })
        .catch((err) => {
          setIsLoad(false);
          setIsErr(true);
          setErrMess(err.message);
        });
    }
  }

  function validation() {
    if (!captchaIn) {
      setIsErr(true);
      setErrMess("لطفا عدد را وارد کنید.");
    } else if (captchaIn.length != 6) {
      setIsErr(true);
      setErrMess("عدد را به درستی وارد کنید");
    } else {
      setIsLoad(true);
      fetch("/api/user/validation", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          captcha: captchaIn.trim(),
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
          if (e.error) {
            throw new Error(e.error);
          }
          setIsLoad(false);
          if (e.isSigned) {
            login(e.user);
            setPage("account");
          } else {
            setPage("signup");
          }
        })
        .catch((err) => {
          setIsLoad(false);
          setIsErr(true);
          setErrMess(err.message);
        });
    }
  }

  function handleChange(prop, value) {
    let newValues = { ...userValues };
    newValues[prop] = value;
    setUserValuse(newValues);
  }

  function handleSignup() {
    if (pass != passAgain) {
      setIsErr(true);
      setErrMess("تکرار رمز عبور با رمز عبور یکسان نیست.");
    } else if (
      Object.values(userValues).some((e) => e === "") ||
      pass.trim() === ""
    ) {
      setIsErr(true);
      setErrMess("اطلاعات خواسته شده را وارد کنید.");
    } else {
      setIsLoad(true);
      fetch("/api/user/signup", {
        method: "POST",
        body: JSON.stringify({ email: email, ...userValues, password: pass }),
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
          setPage("account");
          login(e);
        })
        .catch((err) => {
          setIsLoad(false);
          console.error(err);
          setIsErr(true);
          setErrMess(err.message);
        });
    }
  }

  function handleLogin() {
    if (pass.trim() == "") {
      setIsErr(true);
      setErrMess("رمز عبور را وارد کنید.");
    } else {
      setIsLoad(true);
      fetch("/api/user/signin", {
        method: "POST",
        body: JSON.stringify({ email: email, password: pass }),
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
          setPage("account");
          login(e);
        })
        .catch((err) => {
          setIsLoad(false);
          setIsErr(true);
          setErrMess(err.message);
        });
    }
  }

  return page !== "account" ? (
    <section className="bg-white fixed inset-0 z-50 grid grid-cols-4">
      <div className="flex relative justify-center">
        {isLoad && <Spinner />}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (page === "email") {
              if (!isPass) {
                sendValidation();
              } else {
                handleLogin();
              }
            } else if (page === "validation") {
              validation();
            } else if (page === "signup") {
              handleSignup();
            }
          }}
          className="flex flex-col justify-center items-center gap-10 w-[85%] *:w-[100%] *:flex *:justify-center"
        >
          <div className="flex-col text-center">
            <h1 className="font-bold text-xl">ورود | ثبت نام</h1>
            {isErr && <p className="text-red-500">{errMess}</p>}
          </div>
          <div className="flex-col gap-5">
            {page === "email" ? (
              <>
                <input
                  className={inputClass}
                  type="text"
                  placeholder="ایمیل خود را وارد کنید."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  className={inputClass + (!isPass ? " hidden" : "")}
                  type="password"
                  placeholder="رمز عبور خود را وارد کنید."
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
              </>
            ) : page === "validation" ? (
              <input
                className={inputClass}
                type="number"
                placeholder="عدد ارسال شده به ایمیل خود را وارد کیند."
                value={captchaIn}
                onChange={(e) => setCaptchaIn(e.target.value)}
              />
            ) : (
              page === "signup" && (
                <>
                  <input
                    className={inputClass}
                    type="password"
                    placeholder="رمز عبور خود را وارد کنید."
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                  />
                  <input
                    className={inputClass}
                    type="password"
                    placeholder="رمز عبور خود را دوباره وارد کنید."
                    value={passAgain}
                    onChange={(e) => setPassAgain(e.target.value)}
                  />
                  <input
                    className={inputClass}
                    type="text"
                    placeholder="نام خود را وارد کنید."
                    value={userValues.fName}
                    onChange={(e) => handleChange("fName", e.target.value)}
                  />
                  <input
                    className={inputClass}
                    type="text"
                    placeholder="نام خانوادگی خود را وارد کنید."
                    value={userValues.lName}
                    onChange={(e) => handleChange("lName", e.target.value)}
                  />
                  <input
                    className={inputClass}
                    type="number"
                    placeholder="شماره همراه خود را وارد کنید."
                    value={userValues.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                  <textarea
                    className={inputClass}
                    placeholder="آدرس خود را وارد کنید."
                    value={userValues.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                  <input
                    className={inputClass}
                    type="number"
                    placeholder="کد پستی خود را وارد کنید."
                    value={userValues.post}
                    onChange={(e) => handleChange("post", e.target.value)}
                  />
                </>
              )
            )}
          </div>
          <div>
            <Btn>ادامه</Btn>
          </div>
        </form>
      </div>
      <div className="col-span-3 relative">
        <Image src="/image/account-banner.webp" fill alt="account" />
      </div>
    </section>
  ) : (
    <section>
      <h1>
        سلام {logedUser.fName} {logedUser.lName}
      </h1>
      <Btn onClick={logout}>خروج</Btn>
    </section>
  );
}
