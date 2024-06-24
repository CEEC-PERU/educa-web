import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBar';
import { getSession, updateSession } from '../../services/sessionService';
import { uploadVideo } from '../../services/videoService';
import { getModules } from '../../services/moduleService';
import { Session } from '../../interfaces/Session';
import { Module } from '../../interfaces/Module';
import './../../app/globals.css';
import MediaUploadPreview from '../../components/MediaUploadPreview';
import FormField from '../../components/FormField';
import ButtonComponent from '../../components/ButtonDelete';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const EditSession: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [session, setSession] = useState<Omit<Session, 'session_id'>>({
    video_enlace: '',
    duracion_minutos: 0,
    name: '',
    module_id: 0
  });
  const [modules, setModules] = useState<Module[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionRes, modulesRes] = await Promise.all([
          getSession(id as string),
          getModules()
        ]);
        setSession({
          video_enlace: '',
          duracion_minutos: sessionRes.duracion_minutos,
          name: sessionRes.name,
          module_id: sessionRes.module_id
        });
        setModules(modulesRes);
      } catch (error) {
        setError('Error fetching session details or modules');
      }
    };
    if (id) {
      fetchData();
    }
  }, [id]);

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

  const handleFileChange = (file: File) => {
    setVideoFile(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let videoUrl = session.video_enlace;
      if (videoFile) {
        videoUrl = await uploadVideo(videoFile, 'Sesiones');
      }
      await updateSession(id as string, {
        ...session,
        video_enlace: videoUrl
      });
      router.push('/content/session');
    } catch (error) {
      setError('Error updating session');
      console.error('Error updating session:', error);
    }
  };

  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
  };

  const handleCancel = () => {
    router.push('/content/session');
  };

  if (!session) {
    return <p>Loading...</p>;
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" toggleSidebar={toggleSidebar} />
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <main className={`p-6 flex-grow ${showSidebar ? 'ml-64' : ''} transition-all duration-300 ease-in-out pt-16 mt-6`}>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center text-purple-600 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Volver
        </button>
        <div className="max-w-2xl p-6 rounded-lg">
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleSubmit}>
            <FormField
              id="name"
              label="Nombre"
              type="text"
              value={session.name}
              onChange={handleChange}
            />
            <div className="mb-4">
              <label htmlFor="video_enlace" className="block text-gray-700 text-sm font-bold mb-2">Enlace del Video</label>
              <MediaUploadPreview
                onMediaUpload={handleFileChange}
                accept="video/*"
                label="Subir video"
              />
            </div>
            <FormField
              id="duracion_minutos"
              label="Duración (minutos)"
              type="text"
              value={session.duracion_minutos.toString()}
              onChange={handleChange}
            />
            <FormField
              id="module_id"
              label="Módulo"
              type="select"
              value={session.module_id.toString()}
              onChange={handleChange}
              options={modules.map(module => ({ value: module.module_id.toString(), label: module.name }))}
            />
             <ButtonComponent buttonLabel="Guardar" onClick={handleSaveClick} backgroundColor="bg-purple-600" textColor="text-white" fontSize="text-sm" buttonSize="py-2 px-4" />
              
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditSession;
