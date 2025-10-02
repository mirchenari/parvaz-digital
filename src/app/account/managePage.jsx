"use client";

import dynamic from "next/dynamic";
import Spinner from "@/components/UI/spinner";
import { Suspense } from "react";

const Account = dynamic(() => import("./accountComponent"), {
  ssr: false,
  loading: () => <Spinner />,
});

export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <Account />
    </Suspense>
  );
}
