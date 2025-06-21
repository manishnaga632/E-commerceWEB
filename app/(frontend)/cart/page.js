

"use client";

import React, { useRef } from 'react';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineShopping } from 'react-icons/ai';
import { HiOutlineTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useStateContext } from '@/context/StateContext';
import getStripe from '@/lib/getStripe';

const Cart = () => {
  const cartRef = useRef();
  const {
    cartItems,
    totalPrice,
    totalQty,
    onRemove,
    toggleCartItemQuantity
  } = useStateContext();

  const handleCheckout = async () => {
    const stripe = await getStripe();

    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartItems),
    });

    if (response.status === 500) return;

    const data = await response.json();
    toast.loading('Redirecting...');
    stripe.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <div className='cart-wrapper' ref={cartRef}>
      <h2>Shopping Cart</h2>
      <div className='cart-container'>
        <div className='cart-items'>
          {cartItems.length < 1 ? (
            <div className='empty-cart'>
              <AiOutlineShopping size={150} />
              <h1>Your shopping bag is empty</h1>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={`${item.id}-${item.backend_cart_id || item.product_id}`} className='item-card'>
                <div className='item-image'>
                  <img src={item.image} alt={item.name} />
                </div>
                <div className='item-details'>
                  <div className='name-and-remove'>
                    <h3>{item.name}</h3>
                    <button
                      type='button'
                      onClick={() => onRemove(item)}
                      className='remove-item'
                    >
                      <HiOutlineTrash size={28} />
                    </button>
                  </div>
                  <p className='item-tag'>Dress</p>
                  <p className='delivery-est'>Delivery Estimation</p>
                  <p className='delivery-days'>5 Working Days</p>
                  <div className='price-and-qty'>
                    <span className='price'>₹{item.net_price * item.quantity}</span>
                    <div className='qty-controls'>
                      <span
                        className='minus'
                        onClick={() => toggleCartItemQuantity(item.id, 'dec')}
                      >
                        <AiOutlineMinus />
                      </span>
                      <span className='num'>{item.quantity}</span>
                      <span
                        className='plus'
                        onClick={() => toggleCartItemQuantity(item.id, 'inc')}
                      >
                        <AiOutlinePlus />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className='order-summary'>
            <h3>Order Summary</h3>
            <div className='qty'>
              <p>Quantity</p>
              <span>{totalQty} Product{totalQty > 1 && 's'}</span>
            </div>
            <div className='subtotal'>
              <p>Sub Total</p>
              <span>₹{totalPrice}</span>
            </div>
            <button className='btn' type='button' onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
