import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import { useAuth } from '../../context/AuthContext';
import SidebarDrawer from '../../components/student/DrawerNavigation';
import Navbar from '../../components/Navbar';
import { Profile } from '../../interfaces/UserInterfaces';
import { useCourseStudent } from '../../hooks/useCourseStudents';
import CourseCard from '../../components/student/CourseCard';
import { XCircleIcon, ChevronRightIcon, CameraIcon , TrashIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import './../../app/globals.css';
import ScreenSecurity from '../../components/ScreenSecurity';
import Footter from '../../components/Footter';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useUserInfo } from '../../hooks/useUserInfo';
import { UserInfoData } from '../../interfaces/UserInfo';
import { userInfo } from 'os';
Modal.setAppElement('#__next');

const LoadingSpinner = () => (
  
<div className="text-center">
    <div role="status">
        <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span className="sr-only">Loading...</span>
    </div>
</div>
);

const StudentIndex: React.FC = () => {
  const { logout, user, profileInfo , token} = useAuth();
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
  const [success, setSuccess] = useState<boolean>(false); // Estado para mostrar mensaje de éxito
  const { submitUserInfo, loading, error } = useUserInfo();
  const userInfor = user as { id: number };
  let name = '';
  let uri_picture = '';
  let lastName  = '';


  useEffect(() => {
    const checkModalStatus = async () => {
      try {
        const response = await fetch('http://localhost:4100/api/userinfo/modals', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Use the token from the context
          },
        });

        const data = await response.json();

        if (data.showModal) {
          setIsSignatureModalOpen(true);
        }
      } catch (error) {
        console.error('Error checking modal status:', error);
      }
    };

    if (token) {
      checkModalStatus();
    }
  }, [token]); 

  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    lastName = profile.last_name;
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

  const dataURLToFile = (dataUrl: string, fileName: string): File => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  };
  
  const pdfToFile = (pdf: jsPDF, fileName: string): File => {
    const pdfBlob = pdf.output('blob');
    return new File([pdfBlob], fileName, { type: 'application/pdf' });
  };
  

  const generatePDF = async () => {
    if (!photo || !signature) {
      alert('Debes tomar una foto y firmar antes de guardar.');
      return;
    }
  
    const pdf = new jsPDF();
  
    // Agregar la foto
    const imgDataPhoto = photo; // La foto capturada
    pdf.addImage(imgDataPhoto, 'JPEG', 10, 10, 190, 190); // Ajusta la posición y el tamaño según sea necesario
  
    // Agregar la firma
    const imgDataSignature = signature; // La firma capturada
    pdf.addImage(imgDataSignature, 'JPEG', 10, 210, 190, 50); // Ajusta la posición y el tamaño según sea necesario
  
    // Descargar el PDF
    pdf.save(`${name}_${lastName}_${Date.now()}.pdf`);

    if (!photo || !signature || !user) {
      alert('Debes tomar una foto, firmar, y estar autenticado para guardar.');
      return;
    }

     // Convertir la foto, firma y PDF en archivos
  const photoFile = dataURLToFile(photo, `${name}_${lastName}_photo.jpg`);
  const signatureFile = dataURLToFile(signature, `${name}_${lastName}_signature.jpg`);
  const pdfFile = pdfToFile(pdf, `${name}_${lastName}.pdf`);
  
  try {
    const userInfo: UserInfoData = {
      user_id: userInfor.id,
      foto_image: photoFile,
      firma_image: signatureFile,
      documento_pdf: pdfFile,
    };

    console.log(userInfo);
    await submitUserInfo(userInfo);

    // Oculta el loading spinner antes de mostrar el alert
    setIsSignatureModalOpen(false);
    alert('Datos enviados exitosamente');
  
  } catch (error) {
    alert('Hubo un error al enviar los datos.');
  }
};
  return (
    <div>
      <ScreenSecurity />
      {/* Modal de Firma y Cámara */}
      {/* Modal de Firma y Cámara */}
      <Modal isOpen={isSignatureModalOpen} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-index" overlayClassName="fixed inset-0 z-50">
        <div className="bg-white rounded-lg p-6 shadow-lg relative w-full max-w-lg max-h-[90vh] overflow-auto">
          
          {/* Spinner mientras se envían los datos */}
          {loading ? <LoadingSpinner /> : null} {/* Muestra el spinner mientras se está enviando */}

          {/* Botones de acciones */}
          {!loading && (
            <>
            <h2 className="text-xl font-semibold mb-4 text-center">Firma Digital</h2>

{/* Lienzo para la firma digital */}
<canvas ref={canvasRef} className="border border-gray-300 mb-4 w-full h-40 rounded-md" onMouseDown={startDrawing} onTouchStart={startDrawing}></canvas>

              <div className="flex space-x-2 justify-between">
                <button onClick={clearCanvas} className="flex items-center bg-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-400 transition-colors">
                  <TrashIcon className="w-5 h-5 mr-2" />
                  Borrar
                </button>
                <button
                  onClick={() => {
                    const dataURL = canvasRef.current?.toDataURL();
                    if (dataURL) {
                      setSignature(dataURL);
                    }
                  }}
                  className="flex items-center bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <CameraIcon className="w-5 h-5 mr-2" />
                  Capturar Firma
                </button>
              </div>

              {/* Mostrar la firma capturada si existe */}
              {signature && (
                <div className="mt-4">
                  <h2 className="text-lg font-bold">Firma Capturada:</h2>
                  <img src={signature} alt="Firma Capturada" className="border border-gray-500 mt-2 rounded-md" />
                </div>
              )}

              {/* Captura de foto */}
              <h2 className="text-lg font-bold mt-6 mb-2">Captura de Foto</h2>
              <img src="https://mentormind-qtech.s3.amazonaws.com/WEB-EDUCA/imagen_dni.jpg" alt="Formato para la foto" className="w-full h-auto object-cover mb-4 rounded-md" />
              <video ref={videoRef} autoPlay playsInline className="border border-gray-300 mb-4 w-full rounded-md" />

              <button onClick={capturePhoto} disabled={!cameraStream} className={`flex items-center justify-center w-full bg-blue-500 text-white p-2 rounded-lg transition-colors ${!cameraStream ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}>
                <CameraIcon className="w-5 h-5 mr-2" />
                Capturar Foto
              </button>

              {photo && (
                <div>
                  <h2 className="text-lg font-bold mt-4 mb-2">Foto Capturada:</h2>
                  <img src={photo} alt="Foto capturada" className="w-full h-auto object-cover rounded-md" />
                </div>
              )}

              {/* Botón para guardar */}
              <button onClick={generatePDF} className={`w-full bg-green-500 text-white p-2 rounded-lg mt-4 transition-colors ${!photo || !signature ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`} disabled={!photo || !signature}>
                Guardar
              </button>
            </>
          )}
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
      {selectedCourse && (
        <Modal
          key={selectedCourse.course_id}
          isOpen={!!selectedCourse}
          onRequestClose={closeModal}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <div className="relative bg-white rounded-lg overflow-hidden shadow-lg max-w-lg w-full">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-black"
            >
              <XCircleIcon className="h-8 w-8" />
            </button>
            <img className="w-full h-64 object-cover mb-4" src={selectedCourse.image} alt={selectedCourse.name} />
            <div className="px-6 py-4">
              <div className="bg-brandmorad-600 rounded font-bold text-md mb-2 text-white p-4">{selectedCourse.courseCategory.name}</div>
              <div className="font-bold text-md mb-2 text-black">{selectedCourse.name}</div>
              <p className="text-brandrosado-800 text-base mb-4">
                Por: {selectedCourse.courseProfessor.full_name}
              </p>
              <p className="text-black text-sm mb-4">
                {selectedCourse.description_short}
              </p>
              <div className="flex justify-end mt-4">
                <button 
                  className="bg-brandmora-500 text-white px-4 rounded hover:bg-brandmorado-700 border-2 border-brandborder-400 flex items-center"
                  onClick={navigateToCourseDetails}
                >
                  Detalles del curso <ChevronRightIcon className="h-5 w-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
       
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