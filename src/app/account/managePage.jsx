"use client";

import dynamic from "next/dynamic";
import Spinner from "@/components/UI/spinner";

const Account = dynamic(() => import("./accountComponent"), {
  ssr: false,
  loading: () => <Spinner />,
});

export default function Page() {
  return <Account />;
}
