"use client";
import { useContext, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import UserContext from "@/context/usercontext";
import AdminDash from "./adminDash";
import UserDash from "./userDash";

export default function Dashboard() {
  const route = useRouter();
  const { logedUser, logout } = useContext(UserContext);
  const searchParams = useSearchParams();
  const select = searchParams.get("select") || "orders";
  const editId = searchParams.get("edit-id");

  useEffect(() => {
    if (typeof logedUser === "undefined") {
      route.push("/account");
    }
  }, [logedUser]);

  if (typeof logedUser !== "undefined") {
    return logedUser.role === "admin" ? (
      <AdminDash
        logedUser={logedUser}
        logout={logout}
        select={select}
        editId={editId}
      />
    ) : (
      <UserDash logedUser={logedUser} logout={logout} select={select} />
    );
  }
}
