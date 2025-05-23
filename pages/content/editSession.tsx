import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Content/SideBar';
import { getSession, updateSession } from '../../services/sessionService';
import { getModules } from '../../services/moduleService';
import { Session } from '../../interfaces/Session';
import { Module } from '../../interfaces/Module';
import './../../app/globals.css';
import FormField from '../../components/FormField';
import ActionButtons from '../../components/Content/ActionButtons'; // Importar el componente ActionButtons
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import AlertComponent from '../../components/AlertComponent';
import Loader from '../../components/Loader';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
const EditSession: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [session, setSession] = useState<Omit<Session, 'session_id'>>({
    duracion_minutos: 0,
    name: '',
    module_id: 0,
    video_enlace: ''
  });
  const [modules, setModules] = useState<Module[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Estado de carga
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
          duracion_minutos: sessionRes.duracion_minutos,
          name: sessionRes.name,
          video_enlace : sessionRes.video_enlace,
          module_id: sessionRes.module_id
        });
        setModules(modulesRes);
        setLoading(false); // Finaliza la carga
      } catch (error) {
        setError('Error fetching session details or modules');
        setLoading(false); // Finaliza la carga en caso de error
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateSession(id as string, session);
      setSuccess('Sesión actualizada exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Error updating session');
      console.error('Error updating session:', error);
    }
  };

  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!session) {
    return <p>Loading...</p>;
  }

  return (
    <ProtectedRoute>
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`p-6 flex-grow ${showSidebar ? 'ml-20' : ''} transition-all duration-300 ease-in-out flex flex-col md:flex-row md:space-x-4`}>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl rounded-lg flex-grow">
            {success && (
              <AlertComponent
                type="info"
                message={success}
                onClose={() => setSuccess(null)}
              />
            )}
            {error && <p className="text-red-500">{error}</p>}
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
          </form>
          <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0">
            <ActionButtons
              onSave={handleSaveClick}
              onCancel={() => router.back()}
              isEditing={true} // Para asegurarse de que el botón "Guardar" aparezca
              customSize={true}
            />
          </div>
        </main>
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default EditSession;
