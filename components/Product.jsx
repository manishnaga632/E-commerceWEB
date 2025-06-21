import React from 'react'
import Link from 'next/link'

const Product = ({product: {image, name, slug, net_price}}) => {
  const defaultImage = 'path/to/default/image.jpg'; // Add the path to a default image
  return (
    <div>
      <Link href={`/products/${slug}`}>
        <div className='product-card'>
        <img src={image || defaultImage} width={380} height={400} alt={name} className='product-image' />
          <p className='product-name'>{name}</p>
          <p className='product-price'>₹ {net_price}</p>
        </div>
      </Link>
    </div>
  )
}

export default Product