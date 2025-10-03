"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Spinner from "../UI/spinner";

export default function HandleLinkSpinner() {
  const [isLoad, setIsLoad] = useState(false);
  const path = usePathname();

  useEffect(() => {
    if (typeof window == "undefined") return;

    const links = document.querySelectorAll("a");

    function showSpinner(e) {
      const href = e.target.getAttribute("href");
      if (!href) return;
      const url = new URL(href, window.location.origin);
      if (url.pathname != window.location.pathname) {
        setIsLoad(true);
      }
    }

    if (links.length != 0) {
      links.forEach((link) => {
        if (link.getAttribute("target") != "_blank") {
          link.addEventListener("click", showSpinner);
        }
      });
    }

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type == "childList" && m.addedNodes.length) {
          m.addedNodes.forEach((item) => {
            if (
              item.nodeType == 1 &&
              item.matches("a") &&
              item.getAttribute("target") != "_blank"
            ) {
              item.addEventListener("click", showSpinner);
            }
          });
        }
      }
    });

    observer.observe(document.querySelector("body"), {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      links.forEach((link) => {
        link.removeEventListener("click", showSpinner);
      });
    };
  }, []);

  useEffect(() => {
    setIsLoad(false);    
  }, [path]);

  if (isLoad) return <Spinner isMain={true} />;
  return null;
}
