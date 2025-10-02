"use client";

import React, { useContext, useEffect, useReducer } from "react";
import UserContext from "./usercontext";

const CartContext = React.createContext();

function handleChangeCart(state, action) {
  switch (action.type) {
    case "add":
      return state
        ? [...state.filter((item) => item.id != action.new.id), action.new]
        : [action.new];
    case "setCart":
      return action.cart;
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispacth] = useReducer(handleChangeCart, []);
  const { logedUser, delActiveOrder } = useContext(UserContext);

  useEffect(() => {
    if (logedUser) {
      if (logedUser.activeOrder) {
        fetch(`/api/get-data/orders/${logedUser.activeOrder}`)
          .then(async (e) => {
            if (e.status != 204) {
              let data = await e.json();
              if (!e.ok) {
                throw new Error(data.message);
              }
              return data;
            }
          })
          .then((e) => {
            dispacth({ type: "setCart", cart: e.cart });
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  }, [logedUser]);

  useEffect(() => {
    if (cart.length != 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  useEffect(() => {
    let storageCart = localStorage.getItem("cart");
    if (storageCart) {
      dispacth({ type: "setCart", cart: JSON.parse(storageCart) });
    }
  }, []);

  function delOrder(userId) {
    fetch("/api/order", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userId }),
    })
      .then(async (e) => {
        if (e.status != 204) {
          let data = await e.json();
          if (!e.ok) {
            throw new Error(data.message);
          }
          return data;
        }
      })
      .then((e) => {
        console.log(e);
        delActiveOrder();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function addToCart(newProductId) {
    let productIndex = cart.findIndex((item) => item.id == newProductId);
    if (productIndex != -1) {
      let newCart = [...cart];
      newCart[productIndex].num++;
      dispacth({ type: "setCart", cart: newCart });
    } else {
      dispacth({ type: "add", new: { id: newProductId, num: 1 } });
    }
  }

  function removeFromCart(productId, userId) {
    let productIndex = cart.findIndex((item) => item.id == productId);
    let newCart = [...cart];
    if (cart[productIndex].num != 1) {
      newCart[productIndex].num--;
      dispacth({
        type: "setCart",
        cart: newCart,
      });
    } else {
      if (cart.length == 1) {
        localStorage.removeItem("cart");
        if (userId) {
          delOrder(userId);
        }
      }
      dispacth({
        type: "setCart",
        cart: newCart.filter((item) => item.id != productId),
      });
    }
  }

  function removeAll(userId) {
    dispacth({ type: "setCart", cart: [] });
    localStorage.removeItem("cart");
    if (userId) {
      delOrder(userId);
    }
  }

  function getTotalNum() {
    let result = 0;
    if (cart) {
      cart.forEach((item) => {
        result += item.num;
      });
    }
    return result.toLocaleString("fa-IR");
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        removeAll,
        getTotalNum,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
