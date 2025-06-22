"use client";
import { useWishlistContext } from "@/context/WishlistContext";
import { useStateContext } from "@/context/StateContext";
import { toast } from "react-hot-toast";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlistContext();
  const { fetchCartItems, cartItems } = useStateContext();
  const { userInfo, token } = useUser();
  const router = useRouter();

  const moveToCart = async (item) => {
    if (!userInfo?.id || !token) {
      toast.error("Please log in to move to cart");
      router.push("/login");
      return;
    }

    // ✅ Prevent adding duplicate product in cart
    const alreadyInCart = cartItems.some((cartItem) => cartItem.id === item.product_id);
    if (alreadyInCart) {
      toast("Already in cart");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: item.product_id,
          quantity: 1,
          user_id: userInfo.id,
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
    <div className="wishlist-page px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Your Wishlist</h2>

      {wishlistItems.length === 0 ? (
        <p className="text-gray-600">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {wishlistItems.map((item) => (
            <div key={item.id} className="border p-4 rounded shadow bg-white">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="h-40 w-full object-cover rounded"
              />
              <h3 className="text-lg font-semibold mt-2">{item.product.name}</h3>
              <p className="text-gray-700">₹{item.product.net_price}</p>
              <div className="flex justify-between mt-3">
                <button
                  onClick={() => moveToCart(item)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  Move to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
    