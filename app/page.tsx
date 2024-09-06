'use client';
import React, { useState } from 'react';
import CardImage from '../components/student/CardImage';
import CardCarousel from "../components/student/CardCarousel";
import Footter from "../components/Footter";
import ButtonComponent from '@/components/ButtonComponent';
import CompanyForm from '@/components/FormComponent';
import IndividualForm from '@/components/IndividualForm';


//pagina principal
export default function Home() {
  const [formType, setFormType] = useState<'company' | 'individual'>('individual');
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Sección 1: Encabezado con fondo de imagen y gradiente */}
      <section className="relative flex items-center justify-center w-full text-center text-white  pb-60 bg-brand-500">
  <div className="absolute inset-0 bg-cover bg-center " style={{ backgroundImage: 'url(https://res.cloudinary.com/dk2red18f/image/upload/v1724341328/WEB_EDUCA/WEB-IMAGENES/vho1lfqexzzexa9dfo3h.png)' }}>
    <div className="absolute inset-0 bg-gradient-to-r "></div>
  </div>

  <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-15xll mx-auto  md:pl-40  ">
    <div className="md:w-1/2 relative z-10  md:px-6 text-left md:mr-10  pt-40 ">
      <h1 className="text-10xl md:text-6xl  sm:text-6xl font-black mb-3">Tu aliado para inspirar </h1>
      <h1 className="text-10xl md:text-6xl  sm:text-6xl font-black mb-3"> la lealtad   a tus clientes  </h1>
      <div className="flex flex-col md:flex-row gap-4 pt-6">
        <ButtonComponent buttonLabel="Empezar" backgroundColor="bg-brand-500" fontSize="px-6 py-2" buttonSize="py-3 px-5 w-auto" textColor="white"></ButtonComponent>
      </div>
    </div>
    <div className="md:w-1/2 relative z-10 px-6  ">
      <img src="https://res.cloudinary.com/dk2red18f/image/upload/v1724337541/WEB_EDUCA/WEB-IMAGENES/nnejbmnffrzbibtpm4vq.png" className="w-full max-w-5xl mx-auto" alt="Imagen descriptiva" />
    </div>
  </div>
</section>
      {/* Sección 3: Otra sección con fondo de imagen y gradiente */}
      <section className="relative flex flex-col items-center justify-center w-full p-6 text-center text-white overflow-hidden pt-20 pb-20">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://source.unsplash.com/random/1600x900)' }}>
          <div className="absolute inset-0 bg-brand-500"></div>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-6xl mx-auto px-6 mt-20 ">
          <h2 className="text-6xl w-full mb-4 font-extrabold">Cursos de Calidad</h2>
         
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-6xl mx-auto mt-8  mb-20 px-60 text-center">
        <p className='text-white'>Actualizados y elaborados por expertos en cada materia. Con recursos interactivos, lecciones dinámicas y evaluaciones prácticas, te proporcionamos las herramientas para adquirir habilidades y conocimientos de forma efectiva.</p>
        </div>
        <div className="container mb-6">
          <CardCarousel />
        </div>
      </section>

      {/* Sección 5: Información adicional con otro fondo de imagen y gradiente */}
      <section className="relative flex items-center justify-center w-full text-center text-white pt-20 pb-0 bg-brand-500">
       <img src="https://res.cloudinary.com/dk2red18f/image/upload/v1724347350/WEB_EDUCA/es9f3bizbduqbqjaqmlb.png" className=" mx-auto mb-10" alt="Imagen descriptiva" />
      </section>

      {/* Sección 2: Sección con fondo brand-500 */}
      <section className="relative flex items-center justify-center w-full p-6 text-center text-white" style={{ backgroundColor: '#7C3AED' }}>
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://source.unsplash.com/random/1600x900)' }}>
          <div className="absolute inset-0 bg-brand-500"></div>
        </div>
        <div className="relative z-10 container mx-auto p-6">
          <h2 className="text-3xl font-bold mb-4 text-gray-600">Empresas que confian en QTech</h2>
          <div className="flex flex-wrap justify-center items-center gap-4 pt-5">
            <img src="https://res.cloudinary.com/dk2red18f/image/upload/v1721634372/WEB_EDUCA/WEB-IMAGENES/tshjvw9grronve495tpq.png" className="w-30 h-30 object-contain px-8" alt="Empresa 1" />
            <img src="https://res.cloudinary.com/dk2red18f/image/upload/v1721634377/WEB_EDUCA/WEB-IMAGENES/jbxefvsczjuhs9ve525i.png" className="w-30 h-30 object-contain px-8" alt="Empresa 1" />
            <img src="https://res.cloudinary.com/dk2red18f/image/upload/v1721634381/WEB_EDUCA/WEB-IMAGENES/jnvagrdzflir0q6vvo6p.png" className="w-30 h-30 object-contain px-8" alt="Empresa 1" />
            <img src="https://res.cloudinary.com/dk2red18f/image/upload/v1721634372/WEB_EDUCA/WEB-IMAGENES/tshjvw9grronve495tpq.png" className="w-30 h-30 object-contain px-8" alt="Empresa 1" />
          </div>
        </div>
      </section>
      
      {/* Sección 4: Sección con fondo brand-500 */}
      <section className="relative flex items-center justify-center w-full p-6 bg-brand-500 text-white pt-40">

  
  <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-7xl mx-auto">
    
    {/* Columna izquierda: Imagen */}
    <div className="md:w-1/2 flex items-center justify-center pr-40">
      <img src="https://res.cloudinary.com/dk2red18f/image/upload/v1724357502/yzud3yhtrhdjljdedux1.png" className="w-full max-w-3xl mx-auto" alt="Imagen descriptiva" />
    </div>


    <div className="relative z-10 flex flex-col md:flex-row items-center justify-center ">
          {/* Toggle Buttons */}
          <div className="mb-6 ">
            <div className='mb-10 '>
            <button
              onClick={() => setFormType('individual')}
              className={`px-4 py-2 rounded-lg ${formType === 'individual' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}
            >
              Individual
            </button>
            <button
              onClick={() => setFormType('company')}
              className={`ml-4 px-4 py-2 rounded-lg ${formType === 'company' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}
            >
              Company
            </button>
            </div>
            {formType === 'individual' ? <IndividualForm /> : <CompanyForm />}
          </div>

          {/* Form Component */}
        
        </div>
  </div>
</section>

    </main>
  );
}
