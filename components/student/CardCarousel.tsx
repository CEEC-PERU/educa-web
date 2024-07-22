"use client";
import React, { useEffect, useRef } from 'react';
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';
import CardImage from '../Content/CardImage';

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
            imageUrl="https://res.cloudinary.com/dk2red18f/image/upload/v1720215037/f7upqslwrec9skm4nwez.jpg"
            title="Habilidades Blandas"
              background='bg-brandazul-600'
            rating={4.9}
            description="Desarrollar y potenciar habilidades blandas esenciales para el éxito profesional y personal en el entorno laboral.Aprende a expresar tus ideas claramente y a escuchar activamente  "
              buttonLabel="Detalles del Curso"
            textColor="text-white"
            textColorDescription="text-white"
          />
        </div>
        <div className="swiper-slide">
          <CardImage
            imageUrl="https://res.cloudinary.com/dk2red18f/image/upload/v1721630275/WEB_EDUCA/Cursos/ylaexmxu1it0q1vb8n3j.jpg"
            title="Gestión del Cambio y Resiliencia"
            rating={4.9}
              background='bg-brandazul-600'
            description="Líderes que buscan mejorar su capacidad para gestionar y prosperar en entornos de cambio constante  con resiliencia en un entorno laboral dinámico."
              buttonLabel="Detalles del Curso"
            textColor="text-white"
               textColorDescription="text-white"
          />
        </div>
        <div className="swiper-slide">
          <CardImage
            imageUrl="https://res.cloudinary.com/dk2red18f/image/upload/v1721631666/WEB_EDUCA/Cursos/a9ncpw6jygilnrdz5vji.jpg"
            title="Gestión del Cambio y Adaptabilidad"
            rating={4.9}
              background='bg-brandazul-600'
            description="Enseña cómo manejar y adaptarse a los cambios en la vida y en el trabajo. Incluye técnicas para enfrentar la incertidumbre y aprovechar nuevas oportunidades"
            buttonLabel="Detalles del Curso"
            textColor="text-white"
               textColorDescription="text-white"
          />
        </div>
        <div className="swiper-slide">
          <CardImage
            imageUrl="https://res.cloudinary.com/dk2red18f/image/upload/v1721631539/WEB_EDUCA/Cursos/hwmfj5fl42qqtrtqrhsd.avif"
              background='bg-brandazul-600'
            title="Autodisciplina y Motivación Personal"
            rating={4.9}
            description="Proporciona herramientas para mejorar la autodisciplina, establecer rutinas efectivas y mantenerse motivado a largo plazo y  superar la procrastinación."
               buttonLabel="Detalles del Curso"
            textColor="text-white"
               textColorDescription="text-white"
          />
        </div>
        <div className="swiper-slide">
          <CardImage
            imageUrl="https://res.cloudinary.com/dk2red18f/image/upload/v1721631193/WEB_EDUCA/Cursos/tsb2uphnryszdxhfgghi.jpg"
            background='bg-brandazul-600'
            title="Ética  Empresarial"
            rating={4.9}
            
            description="El curso está orientado a desarrollar habilidades para tomar decisiones éticas, comprender las implicaciones de las acciones y aplicar principios de ética en situaciones laborales diarias."
               buttonLabel="Detalles del Curso"
            textColor="text-white"
               textColorDescription="text-white"
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
