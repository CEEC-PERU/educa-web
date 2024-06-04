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
        <div className="card-carousel-item">
        <CardImage
          imageUrl="https://api.lessin.pe/wp-content/uploads/2024/03/5-1.jpg"
          title="Mentalidad Ágil Y Cultura Innovadora"
          rating={4.9}
          description="Descubre el arte de equilibrar con éxito tu vida personal y laboral con nuestro curso especializado. Exploraremos estrategias prácticas y herramientas efectivas que te permitirán gestionar tus responsabilidades profesionales mientras cultivas un bienestar personal duradero. Aprenderás a establecer límites saludables, gestionar el tiempo con eficacia y nutrir tus relaciones, permitiéndote alcanzar un equilibrio sostenible que te llevará a una vida más plena y satisfactoria. ¡"
          buttonLabel="Check Availability"
          textColor="text-blue-gray-900"
        />
        </div>
        <div className="card-carousel-item">
        <CardImage
          imageUrl="https://api.lessin.pe/wp-content/uploads/2024/04/Comunicacion-Asertiva-2-1.jpg"
          title="Pscologia Infantil"
          rating={4.9}
          description="Stay warm in a cozy cabin nestled in the mountains of Colorado, perfect for a winter retreat."
          buttonLabel="Check Availability"
          textColor="text-blue-gray-900"
        />
        </div>
        <div className="card-carousel-item">
        <CardImage
          imageUrl="https://api.lessin.pe/wp-content/uploads/2023/11/Investigacion-de-mercados-4.jpg"
          title="Investigación de Mercados"
          rating={4.9}
          description="Stay warm in a cozy cabin nestled in the mountains of Colorado, perfect for a winter retreat."
          buttonLabel="Check Availability"
          textColor="text-blue-gray-900"
        />
        </div>
        <div className="card-carousel-item">
        <CardImage
          imageUrl="https://api.lessin.pe/wp-content/uploads/2024/06/Declaracion-de-Impuestos-2023.png"
          title="Declaración de Impuestos"
          rating={4.9}
          description="Stay warm in a cozy cabin nestled in the mountains of Colorado, perfect for a winter retreat."
          buttonLabel="Check Availability"
          textColor="text-blue-gray-900"
        />
        </div>
        {/* Añade más tarjetas si es necesario */}
      </div>
    </div>
  );
};

export default CardCarousel;
