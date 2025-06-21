
"use client";

import React, { useEffect, useState, use } from "react";
import { AiOutlineMinus, AiOutlinePlus, AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { CgShoppingCart } from "react-icons/cg";
import { useStateContext } from "@/context/StateContext";
import { useWishlistContext } from "@/context/WishlistContext";
import { useUser } from "@/context/UserContext";
import { toast } from "react-hot-toast"; // ✅ ADD THIS


export default function ProductDetails({ params }) {
    const { slug } = use(params); // ✅ Unwrap params properly

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [wishlistItemId, setWishlistItemId] = useState(null);

    const { decQty, incQty, qty, setQty, onAdd } = useStateContext();
    const { userInfo } = useUser();
    const {
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        fetchWishlist,
    } = useWishlistContext();

    useEffect(() => {
        setQty(1);
    }, [slug]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/slug/${slug}`);
                if (!response.ok) throw new Error("Failed to fetch product");
                const data = await response.json();
                setProduct(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching product:", error.message);
                setProduct(null);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    useEffect(() => {
        if (!product?.id) return;

        const item = wishlistItems.find((w) => w.product_id === product.id);
        if (item) {
            setIsWishlisted(true);
            setWishlistItemId(item.id);
        } else {
            setIsWishlisted(false);
            setWishlistItemId(null);
        }
    }, [wishlistItems, product]);

    const toggleWishlist = async () => {
        if (!product) return;

        try {
            if (isWishlisted) {
                await removeFromWishlist(wishlistItemId);
                toast.success("Removed from wishlist");
            } else {
                await addToWishlist(product.id);
                toast.success("Added to wishlist");
            }
            await fetchWishlist();
        } catch (err) {
            console.error("Error updating wishlist:", err);
            toast.error("Something went wrong");
        }
    };


    const handleAddToCart = () => {
        if (!product) return;
        onAdd(product, qty);
    };

    if (loading) return <p>Loading...</p>;
    if (!product) return <p>Product not found</p>;

    return (
        <div className="product-detail-container">
            <div className="product-images">
                <div className="big-image-container" style={{ position: "relative" }}>
                    <img src={product.image} alt={product.name} />
                    <span
                        className="wishlist-icon"
                        onClick={toggleWishlist}
                        style={{ position: "absolute", top: 10, right: 10, cursor: "pointer" }}
                    >
                        {isWishlisted ? <AiFillHeart size={28} color="red" /> : <AiOutlineHeart size={28} />}
                    </span>
                </div>
            </div>

            <div className="product-details">
                <h3>{product.name}</h3>
                <p>{product.description}</p>

                <div className="quantity-desc">
                    <h4>Quantity:</h4>
                    <div>
                        <span className="minus" onClick={decQty}><AiOutlineMinus /></span>
                        <span className="num">{qty}</span>
                        <span className="plus" onClick={incQty}><AiOutlinePlus /></span>
                    </div>
                </div>

                <div className="add-to-cart">
                    <button className="btn" onClick={handleAddToCart}>
                        <CgShoppingCart /> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
