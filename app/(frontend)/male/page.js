import React from 'react'
import AllProducts from "@/components/AllProducts";

export default async function Male() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/category/all_products/male`);

    const data = await response.json(); // ✅ Extract JSON

    // Debugging: Log the response to check its structure
    // console.log("API Response:", data);

    if (!Array.isArray(data)) {
        return <p>No products available.</p>;
    }

    return (
        <div className='Allproducts-container'>
            {data.map(prod => (
                <AllProducts key={prod.id} allproducts={prod} />
            ))}
        </div>
    );
}
