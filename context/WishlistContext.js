





"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { userInfo, token } = useUser(); // ✅ include token

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist/get_all`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      const filtered = data.filter((item) => item.user_id === userInfo?.id);

      const enriched = await Promise.all(
        filtered.map(async (item) => {
          const p = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/id/${item.product_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const product = await p.json();
          return { ...item, product };
        })
      );

      setWishlistItems(enriched);
    } catch (err) {
      console.error("Fetch wishlist error", err);
    }
  };

  useEffect(() => {
    if (userInfo?.id) fetchWishlist();
  }, [userInfo]);

  const addToWishlist = async (product_id) => {
    if (!userInfo?.id || !token) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist/add_wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userInfo.id,
          product_id,
        }),
      });

      if (!response.ok) throw new Error("Failed to add to wishlist");

      // Optionally fetch product details
      const productRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/id/${product_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const product = await productRes.json();

      setWishlistItems((prev) => [
        ...prev,
        { id: Date.now(), user_id: userInfo.id, product_id, product },
      ]);
    } catch (err) {
      console.error("Add wishlist error:", err);
    }
  };

  const removeFromWishlist = async (id) => {
    if (!token) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wishlist/delete_wishlist/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to remove from wishlist");

      setWishlistItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Remove wishlist error:", err);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        addToWishlist,
        removeFromWishlist,
        fetchWishlist, // ✅ include here
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlistContext = () => useContext(WishlistContext);
