"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Spinner from "../UI/spinner";

export default function HandleLinkSpinner() {
  const [isLoad, setIsLoad] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const links = document.querySelectorAll("a");

    function showSpinner() {
      setIsLoad(true);
    }

    if (links.length != 0) {
      links.forEach((link) => {
        if (link.getAttribute("target") != "_blank") {
          link.addEventListener("click", showSpinner);
        }
      });
    }

    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", showSpinner);
      });
    };
  }, []);

  useEffect(() => {
    setIsLoad(false);
  }, [path]);

  if (isLoad) {
    return <Spinner />;
  }
}
