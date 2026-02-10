// Mejoras en la firma digital:
// - El trazo comienza justo donde se inicia el mouse/touch, evitando "saltos" o líneas desde la esquina superior izquierda.
// - El canvas se inicializa con un punto en la posición inicial al comenzar el dibujo.
// - El resto del archivo mantiene su estructura original.

import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import { useAuth } from '../../context/AuthContext';
import SidebarDrawer from '../../components/student/DrawerNavigation';
import Navbar from '../../components/Navbar';
import { Profile } from '../../interfaces/User/UserInterfaces';
import { useCourseStudent } from '../../hooks/useCourseStudents';
import CourseCard from '../../components/student/CourseCard';
import {
  XCircleIcon,
  ChevronRightIcon,
  CameraIcon,
  TrashIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  VideoCameraIcon,
  PaperAirplaneIcon,
  CheckIcon,
} from '@heroicons/react/24/solid';

import { useRouter } from 'next/router';
import './../../app/globals.css';
import ScreenSecurity from '../../components/ScreenSecurity';
import Footter from '../../components/Footter';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useUserInfo } from '../../hooks/user/useUserInfo';
import { useCoursesCount } from '../../hooks/user/useUserCourses';
import { UserInfoData } from '../../interfaces/User/UserInfo';
import { userInfo } from 'os';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import { API_USER_INFO_SHOWMODAL } from '../../utils/Endpoints';
Modal.setAppElement('#__next');

