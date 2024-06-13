import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBar';
import Footter from '../../components/Footter';
import { getSessions, addSession, deleteSession } from '../../services/sessionService';
import { getModules } from '../../services/moduleService';
import { uploadVideo } from '../../services/videoService'; // Importa el servicio de video
import { Session } from '../../interfaces/Session';
import { Module } from '../../interfaces/Module';
import Link from 'next/link';
import './../../app/globals.css';

const SessionPage: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [session, setSession] = useState<Omit<Session, 'session_id'>>({
    video_enlace: '',
    duracion_minutos: 0,
    name: '',
    modul_id: 0
  });
  const [sessions, setSessions] = useState<Session[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (videoFile) {
        const videoUrl = await uploadVideo(videoFile);
        const newSession = await addSession({ ...session, video_enlace: videoUrl });
        setSessions([...sessions, newSession]);
        setSession({ video_enlace: '', duracion_minutos: 0, name: '', modul_id: 0 });
      } else {
        setError('Video file is required');
      }
    } catch (error) {
      console.error('Error adding session:', error);
      setError('Error adding session');
    }
  };

  const handleDelete = async (session_id: number) => {
    try {
      await deleteSession(session_id);
      setSessions(sessions.filter(session => session.session_id !== session_id));
    } catch (error) {
      console.error('Error deleting session:', error);
      setError('Error deleting session');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`flex-grow p-6 transition-all duration-300 ease-in-out ${showSidebar ? 'ml-64' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto mt-16">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full">
              <h2 className="text-2xl font-bold mb-4">Ingresar Sesión</h2>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  id="name"
                  value={session.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="video_enlace" className="block text-gray-700 mb-2">Enlace del Video</label>
                <input
                  type="file"
                  id="video_enlace"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="duracion_minutos" className="block text-gray-700 mb-2">Duración (minutos)</label>
                <input
                  type="text"
                  id="duracion_minutos"
                  value={session.duracion_minutos}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="modulo_id" className="block text-gray-700 mb-2">Módulo</label>
                <select
                  id="modulo_id"
                  value={session.modul_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
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
            <div className="bg-white p-6 rounded shadow-md w-full">
              <h2 className="text-2xl font-bold mb-4">Lista de Sesiones</h2>
              {error && <p className="text-red-500">{error}</p>}
              <ul className="mt-4 space-y-2">
                {sessions.map(session => (
                  <li key={session.session_id} className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span>{session.name}</span>
                    <div>
                      <Link href={`/content/editSession?id=${session.session_id}`}>
                        <button className="mr-2 bg-yellow-500 text-white py-1 px-2 rounded">Editar</button>
                      </Link>
                      <button onClick={() => handleDelete(session.session_id)} className="bg-red-500 text-white py-1 px-2 rounded">Eliminar</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
      <Footter footerText="2024 EducaWeb. Todos los derechos reservados." />
    </div>
  );
};

export default SessionPage;
