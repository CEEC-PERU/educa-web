'use client';
import React, { useState } from 'react';
import CardImage from '../components/student/CardImage';
import CardCarousel from '../components/student/CardCarousel';
import Footer from '../components/Footter';
import Navbar from '../components/Navbar';
import Proyectos from '@/components/Proyectos';
import { proyectosData } from '@/components/CursosData';
import ButtonComponent from '@/components/ButtonComponent';
import CompanyForm from '@/components/FormComponent';
import IndividualForm from '@/components/IndividualForm';
import { useEffect } from 'react';
import SplashScreen from '@/components/SplashScreen'; // ajusta la ruta si es necesario

import './globals.css';

//pagina principal volver responsive
// Sección 1: Encabezado con fondo de imagen y gradiente

export default function Home() {
  const [formType, setFormType] = useState<'company' | 'individual'>(
    'individual'
  );
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000); // Mostrar splash durante 2.5 segundos

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Sección 1: Encabezado con fondo de imagen y gradiente */}

      <Navbar
        bgColor="bg-gradient-to from-brand-mor-600 via-brandfucsia-900 to-brand-800 "
        paddingtop="pt-8"
      />

      <section className="hero-section relative flex items-center justify-center w-full text-center text-white pb-60 bg-brand-500 overflow-hidden">
        {/* Fondo con animación de desvanecimiento */}
        <div
          className="hero-bg absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://res.cloudinary.com/dk2red18f/image/upload/v1724341328/WEB_EDUCA/WEB-IMAGENES/vho1lfqexzzexa9dfo3h.png)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r"></div>
        </div>

        <div className="hero-content relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-15xll mx-auto md:pl-40">
          {/* Texto y botón */}
          <div className="hero-text md:w-1/2 relative z-10 md:px-6 text-left md:mr-10 pt-40">
            <h1 className="hero-title text-3xl sm:text-4xl md:text-6xl font-black mb-3 leading-tight animate-text-1">
              Tu aliado para inspirar
            </h1>
            <h1 className="hero-title text-3xl sm:text-4xl md:text-6xl font-black mb-3 leading-tight animate-text-2">
              la lealtad a tus clientes
            </h1>

            <div className="hero-button flex flex-col md:flex-row gap-4 pt-6 animate-button">
              <ButtonComponent
                buttonLabel="Empezar"
                backgroundColor="bg-brand-500"
                fontSize="px-6 py-2"
                buttonSize="py-3 px-5 w-auto"
                textColor="white"
              />
            </div>
          </div>

          {/* Imagen con animación escalada */}
          <div className="hero-image md:w-1/2 relative z-10 px-6 animate-image">
            <img
              src="https://res.cloudinary.com/dk2red18f/image/upload/v1724337541/WEB_EDUCA/WEB-IMAGENES/nnejbmnffrzbibtpm4vq.png"
              className="w-full max-w-5xl mx-auto"
              alt="Imagen descriptiva"
            />
          </div>
        </div>
      </section>
      {/* Sección 3: Otra sección con fondo de imagen y gradiente */}

      <section className="relative flex flex-col items-center justify-center w-full p-6 text-center text-white overflow-hidden pt-20 pb-20 ">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://source.unsplash.com/random/1600x900)',
          }}
        >
          <div className="absolute inset-0 bg-brand-500 "></div>
        </div>

        <div className="relative flex flex-col md:flex-row items-center justify-center w-full max-w-6xl mx-auto px-4 sm:px-6 mt-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold w-full mb-4">
            Cursos de Calidad
          </h2>
        </div>

        <div className="relative flex flex-col md:flex-row items-center justify-center w-full max-w-4xl mx-auto mt-8 mb-12 px-4 sm:px-6 text-center">
          <p className="text-white text-base sm:text-lg">
            Actualizados y elaborados por expertos en cada materia. Con recursos
            interactivos, lecciones dinámicas y evaluaciones prácticas, te
            proporcionamos las herramientas para adquirir habilidades y
            conocimientos de forma efectiva.
          </p>
        </div>

        <div className="container mb-6 ">
          <CardCarousel />
        </div>
      </section>

      {/* Sección 5: Información adicional con otro fondo de imagen y gradiente */}
      {/* Fondo con clip-path */}
      <section className="relative w-full h-[300px] bg-gradient-to-r  from-brand-100 via-brand-200 to-brand-300 overflow-hidden">
        <div className="absolute inset-0">
          <svg
            viewBox="0 0 1440 320"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              fill="url(#gradient)"
              d="M0,64L60,74.7C120,85,240,107,360,138.7C480,171,600,213,720,197.3C840,181,960,107,1080,74.7C1200,43,1320,53,1380,58.7L1440,64L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
            ></path>
            <defs>
              <linearGradient id="gradient" gradientTransform="rotate(90)">
                <stop offset="0%" stopColor="#071144" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>

      <section className="relative w-full py-20 flex items-center justify-center overflow-hidden bg-[#070f41] ">
        <div className="absolute inset-0 z-0 bg-gradient-to-r  from-brand-100 via-brand-200 to-brand-300  "></div>

        {/* Contenido  */}
        <div className="relative z-10 max-w-4xl px-4 text-center">
          <div className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight text-white">
            <span className="text-white">“</span> Suma a tu empresa{' '}
            <span className="text-white">"</span>
          </div>
          <p className="text-white text-base sm:text-lg font-medium">
            En un mercado educativo lleno de opciones, tú puedes sobresalir con
            una plataforma educativa única diseñada a la medida de tu marca.
            Atrae miradas, genera emoción y diferencia tu oferta de manera
            significativa. No solo atraerás a más usuarios, sino que los
            mantendrás comprometidos con una experiencia que no olvidarán.
          </p>
        </div>
      </section>

      <section className="relative w-full h-[300px] bg-[#071144] overflow-hidden">
        <div className="absolute inset-0">
          <svg
            viewBox="0 0 1440 320"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="waveGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#000E57" />
                <stop offset="50%" stopColor="#1C0955" />
                <stop offset="100%" stopColor="#24033D" />
              </linearGradient>
            </defs>

            <path
              fill="url(#waveGradient)"
              d="M0,192L80,181.3C160,171,320,149,480,128C640,107,800,85,960,106.7C1120,128,1280,192,1360,224L1440,256L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
            />
          </svg>
        </div>
      </section>

      {/* Sección 2: Sección con fondo brand-500 */}
      <section
        className="relative flex items-center justify-center w-full p-6 text-center text-white"
        style={{ backgroundColor: '#7C3AED' }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://source.unsplash.com/random/1600x900)',
          }}
        >
          <div className="absolute inset-0 bg-brand-500"></div>
        </div>
        <div className="relative z-10 container mx-auto p-6">
          <h2 className="text-3xl font-bold mb-4 text-gray-600">
            Empresas que confian en QTech
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-4 pt-5">
            <img
              src="https://res.cloudinary.com/dk2red18f/image/upload/v1721634377/WEB_EDUCA/WEB-IMAGENES/jbxefvsczjuhs9ve525i.png"
              className="w-30 h-30 object-contain px-8"
              alt="Empresa 1"
            />
            <img
              src="https://res.cloudinary.com/dk2red18f/image/upload/v1721634381/WEB_EDUCA/WEB-IMAGENES/jnvagrdzflir0q6vvo6p.png"
              className="w-30 h-30 object-contain px-8"
              alt="Empresa 1"
            />
            <img
              src="https://res.cloudinary.com/dk2red18f/image/upload/v1721634377/WEB_EDUCA/WEB-IMAGENES/jbxefvsczjuhs9ve525i.png"
              className="w-30 h-30 object-contain px-8"
              alt="Empresa 1"
            />
          </div>
        </div>
      </section>

      {/* Sección 4: Sección con fondo brand-500 */}
      <section className="relative flex items-center justify-center w-full p-6 bg-brand-500 text-white pt-40">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-7xl mx-auto px-4">
          {/* Imagen */}
          {/* Texto "Tu equipo crezca con nosotros" en lugar de imagen */}
          {/* Texto en lugar de imagen, manteniendo estilo */}
          <div className="w-full md:w-1/2 flex items-center justify-center  mr-8  ">
            <h2 className="text-5xl md:text-5xl lg:text-7xl font-extrabold leading-tight text-center text-white">
              Tu equipo crezca <br className="hidden md:block" /> con nosotros
            </h2>
          </div>

          {/* Formulario */}
          <div className="w-full md:w-1/2 flex flex-col px-4 mb-40">
            {/* Contenedor de botones + formulario */}
            <div className="flex flex-col items-center w-full">
              {/* Botones toggle */}
              <div className="flex flex-col sm:flex-row mb-6 space-y-4 sm:space-y-0 sm:space-x-4  mt-8">
                <button
                  onClick={() => setFormType('individual')}
                  className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                    formType === 'individual'
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  Individual
                </button>
                <button
                  onClick={() => setFormType('company')}
                  className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                    formType === 'company'
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  Empresa
                </button>
              </div>

              {/* Formulario dinámico */}
              <div className="w-full mt-8">
                {formType === 'individual' ? (
                  <IndividualForm />
                ) : (
                  <CompanyForm />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div>
        <Footer />
      </div>
    </main>
  );
}
