"use client";

import dynamic from "next/dynamic";
import Spinner from "@/components/UI/spinner";

const DashPage = dynamic(() => import("./manageDah"), {
  ssr: false,
  loading: () => <Spinner />,
});

export default function ManagedPage() {
  return <DashPage />;
}