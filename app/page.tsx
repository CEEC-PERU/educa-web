// app/page.tsx
import CardImage from '../components/CardImage';
import CardCarousel from "../components/CardCarousel";
import Footter from "../components/Footter";
export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <section className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Bienvenido a EducaWeb
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Aprende con EducaWeb 
        </p>
        <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
          Comenzar ahora
        </button>
      </section>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Tarjetas de Propiedades</h1>
        <CardCarousel />
      </div>
    </main>
  );
}
