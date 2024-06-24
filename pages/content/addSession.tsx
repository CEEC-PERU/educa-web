import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBar';
import MediaUploadPreview from '../../components/MediaUploadPreview';
import { getSessions, addSession, deleteSession } from '../../services/sessionService';
import { getModules } from '../../services/moduleService';
import { uploadVideo } from '../../services/videoService';
import { Session } from '../../interfaces/Session';
import { Module } from '../../interfaces/Module';
import FormField from '../../components/FormField';
import ActionButtons from '../../components/ActionButtons';
import ButtonComponent from '../../components/ButtonDelete';
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
  const [sessions, setSessions] = useState<Session[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchSessionsAndModules = async () => {
      try {
        const [sessionsRes, modulesRes] = await Promise.all([
          getSessions(),
          getModules()
        ]);
        setSessions(sessionsRes);
        setModules(modulesRes);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      }
    };

    fetchSessionsAndModules();
  }, []);

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
        const newSession = await addSession({ ...session, video_enlace: videoUrl });
        setSessions([...sessions, newSession]);
        setSession({ video_enlace: '', duracion_minutos: 0, name: '', module_id: 0 });
      } else {
        setError('Video file is required');
      }
    } catch (error) {
      console.error('Error adding session:', error);
      setError('Error adding session');
    }
  };

  const handleCancel = () => {
    setSession({ video_enlace: '', duracion_minutos: 0, name: '', module_id: 0 });
    setVideoFile(null);
  };

  const columns = [
    { label: 'Nombre', key: 'name' },
    { label: 'Módulo', key: 'module_name' },
    { label: '', key: 'actions' },
  ];

  const rows = sessions.map(session => ({
    name: <span>{session.name}</span>,
    module_name: <span>{modules.find(module => module.module_id === session.module_id)?.name || ''}</span>,
  }));

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`flex-grow p-6 transition-all duration-300 ease-in-out ${showSidebar ? 'ml-64' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mt-16">
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
              <div className="mb-4">
                <label htmlFor="video_enlace" className="block text-gray-700 mb-2">Video</label>
                <MediaUploadPreview onMediaUpload={handleVideoUpload} accept="video/*" label="Subir video" />
              </div>
              <FormField
                id="module_id"
                label="Módulo"
                type="select"
                value={session.module_id.toString()}
                onChange={handleChange}
                options={[{ value: '0', label: 'Seleccione un módulo' }, ...modules.map(module => ({ value: module.module_id.toString(), label: module.name }))]}
              />
              <div className="flex justify-end space-x-2 mt-4">
                <ButtonComponent buttonLabel="Guardar" onClick={handleSubmit} backgroundColor="bg-purple-500" textColor="text-white" fontSize="text-sm" buttonSize="py-3 px-4" />
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
