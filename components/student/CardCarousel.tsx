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
          1280: {
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
            imageUrl="https://res.cloudinary.com/dk2red18f/image/upload/v1724343480/uuhx7zsmvbsn91hcdzex.png"
            title="SOFT SKILLS"
              background='bg-white'
            
            usuarios='120 usuarios'
                     description=""
            textColor="text-black"
          />
        </div>
        <div className="swiper-slide">
          <CardImage
            imageUrl="https://res.cloudinary.com/dk2red18f/image/upload/v1721630275/WEB_EDUCA/Cursos/ylaexmxu1it0q1vb8n3j.jpg"
            title="Gestión del Cambio y Resiliencia"
            background='bg-white'
         
            usuarios='30 usuarios'
                     description=""
            textColor="text-black"
          />
        </div>
        <div className="swiper-slide">
          <CardImage
            imageUrl="https://res.cloudinary.com/dk2red18f/image/upload/v1721631666/WEB_EDUCA/Cursos/a9ncpw6jygilnrdz5vji.jpg"
            title="Gestión del Cambio y Adaptabilidad"
            background='bg-white'
         
                     description=""
            usuarios='80 usuarios'
            textColor="text-black"
          />
        </div>
        <div className="swiper-slide">
          <CardImage
            imageUrl="https://res.cloudinary.com/dk2red18f/image/upload/v1724343480/t1mdiispyudjabvyszxg.png"
            usuarios='140 usuarios'
            title="Líderes Transformacionales de Alto Rendimiento"
            background='bg-white'
           
                     description=""
            textColor="text-black"
          />
        </div>
        <div className="swiper-slide">
          <CardImage
            imageUrl="https://res.cloudinary.com/dk2red18f/image/upload/v1721631193/WEB_EDUCA/Cursos/tsb2uphnryszdxhfgghi.jpg"
           
            title="Ética  Empresarial"
            background='bg-white'
          
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
