"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProductRoute() {
  const route = useRouter();

  useEffect(() => {
    route.back();
  }, []);
}
