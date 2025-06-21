'use client';
import { useWishlist } from '@/context/WishlistContext';
import Link from 'next/link';

export default function WishlistPage() {
    const { wishlistItems, removeFromWishlist } = useWishlist();

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Your Wishlist</h2>
            {wishlistItems.length === 0 ? (
                <p>No items in wishlist.</p>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {wishlistItems.map((item) => (
                        <div key={item.id} className="border p-3 rounded shadow">
                            <Link href={`/products/${item.slug}`}>
                                <img src={item.image} className="w-full h-40 object-cover rounded" />
                                <p>{item.name}</p>
                                <p>₹ {item.net_price}</p>
                            </Link>
                            <button className="mt-2 text-sm text-red-500" onClick={() => removeFromWishlist(item.id)}>Remove</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
