
'use client'

import React from "react";
import HeroBanner from "@/components/HeroBanner";
import EventsBanner from "@/components/EventsBanner";
import Newsletter from "@/components/Newsletter";
import ProductSlider from "@/components/ProductSlider";

export default function Home() {
  const fetchProducts = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/all_products`, {
      cache: 'no-store'


      // Ek async function hai jo tumhare FastAPI backend se products fetch karta hai.

     // cache: 'no-store' matlab browser ya server kisi cache ka use nahi karega — hamesha fresh data milega.
    });
    return await res.json();
  };

  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  return (
    <>
      <HeroBanner />
      <EventsBanner />

      <div className="products-outer-container">
        <div className="subtitle">
          <span>PRODUCTS</span>
          <h2>Check What We Have</h2>
        </div>

        <ProductSlider products={products} />
      </div>

      <Newsletter />
    </>
  );
}