const LoadingSpinner = () => (
  <div className="text-center">
    <div role="status">
      <svg
        aria-hidden="true"
        className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

const StudentIndex: React.FC = () => {
  const { logout, user, profileInfo, token } = useAuth();
  const { courseStudent, isLoading } = useCourseStudent();
  const { coursescount } = useCoursesCount();
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [filters, setFilters] = useState<any>({});
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(true);
  const [signature, setSignature] = useState<string | null>(null);

  // --- Mejoras en la firma digital ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState<number | null>(null);
  const [lastY, setLastY] = useState<number | null>(null);

  // --- Fin mejoras firma digital ---

  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const { submitUserInfo, loading, error } = useUserInfo();
  const userInfor = user as { id: number };
  let name = '';
  let uri_picture = '';
  let lastName = '';

  const [currentStep, setCurrentStep] = useState(1);
  const [consentGiven, setConsentGiven] = useState(false);
  const [infoRead, setInfoRead] = useState(false);

  useEffect(() => {
    const checkModalStatus = async () => {
      try {
        const response = await fetch(
          `${API_USER_INFO_SHOWMODAL}/${userInfor.id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        setIsSignatureModalOpen(data.showModal);
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

  // --- Firma digital mejorada ---
  // Inicia el dibujo y almacena la posición inicial, dibujando un punto inicial para evitar líneas desde la esquina
  const handleStartDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let x, y;
    if ('touches' in e) {
      x = e.touches[0].clientX - canvas.getBoundingClientRect().left;
      y = e.touches[0].clientY - canvas.getBoundingClientRect().top;
    } else {
      x = e.clientX - canvas.getBoundingClientRect().left;
      y = e.clientY - canvas.getBoundingClientRect().top;
    }

    setIsDrawing(true);
    setLastX(x);
    setLastY(y);

    // Dibuja un punto inicial donde comienza el trazo
    ctx.beginPath();
    ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
    ctx.fillStyle = '#222'; // color del trazo, puedes personalizar
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  // Dibuja la línea mientras se mueve el ratón o el dedo
  const handleDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || lastX === null || lastY === null) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let x, y;
    if ('touches' in e) {
      x = e.touches[0].clientX - canvas.getBoundingClientRect().left;
      y = e.touches[0].clientY - canvas.getBoundingClientRect().top;
    } else {
      x = e.clientX - canvas.getBoundingClientRect().left;
      y = e.clientY - canvas.getBoundingClientRect().top;
    }
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#222'; // color del trazo
    ctx.lineWidth = 2; // grosor del trazo
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    setLastX(x);
    setLastY(y);
  };

  // Termina el dibujo y limpia la posición
  const handleStopDrawing = () => {
    setIsDrawing(false);
    setLastX(null);
    setLastY(null);
    // ctx.beginPath(); // se quita para evitar líneas fantasmas
  };

  // Limpia el lienzo
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
  };
  // --- Fin firma digital mejorada ---

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
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error accessing camera:', error.message);
        if (
          error.name === 'NotFoundError' ||
          error.name === 'DevicesNotFoundError'
        ) {
          alert(
            'No se ha detectado ninguna cámara en tu dispositivo. Conéctate desde un dispositivo móvil con cámara.',
          );
        } else if (
          error.name === 'NotAllowedError' ||
          error.name === 'PermissionDeniedError'
        ) {
          alert('Por favor, permite el acceso a la cámara para continuar.');
        } else {
          alert(
            'Error al acceder a la cámara. Asegúrate de estar usando un dispositivo con cámara.',
          );
        }
      } else {
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
        cameraStream.getTracks().forEach((track) => track.stop());
      };
    }
  }, [cameraStream]);

  useEffect(() => {
    startCamera();
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
      query: { course_id: selectedCourse.course_id },
    });
    console.log('selectedCourse:', selectedCourse);
    console.log('selectedCourse.course_id:', selectedCourse?.course_id);
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
    const imgDataPhoto = photo;
    pdf.addImage(imgDataPhoto, 'JPEG', 10, 10, 190, 190);

    // Agregar la firma
    const imgDataSignature = signature;
    pdf.addImage(imgDataSignature, 'JPEG', 10, 210, 190, 50);

    pdf.save(`${name}_${lastName}_${Date.now()}.pdf`);

    if (!photo || !signature || !user) {
      alert('Debes tomar una foto, firmar, y estar autenticado para guardar.');
      return;
    }

    const photoFile = dataURLToFile(photo, `${name}_${lastName}_photo.jpg`);
    const signatureFile = dataURLToFile(
      signature,
      `${name}_${lastName}_signature.jpg`,
    );
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

      setIsSignatureModalOpen(false);
      alert('Datos enviados exitosamente');
    } catch (error) {
      alert('Hubo un error al enviar los datos.');
    }
  };

  return (
    <ProtectedRoute>
      <div>
        <ScreenSecurity />
        {/* MODAL FIRMA DIGITAL */}
        <Modal
          isOpen={isSignatureModalOpen}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
          overlayClassName="fixed inset-0"
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto border border-gray-100">
            {loading ? (
              <div className="min-h-[500px] flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="space-y-8 p-8">
                <div className="text-center">
                  <div className="mx-auto w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4 mt-4">
                    <DocumentTextIcon className="w-10 h-10 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Autorización de Tratamiento de Datos
                  </h2>
                  <p className="text-lg text-gray-500 mt-2">
                    Complete su información de verificación
                  </p>
                </div>
                {/* INFORMACIÓN CONSENTIMIENTO */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <InformationCircleIcon className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-blue-800 mb-2">
                        Declaración de Consentimiento
                      </h3>
                      <p className="text-gray-700">
                        "Autorizo el tratamiento de mis datos personales
                        (incluyendo imagen y firma) para efectos de registro de
                        asistencia y control de ingreso, conforme a lo dispuesto
                        en la Ley N.º 29733 - Ley de Protección de Datos
                        Personales."
                      </p>
                    </div>
                  </div>
                </div>
                {/* FIRMA DIGITAL MEJORADA */}
                <div className="space-y-5">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 mr-3">
                      <span className="font-bold">1</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Firma Digital
                    </h3>
                  </div>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50/50">
                    <canvas
                      ref={canvasRef}
                      className="w-full h-48 bg-white rounded-lg shadow-inner"
                      width={600}
                      height={192}
                      onMouseDown={handleStartDrawing}
                      onMouseMove={handleDrawing}
                      onMouseUp={handleStopDrawing}
                      onMouseLeave={handleStopDrawing}
                      onTouchStart={handleStartDrawing}
                      onTouchMove={handleDrawing}
                      onTouchEnd={handleStopDrawing}
                      style={{ touchAction: 'none', cursor: 'crosshair' }}
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={clearCanvas}
                      className="flex items-center px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200"
                    >
                      <TrashIcon className="w-5 h-5 mr-2" />
                      Limpiar Firma
                    </button>
                    <button
                      onClick={() => {
                        const dataURL = canvasRef.current?.toDataURL();
                        if (dataURL) setSignature(dataURL);
                      }}
                      className="flex-1 flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                      Confirmar Firma
                    </button>
                  </div>
                  {signature && (
                    <div className="mt-4 p-4 bg-green-50/80 border border-green-200 rounded-xl flex items-center">
                      <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-green-800">
                          Firma registrada correctamente
                        </p>
                        <p className="text-sm text-green-600">
                          Puede continuar con el siguiente paso
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                {/* FOTO Y CONSENTIMIENTO */}
                <div className="space-y-5">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 mr-3">
                      <span className="font-bold">2</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Verificación de Identidad
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="relative rounded-xl overflow-hidden bg-black">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-auto min-h-[250px] object-cover"
                      />
                      {!cameraStream && (
                        <div className="absolute inset-0 bg-gray-900/80 flex flex-col items-center justify-center text-white p-6 text-center">
                          <CameraIcon className="w-10 h-10 mb-3 opacity-70" />
                          <p>Haga clic en "Activar Cámara" para comenzar</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                        <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                          <InformationCircleIcon className="w-5 h-5 text-blue-500 mr-2" />
                          Requisitos para la imagen
                        </h4>
                        <ul className="space-y-2.5">
                          <li className="flex items-start">
                            <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">
                              Rostro completamente visible y bien iluminado
                            </span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">
                              Sin accesorios que cubran el rostro
                            </span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">
                              Fondo neutro preferiblemente
                            </span>
                          </li>
                        </ul>
                      </div>
                      <button
                        onClick={!cameraStream ? startCamera : capturePhoto}
                        className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center ${
                          !cameraStream
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        } shadow-md hover:shadow-lg`}
                      >
                        {!cameraStream ? (
                          <>
                            <VideoCameraIcon className="w-5 h-5 mr-2" />
                            Activar Cámara
                          </>
                        ) : (
                          <>
                            <CameraIcon className="w-5 h-5 mr-2" />
                            Capturar Imagen
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  {photo && (
                    <div className="mt-4 p-4 bg-green-50/80 border border-green-200 rounded-xl flex items-center">
                      <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-green-800">
                          Imagen verificada correctamente
                        </p>
                        <p className="text-sm text-green-600">
                          Su identidad ha sido registrada
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <input
                    type="checkbox"
                    id="consent-checkbox"
                    className="mt-1 mr-3 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                  />
                  <label htmlFor="consent-checkbox" className="text-gray-700">
                    <span className="block font-medium">
                      Confirmo mi consentimiento
                    </span>
                    <span className="block text-sm">
                      Acepto el tratamiento de mis datos personales según lo
                      establecido en la{' '}
                      <a
                        href="https://www.canva.com/design/DAGnccU5tkw/x9QLqfr8057IgwHGv5sScA/view?utm_content=DAGnccU5tkw&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hb87bcf2817"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        política de protección de datos
                      </a>{' '}
                      y confirmo que toda la información proporcionada es
                      verídica.
                    </span>
                  </label>
                </div>
                <div className="flex space-x-4 pt-2">
                  <button
                    onClick={generatePDF}
                    disabled={!photo || !signature || !consentGiven}
                    className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center ${
                      !photo || !signature || !consentGiven
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                    Enviar y Finalizar Registro
                  </button>
                </div>
              </div>
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
          <SidebarDrawer
            isDrawerOpen={isDrawerOpen}
            toggleSidebar={toggleSidebar}
          />
        </div>

        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r pt-40 pb-10 from-brand-100 via-brand-200 to-brand-300 p-4">
          <div className="relative flex flex-col lg:flex-row items-center text-left w-full text-white px-4 lg:px-40">
            <div className="lg:w-1/2 lg:pr-8 mb-8 lg:mb-0 p-10">
              <p className="text-5xl lg:text-7xl font-bold mb-4 text-brandrosado-800">
                Hola, {name}
              </p>
              <p className="mb-4 text-5xl lg:text-7xl text-white font-bold">
                ¡Qué bueno verte!
              </p>
              <p className="mb-4 text-lg lg:text-base text-white py-8">
                Este es tu portal de aprendizaje, explora tus cursos y potencia
                tu desarrollo profesional.
              </p>
            </div>
            <div className="lg:w-1/2 px-20">
              <div className="bg-brandazul-600 border-2 border-white p-4 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-brandazul-700 p-2 rounded-lg text-center flex items-center justify-center flex-col">
                  <div className="flex items-center justify-center">
                    <p className="text-brandfucsia-900 text-4xl lg:text-7xl">
                      {coursescount?.data?.totalCourses}
                    </p>
                    <img
                      src="https://res.cloudinary.com/dk2red18f/image/upload/v1721713563/WEB_EDUCA/ICONOS/jbfxiscml6nrazyi1gda.png"
                      className="h-12 w-12 ml-2"
                      alt="Icon"
                    />
                  </div>
                  <p className="text-white p-3">Curso inscritos</p>
                </div>
                <div className="bg-brandazul-700 p-2 rounded-lg text-center flex items-center justify-center flex-col">
                  <div className="flex items-center justify-center">
                    <p className="text-brandfucsia-900 text-4xl lg:text-7xl">
                      {coursescount?.data?.completedCourses}
                    </p>
                    <img
                      src="https://res.cloudinary.com/dk2red18f/image/upload/v1721713562/WEB_EDUCA/ICONOS/fsqde4gvrdhejt02t9xq.png"
                      className="h-12 w-12 ml-2"
                      alt="Icon"
                    />
                  </div>
                  <p className="text-white p-3">Curso completado</p>
                </div>
                <div className="bg-brandazul-700 p-2 rounded-lg text-center flex items-center justify-center flex-col">
                  <div className="flex items-center justify-center">
                    <p className="text-brandfucsia-900 text-4xl lg:text-7xl">
                      1
                    </p>
                    <img
                      src="https://res.cloudinary.com/dk2red18f/image/upload/v1721713512/WEB_EDUCA/ICONOS/ake0tmixpx9wnbzvessc.png"
                      className="h-12 w-12 ml-2"
                      alt="Icon"
                    />
                  </div>
                  <p className="text-white p-3">Diploma Obtenido</p>
                </div>
              </div>
            </div>
          </div>
          {/* Courses */}
          <div className="w-full max-w-screen-lg mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {courseStudent.map((courseStudent) => (
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
              <img
                className="w-full h-64 object-cover mb-4"
                src={selectedCourse.image}
                alt={selectedCourse.name}
              />
              <div className="px-6 py-4">
                <div className="bg-brandmorad-600 rounded font-bold text-md mb-2 text-white p-4">
                  {selectedCourse.courseCategory.name}
                </div>
                <div className="font-bold text-md mb-2 text-black">
                  {selectedCourse.name}
                </div>
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
                    Detalles del curso{' '}
                    <ChevronRightIcon className="h-5 w-5 ml-2" />
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
            backgroundImage:
              "url('https://res.cloudinary.com/dk2red18f/image/upload/v1724349813/WEB_EDUCA/icddbyrq4uovlhf6332o.png')",
            height: '500px',
          }}
        >
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-20 lg:pt-60 pl-10 lg:pl-40 text-white">
            {/* Primera columna: Logo */}
            <div className="flex justify-center">
              <img
                src="https://res.cloudinary.com/dk2red18f/image/upload/v1770755434/WEB_EDUCA/LOGO_A365_BLANCO_sin_texto_dnmnm9.png"
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
    </ProtectedRoute>
  );
};

export default StudentIndex;
