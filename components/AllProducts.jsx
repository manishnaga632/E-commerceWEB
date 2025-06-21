

import React from 'react'
import Link from 'next/link'
import { AiOutlineHeart } from 'react-icons/ai' // Import wishlist icon

const AllProducts = ({ allproducts: { id, name, slug, description, mrp, net_price, image } }) => {
    const defaultImage = 'path/to/default/image.jpg'
    // Agar kisi product ka image nahi mile, to ye default image dikhai jaayegi.
// 🔧 Tip: Is path ko actual working image se replace karna hoga, ya public folder mein ek image daal dena.

    return (
        <div className="relative">
            <Link href={`/products/${slug}`}>
                <div className="Allproduct-card relative">
                    {/* Wishlist icon top-right */}
                    <div className="absolute top-2 right-2 z-10 cursor-pointer bg-white p-1 rounded-full shadow-md hover:scale-110 transition">
                        <AiOutlineHeart size={20} color="red" />
                    </div>

                    <img src={image || defaultImage} width={250} height={270} alt={name} />
                    <p className='Allproduct-name'>{name}</p>
                    <p className='Allproduct-description'>{description}</p>
                    <p className='Allproduct-price'>₹ {net_price}</p>
                </div>
            </Link>
        </div>
    )
}

export default AllProducts
