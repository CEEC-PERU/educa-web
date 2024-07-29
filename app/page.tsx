import CardImage from '../components/Content/CardImage';
import CardCarousel from "../components/student/CardCarousel";
import Footter from "../components/Footter";
import ButtonComponent from '@/components/ButtonComponent';

//pagina principal
export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Sección 1: Encabezado con fondo de imagen y gradiente */}
      <section className="relative flex flex-col items-center justify-center min-h-screen w-full p-6 text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://picsum.photos/1600/900)' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-6xl mx-auto px-6">
          <div className="md:w-1/2 relative z-10 px-6 text-left md:mr-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">La paltaforma que transforma tu futuro con cada lección</h1>
            <p className="text-lg md:text-xl mb-10">
              Descubre una nueva era de educación personalizada y accesible. Únete a nuestra plataforma y desarrolla tus habilidades con cursos interactivos diseñados para tu éxito.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <ButtonComponent buttonLabel="Iniciar sesión" backgroundColor="bg-brand-300" fontSize="px-6 py-2" buttonSize="py-3 px-5 w-auto" textColor="white"></ButtonComponent>
              <ButtonComponent buttonLabel="Conoce más" backgroundColor="bg-brand-300" fontSize="px-6 py-2" buttonSize="py-3 px-5 w-auto" textColor="white"></ButtonComponent>
            </div>
          </div>
          <div className="md:w-1/2 relative z-10 px-10 md:px-20 mt-10 md:mt-0">
            <img src="https://res.cloudinary.com/dk2red18f/image/upload/v1718309170/WEB_EDUCA/WEB-IMAGENES/viukoqq23jeum21zrreb.png" className="w-full h-auto max-w-sm mx-auto" alt="Imagen descriptiva" />
          </div>
        </div>
      </section>

      {/* Sección 2: Sección con fondo brand-500 */}
      <section className="relative flex items-center justify-center w-full p-6 text-center text-white" style={{ backgroundColor: '#7C3AED' }}>
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://source.unsplash.com/random/1600x900)' }}>
          <div className="absolute inset-0 bg-brand-500"></div>
        </div>
        <div className="relative z-10 container mx-auto p-6">
          <h2 className="text-3xl font-bold mb-4">Empresas que confian en QTech</h2>
          <div className="flex flex-wrap justify-center items-center gap-4 pt-5">
            <img src="https://res.cloudinary.com/dk2red18f/image/upload/v1721634372/WEB_EDUCA/WEB-IMAGENES/tshjvw9grronve495tpq.png" className="w-30 h-30 object-contain px-8" alt="Empresa 1" />
            <img src="https://res.cloudinary.com/dk2red18f/image/upload/v1721634377/WEB_EDUCA/WEB-IMAGENES/jbxefvsczjuhs9ve525i.png" className="w-30 h-30 object-contain px-8" alt="Empresa 1" />
            <img src="https://res.cloudinary.com/dk2red18f/image/upload/v1721634381/WEB_EDUCA/WEB-IMAGENES/jnvagrdzflir0q6vvo6p.png" className="w-30 h-30 object-contain px-8" alt="Empresa 1" />
            <img src="https://res.cloudinary.com/dk2red18f/image/upload/v1721634372/WEB_EDUCA/WEB-IMAGENES/tshjvw9grronve495tpq.png" className="w-30 h-30 object-contain px-8" alt="Empresa 1" />
          </div>
        </div>
      </section>

      {/* Sección 3: Otra sección con fondo de imagen y gradiente */}
      <section className="relative flex flex-col items-center justify-center w-full p-6 text-center text-white overflow-hidden pt-20 pb-20">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://source.unsplash.com/random/1600x900)' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"></div>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-6xl mx-auto px-6 mt-20 mb-20">
          <h2 className="text-5xl w-full mb-4">+100 Cursos </h2>
          <p>Ofrecemos cursos de calidad, actualizados y elaborados por expertos en cada materia. Con recursos interactivos, lecciones dinámicas y evaluaciones prácticas, te proporcionamos las herramientas para adquirir habilidades y conocimientos de forma efectiva.</p>
        </div>
        <div className="container mb-6">
          <CardCarousel />
        </div>
      </section>

      {/* Sección 5: Información adicional con otro fondo de imagen y gradiente */}
      <section className="relative flex items-center justify-center w-full text-center text-white pt-40 pb-60">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://source.unsplash.com/random/1600x900)' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-300 via-brand-200 to-brand-100"></div>
        </div>
        <div className="relative z-10 container mx-auto p-6 bg-opacity-50 rounded shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Suma a tu empresa</h2>
          <p className="text-lg mb-4">
            En un mercado educativo lleno de opciones, tú puedes sobresalir con una plataforma educativa única, diseñada a la medida de tu marca. Atrae miradas, genera emoción y diferencia tu oferta de manera significativa. No solo atraerás a más usuarios, sino que los mantendrás comprometidos con una experiencia que no olvidarán.
          </p>
          <img src="https://res.cloudinary.com/dk2red18f/image/upload/v1721633175/WEB_EDUCA/dgkoetefq3imflesk28x.png" className="w-full h-auto max-w-sm mx-auto" alt="Imagen descriptiva" />
        </div>
      </section>
    </main>
  );
}
