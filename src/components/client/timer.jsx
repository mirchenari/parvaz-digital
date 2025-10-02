"use client";

import { useEffect, useState } from "react";

export default function Timer({ inputTime }) {
  const [time, setTime] = useState(inputTime);

  useEffect(() => {
    let interval = setInterval(() => {
      setTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minute = Math.floor(time / 60)
    .toLocaleString("fa-IR")
    .padStart(2, "۰");

  const second = (time % 60).toLocaleString("fa-IR").padStart(2, "۰");

  return <p>{`${minute}:${second}`}</p>;
}
