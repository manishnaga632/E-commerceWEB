"use client";

import { Navigation, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import Product from "./Product"; // adjust path if needed

export default function ProductSlider({ products }) {
  return (
    <Swiper
      breakpoints={{
        300: { slidesPerView: 1, spaceBetween: 100 },
        1000: { slidesPerView: 2, spaceBetween: 0 },
        1260: { slidesPerView: 3, spaceBetween: 0 },
      }}
      modules={[Navigation, A11y]}
      spaceBetween={0}
      slidesPerView={3}
      navigation
    >
      {products.length > 0 ? (
        products.map((product) => (
          <SwiperSlide key={product.id}>
            <Product product={product} />
          </SwiperSlide>
        ))
      ) : (
        <p>Loading products...</p>
      )}
    </Swiper>
  );
}
