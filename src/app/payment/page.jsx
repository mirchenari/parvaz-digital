"use client"

import dynamic from "next/dynamic";
import Spinner from "@/components/UI/spinner";

const Payment = dynamic(() => import("./paymentComponent"), {
  ssr: false,
  loading: () => <Spinner />,
});

export default function Page() {
  return <Payment />;
}
