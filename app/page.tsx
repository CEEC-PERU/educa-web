"use client";
import React, { useState } from "react";
import Link from "next/link";
import CardImage from "../components/student/CardImage";
import CardCarousel from "../components/student/CardCarousel";
import Footer from "../components/Footter";
import PublicNavbar from "../components/navigation/PublicNavbar";
import Proyectos from "@/components/Proyectos";
import { proyectosData } from "@/components/CursosData";
import CompanyForm from "@/components/FormComponent";
import IndividualForm from "@/components/IndividualForm";
import { useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import { ChevronDown, Brain, Play } from "lucide-react";
import "./globals.css";

const HERO_LINE_1 = [
  "Potencia",
  "tu",
  "futuro",
  "con",
  "conocimiento",
  "de",
  "valor",
];
const HERO_LINE_2 = ["y", "domina", "el", "cambio"];
const HERO_HIGHLIGHT_WORDS = new Set(["Potencia", "domina"]);
const HERO_WORD_BASE_DELAY_S = 0.15;
const HERO_WORD_STAGGER_S = 0.06;

function renderHeroWords(words: string[], startIndex: number) {
  return words.map((word, i) => (
    <span
      key={`${startIndex + i}-${word}`}
      className={`hero-word inline-block${
        HERO_HIGHLIGHT_WORDS.has(word) ? " text-brandrosado-800" : ""
      }`}
      style={{
        animationDelay: `${
          HERO_WORD_BASE_DELAY_S + (startIndex + i) * HERO_WORD_STAGGER_S
        }s`,
      }}
    >
      {word}
      {i < words.length - 1 ? " " : ""}
    </span>
  ));
}

export default function Home() {
  const [formType, setFormType] = useState<"company" | "individual">(
    "individual",
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
    <main className="min-h-screen bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300 text-white">
      <PublicNavbar variant="landing" />

      <section
        id="hero-section"
        className="hero-section relative flex items-center justify-center w-full text-center text-white pb-24 md:pb-40 lg:pb-52 bg-brand-500 overflow-hidden"
      >
        <div
          className="hero-bg absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://res.cloudinary.com/dk2red18f/image/upload/v1788973855/WEB_EDUCA/fondo-mentor_yydqw3.jpg)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-50% to-brand-500"></div>
        </div>

        <div className="hero-content relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-15xll mx-auto lg:pl-40">
          <div className="hero-text w-full md:w-[35%] lg:w-[42%] xl:w-1/2 relative z-10 px-4 md:px-6 text-left md:mr-10 pt-40">
            <h1 className="font-space-grotesk text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black mb-3 leading-tight text-black">
              {renderHeroWords(HERO_LINE_1, 0)}
              <br />
              {renderHeroWords(HERO_LINE_2, HERO_LINE_1.length)}
            </h1>
            <p className="hero-subtitle text-lg sm:text-xl md:text-2xl xl:text-3xl font-medium mb-6 animate-text-3 text-brandrosa-800">
              Tu futuro profesional se construye hoy
            </p>

            <div className="hero-button flex flex-col md:flex-row gap-4 pt-6 animate-button">
              <Link
                href="/login"
                className="cta-heartbeat relative flex items-center gap-4 rounded-full bg-gradient-to-r from-brandrosa-800 to-brandmc-100 py-2 pl-2 pr-6 text-sm font-semibold uppercase text-white shadow-lg"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-md">
                  <Play
                    className="h-4 w-4 fill-brandrosa-800 text-brandrosa-800"
                    aria-hidden="true"
                  />
                </span>
                <span className="relative z-10">
                  Aquí inicia tu ruta de aprendizaje
                </span>
                <Brain
                  className="h-6 w-6 shrink-0 text-white"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>

          <div className="hero-image w-full md:w-[50%] lg:w-[44%] xl:w-[38%] relative z-10 px-6 md:pt-16 lg:pt-24 animate-image">
            <img
              src="/robot-hero.gif"
              className="w-full max-w-sm mx-auto"
              alt="Imagen descriptiva"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            document
              .getElementById("cursos-section")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          aria-label="Desplazarse hacia abajo para ver más contenido"
          className="hero-scroll-hint absolute bottom-4 md:bottom-8 lg:bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center w-14 h-14 rounded-full text-white/80 hover:text-white transition-colors"
        >
          <ChevronDown className="w-12 h-12" strokeWidth={1.5} />
        </button>
      </section>

      <section className="relative w-full h-[220px] bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300 overflow-hidden">
        <div className="absolute inset-0">
          <svg
            viewBox="0 0 1440 220"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path fill="#071144" d="M0,0C480,160,960,160,1440,0Z"></path>
          </svg>
        </div>
      </section>

      <section
        id="cursos-section"
        className="relative flex flex-col items-center justify-center w-full p-6 text-center text-white overflow-hidden pt-20 pb-10 bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 0%, rgba(169,89,255,0.16), transparent 60%)",
          }}
        ></div>

        <div className="relative flex flex-col md:flex-row items-center justify-center w-full max-w-6xl mx-auto px-4 sm:px-6 mt-20">
          <h2 className="font-space-grotesk text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold w-full mb-4">
            Aprende con los mejores cursos, a tu propio ritmo
          </h2>
        </div>

        <div className="relative flex flex-col items-center justify-center w-full max-w-4xl mx-auto mt-8 mb-6 px-4 sm:px-6 text-center">
          <p className="text-white text-base sm:text-lg">
            Sumérgete en una experiencia de aprendizaje de primer nivel con
            contenido actualizado y de valor para tu crecimiento profesional.
            Nuestra plataforma te ofrece recursos multimedia interactivos y
            guías prácticas de aprendizaje efectivo y atractivo.
          </p>
          <p className="text-white text-base sm:text-lg mt-4">
            Avanza a tu propia velocidad y alcanza tu mejor versión.
          </p>
        </div>

        <div className="container mb-6 ">
          <CardCarousel />
        </div>
      </section>

      <section className="relative w-full h-[220px] bg-gradient-to-r  from-brand-100 via-brand-200 to-brand-300 overflow-hidden">
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
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#000E57" />
                <stop offset="50%" stopColor="#1C0955" />
                <stop offset="100%" stopColor="#24033D" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>

      <section className="relative w-full py-4 flex items-center justify-center overflow-hidden bg-brand-500 ">
        <div className="absolute inset-0 z-0 bg-gradient-to-r  from-brand-100 via-brand-200 to-brand-300  "></div>

        <div className="relative z-10 max-w-4xl px-4 text-center">
          <div className="font-space-grotesk text-4xl sm:text-5xl font-extrabold mb-6 leading-tight text-white">
            <span className="text-white">“</span> Confianza de nivel para la
            educación de{" "}
            <span className="text-white">tus equipos de trabajo"</span>{" "}
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

      <section className="relative w-full h-[300px] bg-brand-500 overflow-hidden">
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

      <section className="relative flex items-center justify-center w-full px-6 pt-6 pb-0 text-center text-white bg-brand-500">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(https://source.unsplash.com/random/1600x900)",
          }}
        >
          <div className="absolute inset-0 bg-brand-500"></div>
        </div>
        <div className="relative z-10 container mx-auto px-6 pt-2 pb-0">
          <h2 className="font-space-grotesk text-3xl font-bold mb-4 text-white">
            Empresas que confian en QTech
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-4 pt-5">
            <img
              src="https://res.cloudinary.com/dk2red18f/image/upload/v1770755434/WEB_EDUCA/LOGO_A365_BLANCO_sin_texto_dnmnm9.png"
              className="h-28 md:h-36 w-auto object-contain px-8"
              alt="Empresa 1"
            />
          </div>
        </div>
      </section>

      <section className="relative flex items-center justify-center w-full p-6 bg-brand-500 text-white pt-40 pb-32 md:pb-40">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-7xl mx-auto px-4">
          <div className="w-full md:w-1/2 flex items-center justify-center  mr-8  ">
            <h2 className="font-space-grotesk text-5xl md:text-5xl lg:text-7xl font-extrabold leading-tight text-center text-white">
              Juntos creamos la mejor versión de
              <br className="hidden md:block" />
              educación en línea
            </h2>
          </div>

          <div className="w-full md:w-1/2 flex flex-col px-4">
            <div className="flex flex-col items-center w-full">
              <div className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full p-1 mb-6 mt-8">
                <button
                  onClick={() => setFormType("individual")}
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    formType === "individual"
                      ? "bg-white text-brandrosa-800 shadow-md"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  Individual
                </button>
                <button
                  onClick={() => setFormType("company")}
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    formType === "company"
                      ? "bg-white text-brandrosa-800 shadow-md"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  Empresa
                </button>
              </div>

              <div className="w-full mt-8">
                {formType === "individual" ? (
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
