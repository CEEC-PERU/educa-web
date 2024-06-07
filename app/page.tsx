import CardImage from '../components/CardImage';
import CardCarousel from "../components/CardCarousel";
import Footter from "../components/Footter";
import ButtonComponent from '@/components/ButtonComponent';

//pagina principal
export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Sección 1: Encabezado con fondo de imagen y gradiente */}
      <section className="relative flex flex-col md:flex-row items-center justify-center min-h-screen w-full p-6 text-center text-white">
      
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://source.unsplash.com/random/1600x900)' }}>
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-500 opacity-90"></div>
  </div>

  <div>
        <div className="md:w-1/2 relative z-10 px-6">
          <h1 className="text-6xl md:text-54xl font-bold mb-2  text-left">La plataforma que fideliza a tu cliente</h1>
          <p className="text-lg md:text-x mb-10 text-left">Descubre la revolución que cambiará la forma en que educas y conectas con tu audiencia. La personalización completa es la clave para una experiencia de aprendizaje inigualable. Somos el puente entre tu marca y la educación. Únete al futuro de la fidelización.</p>
          <div className="flex flex-col md:flex-row gap-4">
            <ButtonComponent buttonLabel="Iniciar sesión" backgroundColor='bg-violet-600' fontSize='px-6 py-2' buttonSize='py-3 px-5 w-auto' textColor='white'></ButtonComponent>
            <ButtonComponent buttonLabel="Conoce más" backgroundColor='bg-violet-600' fontSize='px-6 py-2' buttonSize='py-3 px-5  w-auto' textColor='white'></ButtonComponent>
          </div>
        </div>

        </div>
      </section>

      <section className="relative flex flex-col items-center justify-center min-h-screen w-full p-6 text-center text-white">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://source.unsplash.com/random/1600x900)' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-blue-500 opacity-90"></div>
        </div>
        <div className="relative z-10 container mx-auto p-6 bg-opacity-100 rounded shadow-lg">
          <h2 className="text-3xl font-bold mb-4">¡Estamos comprometidos con tu éxito!</h2>
          <p className="text-lg mb-4">¡Sé parte de esta revolución! Imagina cada interacción como una oportunidad para fortalecer la percepción de tu marca. En un mercado saturado, destacar es esencial. Nuestra plataforma te brinda la ventaja competitiva que necesitas. Con una experiencia de aprendizaje única y totalmente alineada con tu marca, no solo atraerás a más clientes finales, sino que los retendrás de forma apasionada.</p>
          <div className="flex flex-wrap justify-center">
            {/* Aquí puedes agregar más contenido adicional si es necesario */}
          </div>
        </div>
      </section>

      

      {/* Sección 2: Carrusel de Tarjetas con fondo de color sólido */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full p-6 bg-white text-gray-800">
        <div className="container mx-auto mb-6">
          {/* Aquí puedes agregar el contenido del carrusel de tarjetas */}
         <CardCarousel/>
        </div>
      </section>

      {/* Sección 3: Información adicional con otro fondo de imagen y gradiente */}
      <section className="relative flex flex-col items-center justify-center min-h-screen w-full p-6 text-center text-white">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://source.unsplash.com/random/1600x900)' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-blue-500 opacity-90"></div>
        </div>
        <div className="relative z-10 container mx-auto p-6 bg-opacity-50 rounded shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Más información</h2>
          <p className="text-lg mb-4">Aquí puedes agregar más información sobre tu plataforma, testimonios de usuarios, o cualquier otro contenido relevante.</p>
          <div className="flex flex-wrap justify-center">
            {/* Aquí puedes agregar más contenido adicional si es necesario */}
          </div>
        </div>
      </section>
    </main>
  );
}
