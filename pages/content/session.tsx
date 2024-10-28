import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Content/SideBar';
import { getSessions, deleteSession } from '../../services/sessionService';
import { getModules } from '../../services/moduleService';
import { Session } from '../../interfaces/Session';
import { Module } from '../../interfaces/Module';
import Link from 'next/link';
import Table from '../../components/Table';
import FloatingButton from '../../components/FloatingButton';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import './../../app/globals.css';

const SessionPage: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  const handleDelete = async (session_id: number) => {
    try {
      await deleteSession(session_id);
      setSessions(sessions.filter(session => session.session_id !== session_id));
    } catch (error) {
      console.error('Error deleting session:', error);
      setError('Error deleting session');
    }
  };

  const columns = [
    { label: 'Nombre', key: 'name' },
    { label: 'Módulo', key: 'module_name' },
    { label: '', key: 'actions' },
  ];

  const rows = sessions.map(session => ({
    name: <span>{session.name}</span>,
    module_name: <span>{modules.find(module => module.module_id === session.module_id)?.name || ''}</span>,
    actions: (
      <div className="flex space-x-2">
        <Link  href={`/content/editSession?id=${session.session_id}`}>
            <PencilIcon className="w-6 h-5 text-blue-500 cursor-pointer" />
        </Link>
        <button onClick={() => handleDelete(session.session_id)}>
          <TrashIcon className="w-6 h-5  text-red-500 cursor-pointer" />
        </button>
      </div>
    ),
  }));

  return (
    <ProtectedRoute>
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90"/>
      <div className="flex flex-1">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`flex-grow p-10 transition-all duration-300 ease-in-out ${showSidebar ? 'ml-64' : ''}`}>
          <div className="grid grid-cols-1 max-w-4xl mt-16">
            <div className="container mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Sesiones</h2>
                <FloatingButton link="/content/addSession" label="Agregar Sesión" />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <Table columns={columns} rows={rows} />
            </div>
          </div>
        </main>
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default SessionPage;
