"use client";
import React, { useEffect, useReducer } from "react";

const UserContext = React.createContext();

function handleSetUser(state, action) {
  switch (action.type) {
    case "login":
      return action.user;
    case "logout":
      return {};
    default:
      return state;
  }
}

export const UserProvider = ({ children }) => {
  const [logedUser, dispacth] = useReducer(handleSetUser, {});

  //   useEffect(() => {
  //   },[])

  function login(user) {
    dispacth({ type: "login", user: user });
    localStorage.setItem("userId", user.id);
  }

  function logout() {
    dispacth({ type: "logout" });
    localStorage.removeItem("userId");
  }

  return (
    <UserContext.Provider value={{ logedUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
