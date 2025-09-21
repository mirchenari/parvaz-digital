"use client";

import dynamic from "next/dynamic";
import Spinner from "@/components/UI/spinner";

const DashPage = dynamic(() => import("./manageDahPage"), {
  ssr: false,
  loading: () => <Spinner />,
});

export default function Page() {
  return <DashPage />;
}
