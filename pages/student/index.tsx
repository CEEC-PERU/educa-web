import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import { useAuth } from '../../context/AuthContext';
import SidebarDrawer from '../../components/student/DrawerNavigation';
import Navbar from '../../components/Navbar';
import { Profile } from '../../interfaces/UserInterfaces';
import { useCourseStudent } from '../../hooks/useCourseStudents';
import CourseCard from '../../components/student/CourseCard';
import { XCircleIcon, ChevronRightIcon, CameraIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import './../../app/globals.css';
import ScreenSecurity from '../../components/ScreenSecurity';
import Footter from '../../components/Footter';
Modal.setAppElement('#__next');


const StudentIndex: React.FC = () => {
  const { logout, user, profileInfo } = useAuth();
  const { courseStudent, isLoading } = useCourseStudent();
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [filters, setFilters] = useState<any>({});
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(true); // Modal de firma abierto al iniciar
  const [signature, setSignature] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  let name = '';
  let uri_picture = '';

  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    uri_picture = profile.profile_picture!;
  }

  // Comienzo de dibujo
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return; 
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.moveTo(x, y);

    const handleDraw = (ev: MouseEvent | TouchEvent) => draw(ev, ctx, rect);

    canvas.addEventListener('mousemove', handleDraw);
    canvas.addEventListener('touchmove', handleDraw);

    const stopDrawing = () => {
      canvas.removeEventListener('mousemove', handleDraw);
      canvas.removeEventListener('touchmove', handleDraw);
    };

    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
    canvas.addEventListener('touchend', stopDrawing);
  };

 
    // Dibujo sobre el lienzo
    const draw = (e: MouseEvent | TouchEvent, ctx: CanvasRenderingContext2D, rect: DOMRect) => {
      const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
      const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
      ctx.lineTo(x, y);
      ctx.stroke();
    };
  
    // Borrar el lienzo y resetear contexto
    const clearCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Reiniciar el estado del contexto
      ctx.beginPath();
    };

  // Guardar la firma solo si hay foto y firma
  const saveSignature = () => {
    if (!photo || !canvasRef.current) {
      alert('Debes tomar una foto y firmar antes de guardar.');
      return;
    }

    const dataURL = canvasRef.current.toDataURL();
    setSignature(dataURL);
    setIsSignatureModalOpen(false);
  };

 
  const startCamera = async () => {
    try {
      // Solicita acceso a la cámara
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play(); // Asegura que el video comience a reproducirse
      }
    } catch (error) {
      // Verifica si el error es una instancia de Error
      if (error instanceof Error) {
        console.error('Error accessing camera:', error.message);
  
        // Maneja el error si no se puede acceder a la cámara o no hay cámara disponible
        if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          alert('No se ha detectado ninguna cámara en tu dispositivo. Conéctate desde un dispositivo móvil con cámara.');
        } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          alert('Por favor, permite el acceso a la cámara para continuar.');
        } else {
          alert('Error al acceder a la cámara. Asegúrate de estar usando un dispositivo con cámara.');
        }
      } else {
        // Si el error no es una instancia de Error, maneja como un caso desconocido
        console.error('Unknown error accessing camera:', error);
        alert('Error desconocido al acceder a la cámara.');
      }
    }
  };
  

  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    if (!video) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    setPhoto(canvas.toDataURL());
  };

  useEffect(() => {
    if (cameraStream) {
      return () => {
        cameraStream.getTracks().forEach(track => track.stop());
      };
    }
  }, [cameraStream]);

  useEffect(() => {
    startCamera(); // Activar la cámara cuando cargue la página
  }, []);

  const openModal = (course: any) => {
    setSelectedCourse(course);
  };

  const closeModal = () => {
    setSelectedCourse(null);
  };

  

  const toggleSidebar = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const navigateToCourseDetails = () => {
    router.push({
      pathname: '/student/course-details',
      query: { course_id: selectedCourse.course_id }
    });
    console.log("selectedCourse:", selectedCourse);
    console.log("selectedCourse.course_id:", selectedCourse?.course_id);
  };


  return (
    <div>
      <ScreenSecurity />
      {/* Modal de Firma y Cámara */}
      <Modal
  isOpen={isSignatureModalOpen}
  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
>
  <div className="bg-white rounded-lg p-4 shadow-lg relative w-full max-w-md max-h-[90vh] overflow-auto">
    {/* Título del modal */}
    <h2 className="text-lg font-bold mb-4">Firma Digital</h2>
    
    {/* Lienzo para la firma digital */}
    <canvas
      ref={canvasRef}
      className="border border-gray-500 mb-4 w-full h-40"
      onMouseDown={startDrawing}
      onTouchStart={startDrawing}
    ></canvas>

    {/* Botón para borrar el lienzo */}
    <button onClick={clearCanvas} className="bg-gray-300 p-2 rounded mr-2">
      Borrar
    </button>

    {/* Captura de foto */}
    <h2 className="text-lg font-bold mt-4 mb-2">Captura de Foto</h2>

    {/* Imagen de referencia para tomar la foto, responsiva */}
    <img 
      src='https://mentormind-qtech.s3.amazonaws.com/WEB-EDUCA/imagen_dni.jpg' 
      alt='Formato para la foto' 
      className="w-full h-auto object-cover mb-4" 
    />

    <p className="text-lg font-bold mb-4">Tomar la foto en este formato</p>

    {/* Video para capturar la foto */}
    <video
  ref={videoRef}
  autoPlay
  playsInline
  className="border border-gray-500 mb-4 w-full"
/>

    {/* Botón para capturar la foto */}
    <button onClick={capturePhoto} className="bg-blue-500 text-white p-2 rounded">
      Capturar Foto
    </button>

    {/* Mostrar la foto capturada si existe */}
    {photo && (
      <div>
        <h2 className="text-lg font-bold mt-4 mb-2">Foto Capturada:</h2>
        <img src={photo} alt="Foto capturada" className="w-full h-auto object-cover" />
      </div>
    )}

    {/* Botón para guardar la firma */}
    <button 
      onClick={saveSignature} 
      className="bg-green-500 text-white p-2 rounded mt-4 w-full"
      disabled={!photo || !canvasRef.current?.toDataURL()}
    >
      Guardar Firma
    </button>
  </div>
</Modal>


      
      {/* El resto del contenido */}
      <div className="relative z-10">
        <Navbar
          bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
          borderColor="border border-stone-300"
          user={user ? { profilePicture: uri_picture } : undefined}
          toggleSidebar={toggleSidebar}
        />
        <SidebarDrawer isDrawerOpen={isDrawerOpen} toggleSidebar={toggleSidebar} />
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r pt-40 pb-10 from-brand-100 via-brand-200 to-brand-300 p-4">
        <div className="relative flex flex-col lg:flex-row items-center text-left w-full text-white px-4 lg:px-40">
          <div className="lg:w-1/2 lg:pr-8 mb-8 lg:mb-0 p-10">
            <p className="text-5xl lg:text-7xl font-bold mb-4 text-brandrosado-800">Hola, {name}</p>
            <p className="mb-4 text-5xl lg:text-7xl text-white font-bold">¡Qué bueno verte!</p>
            <p className="mb-4 text-lg lg:text-base text-white py-8">
              Este es tu portal de aprendizaje, explora tus cursos y potencia tu desarrollo profesional.
            </p>
          </div>
          <div className="lg:w-1/2 px-20">
          <div className='bg-brandazul-600 border-2 border-white p-4 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className="bg-brandazul-700 p-2 rounded-lg text-center flex items-center justify-center flex-col">
                <div className="flex items-center justify-center">
                  <p className="text-brandfucsia-900 text-4xl lg:text-7xl">11</p>
                  <img src="https://res.cloudinary.com/dk2red18f/image/upload/v1721713563/WEB_EDUCA/ICONOS/jbfxiscml6nrazyi1gda.png" className="h-12 w-12 ml-2" alt="Icon" />
                </div>
                <p className="text-white p-3">Curso inscritos</p>
              </div>
              <div className="bg-brandazul-700 p-2 rounded-lg text-center flex items-center justify-center flex-col">
                <div className="flex items-center justify-center">
                  <p className="text-brandfucsia-900 text-4xl lg:text-7xl">1</p>
                  <img src="https://res.cloudinary.com/dk2red18f/image/upload/v1721713562/WEB_EDUCA/ICONOS/fsqde4gvrdhejt02t9xq.png" className="h-12 w-12 ml-2" alt="Icon" />
                </div>
                <p className="text-white p-3">Curso completado</p>
              </div>
              <div className="bg-brandazul-700 p-2 rounded-lg text-center flex items-center justify-center flex-col">
                <div className="flex items-center justify-center">
                  <p className="text-brandfucsia-900 text-4xl lg:text-7xl">1</p>
                  <img src="https://res.cloudinary.com/dk2red18f/image/upload/v1721713512/WEB_EDUCA/ICONOS/ake0tmixpx9wnbzvessc.png" className="h-12 w-12 ml-2" alt="Icon" />
                </div>
                <p className="text-white p-3">Diploma Obtenido</p>
              </div>
            </div>
          </div>
        </div>
        {/* Courses */}
        <div className="w-full max-w-screen-lg mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {courseStudent.map(courseStudent => (
            <CourseCard
              key={courseStudent.Course.course_id}
              name={courseStudent.Course.name}
              description={courseStudent.Course.description_short}
              image={courseStudent.Course.image}
              profesor={courseStudent.Course.courseProfessor.full_name}
              categoria={courseStudent.Course.courseCategory.name}
              course_id={courseStudent.Course.course_id}
              onClick={() => openModal(courseStudent.Course)}
            />
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <div
        className="bg-no-repeat bg-cover bg-brand-100"
        style={{
          backgroundImage: "url('https://res.cloudinary.com/dk2red18f/image/upload/v1724349813/WEB_EDUCA/icddbyrq4uovlhf6332o.png')",
          height: '500px',
        }}
      >
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-20 lg:pt-60 pl-10 lg:pl-40 text-white">
          {/* Primera columna: Logo */}
          <div className="flex justify-center">
            <img
              src="https://res.cloudinary.com/dk2red18f/image/upload/v1724350020/WEB_EDUCA/fcnjkq9hugpf6zo6pubs.png"
              alt="Logo"
              className="h-20 lg:h-30"
            />
          </div>

          {/* Segunda columna: Títulos y textos */}
          <div className="pl-0 lg:pl-10">
            <h3 className="font-semibold text-lg">PÁGINAS</h3>
            <ul>
              <li>INICIO</li>
              <li>RECURSOS</li>
              <li>BENEFICIOS</li>
              <li>SUSCRÍBETE</li>
            </ul>
          </div>

          {/* Tercera columna */}
          <div className="pl-0 lg:pl-10">
            <h3 className="font-semibold text-lg">LINKS</h3>
            <ul>
              <li>TÉRMINOS Y CONDICIONES</li>
              <li>POLÍTICA DE PRIVACIDAD</li>
            </ul>
          </div>

          {/* Cuarta columna */}
          <div className="pl-0 lg:pl-10">
            <h3 className="font-semibold text-lg">CONTÁCTANOS</h3>
            <ul>
              <li>+51 9912785156</li>
              <li>administrador.app@ceec.com.pe</li>
              <li>MAGDALENA DEL MAR - LIMA</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentIndex;