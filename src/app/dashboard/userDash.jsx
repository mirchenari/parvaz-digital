"use client";

import { useContext } from "react";
import UserContext from "@/context/usercontext";
import { Btn } from "@/components/UI/btn";

export default function UserDash() {
  const { logedUser, logout } = useContext(UserContext);

  return (
    <div>
      <h1>{logedUser.fName + " " + logedUser.lName}</h1>
      <Btn color="red" onClick={logout}>
        خروج
      </Btn>
    </div>
  );
}
