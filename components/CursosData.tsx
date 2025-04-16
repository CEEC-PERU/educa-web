"use client";

import Proyectos, { type Proyecto } from "@/components/Proyectos";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuestros Proyectos",
  description: "Descubre los proyectos más destacados de nuestra empresa",
};

// Datos de los proyectos 
export const proyectosData: Proyecto[] = [
  {
    titulo: "Marca Personal",
    categoria: "INNOVACION Y DESARROLLO",
    imagen: "https://res.cloudinary.com/dk2red18f/image/upload/v1744820423/10_zyty3h.png",
    descripcion:
      "The client's technology platform is very complex with a core system and multiple systems interconnected.",
    cliente: "CEEC",
  },

  {
    titulo: "HABILIDAD NEGOCIADORA",
    categoria: "TECNOLOGIA",
    imagen: "https://res.cloudinary.com/dk2red18f/image/upload/v1744820423/9_qgwxhr.png",
    descripcion:
      "The client's main goal was to assess and certify more than 4,500 health care providers or entities.",
    cliente: "CEEC",
  },
  {
    titulo: "PRODUCTIVIDAD ÁGIL",
    categoria: "HEALTH",
    imagen: "https://res.cloudinary.com/dk2red18f/image/upload/v1744820423/14_apiwxt.png",
    descripcion:
      "Descripción del proyecto con detalles sobre la implementación y resultados obtenidos.",
    cliente: "CEEC",
  },
  {
    titulo: "",
    categoria: "CONEXIONES LABORALES",
    imagen: "https://res.cloudinary.com/dk2red18f/image/upload/v1744820423/12_u9pqjj.png",
    descripcion:
      "The client's main goal was to assess and certify more than 4,500 health care providers or entities.",
    cliente: "CEEC",
  },
  {
    titulo: "GESTION DE TALENTO MILENIAL",
    categoria: "HEALTH",
    imagen: "https://res.cloudinary.com/dk2red18f/image/upload/v1744820423/13_tmklth.png",
    descripcion:
      "Descripción del proyecto con detalles sobre la implementación y resultados obtenidos.",
    cliente: "CEEC",
  },
  {
    titulo: "Marca Personal",
    categoria: "INNOVACION Y DESARROLLO",
    imagen: "https://res.cloudinary.com/dk2red18f/image/upload/v1744820423/10_zyty3h.png",
    descripcion:
      "The client's technology platform is very complex with a core system and multiple systems interconnected.",
    cliente: "CEEC",
  },
];

export default function ProyectosPage() {
  return (
    <main className="bg-[#1E1E1E] text-black">
      <Proyectos proyectos={proyectosData} />
    </main>
  );
}
