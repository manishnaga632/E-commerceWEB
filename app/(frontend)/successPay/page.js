
"use client";
import React, { useEffect } from "react"; // ✅ FIXED: useEffect is now imported
import Link from "next/link";
import { BsBagCheckFill } from "react-icons/bs";
import { useStateContext } from "@/context/StateContext";
import { runConfetti } from "@/lib/utils";

const SuccessPay = () => {
  const { setCartItems, setTotalPrice, setTotalQty } = useStateContext();

  useEffect(() => {
    const clearCartBackend = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/clear_all`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCartItems([]);
        setTotalPrice(0);
        setTotalQty(0);

        if (typeof runConfetti === "function") runConfetti();
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    };

    clearCartBackend();
  }, []);

  return (
    <div className="success">
      <p className="icon">
        <BsBagCheckFill size={80} />
      </p>
      <h1>Thank you for your order!</h1>
      <p>Check your email inbox for the receipt.</p>
      <p className="description">
        If you have any questions, please email support@example.com
      </p>
      <Link href="/">
        <button className="btn" type="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  );
};

export default SuccessPay;
