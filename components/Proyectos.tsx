"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export type Proyecto = {
  titulo: string;
  categoria: string;
  imagen: string;
  descripcion: string;
  cliente?: string;
};

interface ProyectosProps {
  proyectos?: Proyecto[];
}

export default function Proyectos({ proyectos = [] }: ProyectosProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(3);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsPerView(1);
      } else if (width < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const maxIndex = Math.max(Math.ceil(proyectos.length / itemsPerView) - 1, 0);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 800);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    setTimeout(() => setIsAnimating(false), 800);
  };

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(-${
        currentIndex * (100 / itemsPerView)
      }%)`;
    }
  }, [currentIndex, itemsPerView]);

  return (
    <section id="proyectos" className="bg-[#1E1E1E] py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="titulo-con-linea mb-12">
          <h2 className="text-3xl font-bold inline-block bg-purple-600 px-4 py-1 text-black">
            NUESTROS PROYECTOS
          </h2>
        </div>

        <div className="relative px-4 sm:px-8 md:px-12">
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg text-purple-600 hover:bg-purple-600 hover:text-white transition-colors"
            aria-label="Previous projects"
            disabled={isAnimating}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="overflow-hidden">
            <div
              ref={carouselRef}
              className="flex transition-transform duration-800"
              style={{
                width: `${(100 / itemsPerView) * proyectos.length}%`,
                transitionTimingFunction: "ease",
              }}
            >
              {proyectos.map((proyecto, index) => (
                <div
                  key={index}
                  className="px-3"
                  style={{
                    width: `${100 / proyectos.length}%`,
                    flexShrink: 0,
                  }}
                >
                  <div className="proyecto-card bg-white shadow-lg rounded-lg overflow-hidden h-full">
                    <div className="relative">
                      <div className="proyecto-imagen h-48 relative">
                        <Image
                          src={proyecto.imagen || "/placeholder.svg"}
                          alt={proyecto.titulo}
                          fill
                          className="w-full h-full"
                        />
                      </div>
                    </div>

                    <div className="p-4">
                      <span className="categoria  bg-purple-600 p-2  rounded-lg">{proyecto.categoria}</span>
                      {proyecto.cliente && (
                        <p className="text-gray-600 text-sm mt-2">
                          {proyecto.cliente} |
                        </p>
                      )}
                      <h3 className="text-lg font-semibold mt-2 text-black">
                        {proyecto.titulo}
                      </h3>
                      <p className="text-sm mt-1 text-gray-500">{proyecto.descripcion}</p>
                      <p className="flex items-center gap-1.5 font-sans text-base font-normal leading-relaxed text-blue-gray-900 antialiased pt-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="-mt-0.5 h-5 w-5 text-yellow-700">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd"></path>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="-mt-0.5 h-5 w-5 text-yellow-700">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd"></path>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="-mt-0.5 h-5 w-5 text-yellow-700">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd"></path>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="-mt-0.5 h-5 w-5 text-yellow-700">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd"></path>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="-mt-0.5 h-5 w-5 text-yellow-700">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd"></path>
            </svg>
           
          </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg text-purple-600 hover:bg-purple-600 hover:text-white transition-colors"
            aria-label="Next projects"
            disabled={isAnimating}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="flex justify-center mt-8 space-x-2  bg-purple-600">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsAnimating(false), 800);
                }
              }}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-purple-600"
                  : "w-2 bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              disabled={isAnimating}
            />
          ))}
        </div>
      </div>
    </section>
  );
}