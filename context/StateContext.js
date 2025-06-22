'use client';

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

const Context = createContext();

export const StateContext = ({ children }) => {
  const { userInfo, token } = useUser();
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const [qty, setQty] = useState(1);
  const router = useRouter();

  useEffect(() => {
    if (userInfo?.id) {
      fetchCartItems();
    }
  }, [userInfo]);

  const fetchCartItems = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/all_carts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      const userCart = data.filter(item => item.user_id === userInfo?.id);

      const enrichedCart = await Promise.all(userCart.map(async (item) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/id/${item.product_id}`);
        const product = await res.json();
        return {
          ...product,
          quantity: item.quantity,
          backend_cart_id: item.id,
        };
      }));

      setCartItems(enrichedCart);

      const totalP = enrichedCart.reduce((acc, item) => acc + item.net_price * item.quantity, 0);
      const totalQ = enrichedCart.reduce((acc, item) => acc + item.quantity, 0);
      setTotalPrice(totalP);
      setTotalQty(totalQ);
    } catch (err) {
      console.error("Failed to fetch cart items:", err);
    }
  };

  // const onAdd = async (product, quantity) => {
  //   const existingItem = cartItems.find((item) => item.id === product.id);

  //   let updatedCartItems;
  //   let updatedQuantity = quantity;

  //   if (existingItem) {
  //     updatedQuantity = existingItem.quantity + quantity;
  //     updatedCartItems = cartItems.map((item) =>
  //       item.id === product.id ? { ...item, quantity: updatedQuantity } : item
  //     );
  //   } else {
  //     updatedCartItems = [...cartItems, { ...product, quantity }];
  //   }

  //   setCartItems(updatedCartItems);
  //   setTotalPrice(prev => prev + product.net_price * quantity);
  //   setTotalQty(prev => prev + quantity);

  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) return;

  //     await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         user_id: userInfo.id,
  //         product_id: product.id,
  //         quantity: updatedQuantity,
  //         created_at: new Date().toISOString(),
  //       }),
  //     });

  //     fetchCartItems(); // ✅ re-fetch to get updated backend_cart_id
  //   } catch (err) {
  //     console.error("Error syncing to backend cart:", err);
  //   }

  //   toast.success(`${quantity} ${product.name} added to the cart.`);
  // };




  const onAdd = async (product, quantity) => {
    if (!userInfo?.id || !token) {
      toast.error("Please log in to add to cart");
      router.push("/login");
      return;
    }

    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      toast("Already in cart");
      return;
    }

    const updatedCartItems = [...cartItems, { ...product, quantity }];
    setCartItems(updatedCartItems);
    setTotalPrice(prev => prev + product.net_price * quantity);
    setTotalQty(prev => prev + quantity);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userInfo.id,
          product_id: product.id,
          quantity,
          created_at: new Date().toISOString(),
        }),
      });

      fetchCartItems(); // Re-fetch with backend ID
      toast.success(`${quantity} ${product.name} added to cart`);
    } catch (err) {
      console.error("Error syncing to backend cart:", err);
      toast.error("Failed to sync with backend");
    }
  };








  const onRemove = async (product) => {
    const newCartItems = cartItems.filter((item) => item.id !== product.id);
    setCartItems(newCartItems);
    setTotalPrice((prev) => prev - product.net_price * product.quantity);
    setTotalQty((prev) => prev - product.quantity);

    if (product.backend_cart_id) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/delete/${product.backend_cart_id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // ✅ Re-fetch the cart to ensure accuracy
        await fetchCartItems();

      } catch (err) {
        console.error("Failed to delete from backend cart:", err);
      }
    }

    toast.success(`${product.name} removed from the cart.`);
  };


  const toggleCartItemQuantity = async (id, action) => {
    const index = cartItems.findIndex((item) => item.id === id);
    if (index === -1) return;

    const updatedCartItems = [...cartItems];
    const product = updatedCartItems[index];

    if (action === 'inc') {
      product.quantity += 1;
    } else if (action === 'dec' && product.quantity > 1) {
      product.quantity -= 1;
    } else {
      return;
    }

    setCartItems(updatedCartItems);
    setTotalPrice(updatedCartItems.reduce((acc, item) => acc + item.net_price * item.quantity, 0));
    setTotalQty(updatedCartItems.reduce((acc, item) => acc + item.quantity, 0));

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userInfo.id,
          product_id: product.id,
          quantity: product.quantity,
          created_at: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("Failed to update cart item quantity", err);
    }
  };

  const incQty = () => setQty((prevQty) => prevQty + 1);
  const decQty = () => setQty((prevQty) => (prevQty > 1 ? prevQty - 1 : 1));

  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        setCartItems,
        totalPrice,
        setTotalPrice,
        totalQty,
        setTotalQty,
        qty,
        setQty,
        incQty,
        decQty,
        onAdd,
        onRemove,
        toggleCartItemQuantity,
        fetchCartItems,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
