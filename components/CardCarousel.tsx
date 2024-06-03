// app/components/CardList.tsx
//se agrego el useClient
"use client";  
import React, { useEffect, useRef } from 'react';
import CardImage from './CardImage';

const CardCarousel: React.FC = () => {
  const cardListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (cardListRef.current) {
        cardListRef.current.scrollBy({ left: 300, behavior: 'smooth' });
      }
    }, 3000); // Desplazar cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-x-auto whitespace-nowrap" ref={cardListRef}>
      <div className="flex">
        <CardImage />
        <CardImage />
        <CardImage />
        <CardImage />
        {/* Añade más tarjetas si es necesario */}
      </div>
    </div>
  );
};

export default CardCarousel;
