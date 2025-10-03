"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Spinner from "../UI/spinner";

export default function HandleLinkSpinner() {
  const [isLoad, setIsLoad] = useState(false);
  const path = usePathname();

  useEffect(() => {
    if (typeof window == "undefined") return;

    function showSpinner(e) {
      const link = e.target.closest("a");
      if (!link) return;
      if (link.getAttribute("target") == "_blank") return;
      const url = new URL(link.href, window.location.origin);
      if (url.pathname != window.location.pathname) {
        setIsLoad(true);
      }
    }

    document.querySelector("body").addEventListener("click", showSpinner);

    return () => {
      document.querySelector("body").removeEventListener("click", showSpinner);
    };
  }, []);

  useEffect(() => {
    setIsLoad(false);
  }, [path]);

  if (isLoad) return <Spinner isMain={true} />;
  return null;
}
