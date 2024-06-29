import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBar';
import MediaUploadPreview from '../../components/MediaUploadPreview';
import { addSession } from '../../services/sessionService';
import { uploadVideo } from '../../services/videoService';
import { Session } from '../../interfaces/Session';
import FormField from '../../components/FormField';
import ActionButtons from '../../components/ActionButtons';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import './../../app/globals.css';

const SessionPage: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [session, setSession] = useState<Omit<Session, 'session_id'>>({
    video_enlace: '',
    duracion_minutos: 0,
    name: '',
    module_id: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const router = useRouter();
  const { moduleId, courseId } = router.query; // Obtener el ID del módulo y curso de la URL

  useEffect(() => {
    if (moduleId) {
      setSession(prevSession => ({ ...prevSession, module_id: Number(moduleId) }));
    }
  }, [moduleId]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    localStorage.setItem('sidebarState', JSON.stringify(!showSidebar));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value, type, checked } = e.target as HTMLInputElement;
    setSession(prevSession => ({
      ...prevSession,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleVideoUpload = (file: File) => {
    setVideoFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (videoFile) {
        const videoUrl = await uploadVideo(videoFile, 'Sesiones'); // Especificar la carpeta 'Sesiones'
        const newSession = await addSession({ ...session, video_enlace: videoUrl, module_id: Number(moduleId) });
        setSession({ video_enlace: '', duracion_minutos: 0, name: '', module_id: Number(moduleId) });
        router.push(`/content/detailModule?courseId=${courseId}&moduleId=${moduleId}`); // Redirigir a la página del módulo dentro del curso actual
      } else {
        setError('Video file is required');
      }
    } catch (error) {
      console.error('Error adding session:', error);
      setError('Error adding session');
    }
  };

  const handleCancel = () => {
    setSession({ video_enlace: '', duracion_minutos: 0, name: '', module_id: Number(moduleId) });
    setVideoFile(null);
    router.back();
  };

  if (error) {
    return <p className="text-red-500 mt-2">{error}</p>;
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90"/>
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`flex-grow p-6 transition-all duration-300 ease-in-out ${showSidebar ? 'ml-64' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded w-full">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center text-purple-600 mb-6"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Volver
              </button>
              <FormField
                id="name"
                label="Nombre"
                type="text"
                value={session.name}
                onChange={handleChange}
              />
              <FormField
                id="duracion_minutos"
                label="Duración (minutos)"
                type="text"
                value={session.duracion_minutos.toString()}
                onChange={handleChange}
              />
              <div className="mb-4">
                <label htmlFor="video_enlace" className="block text-gray-700 mb-2">Video</label>
                <MediaUploadPreview onMediaUpload={handleVideoUpload} accept="video/*" label="Subir video" />
              </div>
            </form>
            <div className="items-center">
              <ActionButtons onSave={handleSubmit} onCancel={handleCancel} isEditing={true} />
            </div>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </main>
      </div>
    </div>
  );
};

export default SessionPage;
