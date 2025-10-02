"use client";
import React, { useEffect, useReducer } from "react";

const UserContext = React.createContext();

function handleSetUser(state, action) {
  switch (action.type) {
    case "login":
      return action.user;
    case "logout":
      return undefined;
    default:
      return state;
  }
}

export const UserProvider = ({ children }) => {
  const [logedUser, dispacth] = useReducer(handleSetUser);

  useEffect(() => {
    let user = localStorage.getItem("user");
    if (user) {
      dispacth({ type: "login", user: JSON.parse(user) });
    }
  }, []);

  function login(user) {
    dispacth({ type: "login", user: user });
    localStorage.setItem("user", JSON.stringify(user));
  }

  function logout() {
    dispacth({ type: "logout" });
    localStorage.removeItem("user");
  }

  function setActiveOrder(orderId) {
    let newUser = { ...logedUser };
    newUser.activeOrder = orderId;
    dispacth({ type: "login", user: newUser });
    localStorage.setItem("user", JSON.stringify(newUser));
  }

  function delActiveOrder() {
    let newUser = { ...logedUser };
    delete newUser.activeOrder;
    dispacth({ type: "login", user: newUser });
    localStorage.setItem("user", JSON.stringify(newUser));
  }

  return (
    <UserContext.Provider value={{ logedUser, login, logout, setActiveOrder, delActiveOrder }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
