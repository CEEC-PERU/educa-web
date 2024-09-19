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

  // Borrar el lienzo
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('No se puede acceder a la cámara. Por favor permite el acceso a la cámara para continuar.');
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

  return (
    <div>
      <ScreenSecurity />
      {/* Modal de Firma y Cámara */}
      <Modal
        isOpen={isSignatureModalOpen}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div className="bg-white rounded-lg p-6 shadow-lg relative">
          <h2 className="text-lg font-bold mb-4">Firma Digital</h2>
          <canvas
            ref={canvasRef}
            className="border border-gray-500 mb-4"
            width="400"
            height="200"
            onMouseDown={startDrawing}
            onTouchStart={startDrawing}
          ></canvas>
          <button onClick={clearCanvas} className="bg-gray-300 p-2 rounded mr-2">Borrar</button>

          <h2 className="text-lg font-bold mt-4 mb-2">Captura de Foto</h2>
          <video ref={videoRef} autoPlay className="border border-gray-500 mb-4"></video>
          <button onClick={capturePhoto} className="bg-blue-500 text-white p-2 rounded">Capturar Foto</button>

          {photo && (
            <div>
              <h2 className="text-lg font-bold mt-4 mb-2">Foto Capturada:</h2>
              <img src={photo} alt="Foto capturada" className="w-40 h-40 object-cover" />
            </div>
          )}

          <button 
            onClick={saveSignature} 
            className="bg-green-500 text-white p-2 rounded mt-4"
            disabled={!photo || !canvasRef.current?.toDataURL()}
          >
            Guardar Firma
          </button>
        </div>
      </Modal>
      
      {/* El resto del contenido */}
    </div>
  );
};

export default StudentIndex;
