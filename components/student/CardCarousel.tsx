"use client";
import React, { useEffect, useRef } from 'react';
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';
import CardImage from './CardImage';

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
          1440: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
        },
      });
    }
  }, []);

  return (
    <div className="swiper-container overflow-hidden" ref={swiperRef}>
      <div className="swiper-wrapper">
        <div className="swiper-slide">
          <CardImage
            imageUrl="https://res.cloudinary.com/dk2red18f/image/upload/v1744820423/10_zyty3h.png"
            title="MARCA PERSONAL"
              background='bg-white'
            buttonLabel=' Desarrollo Personal'
            usuarios='120 usuarios'
                     description=""
            textColor="text-black"
          />
        </div>
        <div className="swiper-slide">
          <CardImage
            imageUrl="https://res.cloudinary.com/dk2red18f/image/upload/v1744820424/11_c8ueq9.png"
            title="RETENCIÓN DE TALENTO"
            background='bg-white'
          buttonLabel='Recursos Humanos '
            usuarios='30 usuarios'
                     description=""
            textColor="text-black"
          />
        </div>
        <div className="swiper-slide">
          <CardImage
            imageUrl="https://res.cloudinary.com/dk2red18f/image/upload/v1744820423/9_qgwxhr.png"
            title="HABILIDAD NEGOCIADORA"
            background='bg-white'
          buttonLabel='Responsabilidad Social Empresarial'
                     description=""
            usuarios='80 usuarios'
            textColor="text-black"
          />
        </div>
        <div className="swiper-slide">
          <CardImage
            imageUrl="https://res.cloudinary.com/dk2red18f/image/upload/v1744820423/14_apiwxt.png"
            usuarios='140 usuarios'
             buttonLabel='Gestión del Tiempo y Productividad'
            title="PRODUCTIVIDAD ÁGIL"
            background='bg-white'
           
                     description=""
            textColor="text-black"
          />
        </div>
        <div className="swiper-slide">
          <CardImage
            imageUrl="https://res.cloudinary.com/dk2red18f/image/upload/v1744820423/12_u9pqjj.png"
            buttonLabel='Desarrollo Personal'
            title="CONEXIONES LABORALES"
            background='bg-white'
          
            usuarios='60 usuarios'
                     description=""
            textColor="text-black"
          />
        </div>
        <div className="swiper-slide">
          <CardImage
            imageUrl="https://res.cloudinary.com/dk2red18f/image/upload/v1744820423/13_tmklth.png"
           
            title="GESTIÓN DE TALENTO MILENIAL"
            background='bg-white'
           buttonLabel='Recursos Humanos '
            usuarios='60 usuarios'
                     description=""
            textColor="text-black"
          />
        </div>
        {/* Añade más tarjetas si es necesario */}
      </div>
   
    </div>
  );
};

export default CardCarousel;
