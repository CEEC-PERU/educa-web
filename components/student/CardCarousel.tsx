"use client"; 
import React, { useEffect, useRef } from 'react';
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';
import CardImage from '../CardImage';

const CardCarousel: React.FC = () => {
  const swiperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (swiperRef.current) {
      new Swiper(swiperRef.current, {
        slidesPerView: 1, // Default to 1 slide per view
        spaceBetween: 20,
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
        },
      });
    }
  }, []);

  return (
    <div className="swiper-container" ref={swiperRef}>
      <div className="swiper-wrapper">
        <div className="swiper-slide">
          <CardImage
            imageUrl="https://api.lessin.pe/wp-content/uploads/2024/03/5-1.jpg"
            title="Mentalidad Ágil Y Cultura Innovadora"
            rating={4.9}
            description="Descubre el arte de equilibrar con éxito tu vida personal y laboral con nuestro curso especializado. Exploraremos estrategias prácticas y herramientas efectivas que te permitirán gestionar tus responsabilidades profesionales mientras cultivas un bienestar personal duradero. Aprenderás a establecer límites saludables, gestionar el tiempo con eficacia y nutrir tus relaciones, permitiéndote alcanzar un equilibrio sostenible que te llevará a una vida más plena y satisfactoria."
            buttonLabel="Check Availability"
            textColor="text-white"
          />
        </div>
        <div className="swiper-slide">
          <CardImage
            imageUrl="https://api.lessin.pe/wp-content/uploads/2024/04/Comunicacion-Asertiva-2-1.jpg"
            title="Pscologia Infantil"
            rating={4.9}
            description="Stay warm in a cozy cabin nestled in the mountains of Colorado, perfect for a winter retreat."
            buttonLabel="Check Availability"
            textColor="text-white"
          />
        </div>
        <div className="swiper-slide">
          <CardImage
            imageUrl="https://api.lessin.pe/wp-content/uploads/2023/11/Investigacion-de-mercados-4.jpg"
            title="Investigación de Mercados"
            rating={4.9}
            description="Stay warm in a cozy cabin nestled in the mountains of Colorado, perfect for a winter retreat."
            buttonLabel="Check Availability"
            textColor="text-white"
          />
        </div>
        <div className="swiper-slide">
          <CardImage
            imageUrl="https://api.lessin.pe/wp-content/uploads/2024/06/Declaracion-de-Impuestos-2023.png"
            title="Declaración de Impuestos"
            rating={4.9}
            description="Stay warm in a cozy cabin nestled in the mountains of Colorado, perfect for a winter retreat."
            buttonLabel="Check Availability"
            textColor="text-white"
          />
        </div>
        <div className="swiper-slide">
          <CardImage
            imageUrl="https://api.lessin.pe/wp-content/uploads/2024/06/Declaracion-de-Impuestos-2023.png"
            title="Declaración de Impuestos"
            rating={4.9}
            description="Stay warm in a cozy cabin nestled in the mountains of Colorado, perfect for a winter retreat."
            buttonLabel="Check Availability"
            textColor="text-white"
          />
        </div>
        {/* Añade más tarjetas si es necesario */}
      </div>
      <div className="swiper-button-prev"></div>
      <div className="swiper-button-next"></div>
    </div>
  );
};

export default CardCarousel;
