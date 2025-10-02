"use client";

import dynamic from "next/dynamic";
import Spinner from "@/components/UI/spinner";
import { Suspense } from "react";

const Payment = dynamic(() => import("./paymentComponent"), {
  ssr: false,
  loading: () => <Spinner />,
});

export default function ManagedPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <Payment />
    </Suspense>
  );
}
