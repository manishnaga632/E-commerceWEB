// app/(frontend)/wishlist/page.js

"use client";
import { useWishlistContext } from "@/context/WishlistContext";
import { useStateContext } from "@/context/StateContext";
import { toast } from "react-hot-toast";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlistContext();
  const { fetchCartItems } = useStateContext(); // ✅ fixed
  const moveToCart = async (item) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: item.product_id,
          quantity: 1,
          user_id: item.user_id,
          created_at: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Failed to add to cart");

      await removeFromWishlist(item.id);
      await fetchCartItems();

      toast.success(`${item.product.name} moved to cart`, {
        duration: 4000,
        position: 'top-right',
      });
    } catch (err) {
      toast.error("Failed to move to cart");
      console.error(err);
    }
  };



  return (
    <div className="wishlist-page">
      <h2 className="text-2xl font-bold mb-4">Your Wishlist</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {wishlistItems.map((item) => (
          <div key={item.id} className="border p-4 rounded shadow">
            <img src={item.product.image} alt={item.product.name} className="h-40 w-full object-cover" />
            <h3 className="text-lg mt-2">{item.product.name}</h3>
            <p>₹{item.product.net_price}</p>
            <div className="flex justify-between mt-2">
              <button
                onClick={() => moveToCart(item)}
                className="bg-green-500 text-white px-2 py-1 rounded"
              >
                Move to Cart
              </button>
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
