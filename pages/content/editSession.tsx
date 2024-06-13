import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBar';
import Footter from '../../components/Footter';
import { getSession, updateSession } from '../../services/sessionService';
import { uploadVideo } from '../../services/videoService';
import { getModules } from '../../services/moduleService';
import { Session } from '../../interfaces/Session';
import { Module } from '../../interfaces/Module';
import './../../app/globals.css';

const EditSession: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [session, setSession] = useState<Omit<Session, 'session_id'>>({
    video_enlace: '',
    duracion_minutos: 0,
    name: '',
    modul_id: 0
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
          modul_id: sessionRes.modul_id
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let videoUrl = session.video_enlace;
      if (videoFile) {
        videoUrl = await uploadVideo(videoFile);
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

  if (!session) {
    return <p>Loading...</p>;
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-100">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" toggleSidebar={toggleSidebar} />
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <main className={`p-6 flex-grow ${showSidebar ? 'ml-64' : ''} transition-all duration-300 ease-in-out pt-16`}>
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold mb-4">Editar Sesión</h1>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
              <input
                type="text"
                id="name"
                value={session.name}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="video_enlace" className="block text-gray-700 text-sm font-bold mb-2">Enlace del Video</label>
              <input
                type="file"
                id="video_enlace"
                accept="video/*"
                onChange={handleFileChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
              />
              {session.video_enlace && !videoFile && (
                <p className="text-sm text-gray-500 mt-2">El video actual se mantendrá si no subes uno nuevo.</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="duracion_minutos" className="block text-gray-700 text-sm font-bold mb-2">Duración (minutos)</label>
              <input
                type="text"
                id="duracion_minutos"
                value={session.duracion_minutos}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="modul_id" className="block text-gray-700 text-sm font-bold mb-2">Módulo</label>
              <select
                id="modul_id"
                value={session.modul_id}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value={0}>Seleccione un módulo</option>
                {modules.map(module => (
                  <option key={module.module_id} value={module.module_id}>
                    {module.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded">Guardar</button>
          </form>
        </div>
      </main>
      <Footter footerText="2024 EducaWeb. Todos los derechos reservados." />
    </div>
  );
};

export default EditSession;
