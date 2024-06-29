import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import { getModulesByCourseId } from '../../services/courseService';
import { deleteModule } from '../../services/moduleService';
import { getEvaluations } from '../../services/evaluationService';
import Sidebar from '../../components/SideBar';
import { Evaluation } from '../../interfaces/Evaluation';
import ButtonComponent from '../../components/ButtonDelete';
import { Module } from '../../interfaces/Module';
import Link from 'next/link';
import './../../app/globals.css';
import { Disclosure } from '@headlessui/react';
import FloatingButton from '../../components/FloatingButton'; // Asegúrate de importar FloatingButton
import { ChevronUpIcon, ChevronDownIcon, PencilIcon, CheckCircleIcon, TrashIcon, ClipboardIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ModulesPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [showSidebar, setShowSidebar] = useState(true);
  const [modules, setModules] = useState<Module[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  useEffect(() => {
    if (id) {
      const fetchModulesAndEvaluations = async () => {
        try {
          const [modulesData, evaluationsData] = await Promise.all([
            getModulesByCourseId(Number(id)),
            getEvaluations()
          ]);
          setModules(modulesData);
          setEvaluations(evaluationsData);
        } catch (error) {
          setError('Error fetching modules and evaluations');
          console.error('Error fetching modules and evaluations:', error);
        }
      };

      fetchModulesAndEvaluations();
    }
  }, [id]);

  const handleDelete = async (module_id: number) => {
    try {
      await deleteModule(module_id);
      setModules(modules.filter(module => module.module_id !== module_id));
    } catch (error) {
      console.error('Error deleting module:', error);
      setError('Error deleting module');
    }
  };

  const getEvaluationName = (evaluation_id: number) => {
    const evaluation = evaluations.find(e => e.evaluation_id === evaluation_id);
    return evaluation ? evaluation.name : 'N/A';
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    localStorage.setItem('sidebarState', JSON.stringify(!showSidebar));
  };

  const handleCloseSession = () => {
    setSelectedSession(null);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`p-6 flex-grow transition-all duration-300 ease-in-out ${showSidebar ? 'ml-64' : ''}`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Módulos</h2>
            <FloatingButton link={`/content/addModule?courseId=${id}`} label="Añadir Módulo" />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex">
            <div className={`space-y-4 mb-10 transition-all duration-300 ease-in-out ${selectedSession ? 'w-2/5' : 'w-full'}`}>
              {modules.map((module) => (
                <div key={module.module_id} className="border border-gray-300 rounded-lg">
                  <Disclosure defaultOpen={true}>
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex justify-between items-center w-full px-6 py-4 text-sm font-medium text-left text-purple-1000 bg-gradient-purple focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 rounded-t-lg">
                          <div className="flex items-center">
                            {open ? (
                              <ChevronUpIcon className="w-5 h-5 text-purple-500 mr-2" />
                            ) : (
                              <ChevronDownIcon className="w-5 h-5 text-purple-500 mr-2" />
                            )}
                            <span className="flex-grow">{module.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex justify-between items-center mr-2">
                              <Link href={`/content/addSession?moduleId=${module.module_id}`}>
                                <ButtonComponent
                                  buttonLabel="Añadir Sesión"
                                  backgroundColor="bg-gradient-blue"
                                  textColor="text-white"
                                  fontSize="text-xs"
                                  buttonSize="py-2 px-7"
                                />
                              </Link>
                            </div>
                            <Link href={`/content/editModule?id=${module.module_id}`}>
                              <PencilIcon className="w-6 h-5 text-blue-500 cursor-pointer" />
                            </Link>
                            <button onClick={() => handleDelete(module.module_id)}>
                              <TrashIcon className="w-6 h-5 text-red-500 cursor-pointer" />
                            </button>
                            {module.is_active ? (
                              <CheckCircleIcon className="w-7 h-7 text-green-500" />
                            ) : (
                              <CheckCircleIcon className="w-7 h-7 text-gray-500" />
                            )}
                          </div>
                        </Disclosure.Button>
                        <Disclosure.Panel className="text-m text-gray-700 px-6 py-4 rounded-b-lg">
                          <div className="flex flex-col space-y-2">
                            {module.moduleSessions && module.moduleSessions.length > 0 ? (
                              module.moduleSessions.map((session) => (
                                <div
                                  key={session.session_id}
                                  className={`flex items-center cursor-pointer hover:bg-purple-100 p-2 rounded ${selectedSession?.session_id === session.session_id ? 'bg-purple-200' : ''}`}
                                  onClick={() => setSelectedSession(session)}
                                >
                                  <img src={session.video_enlace || 'https://via.placeholder.com/150'} className="w-16 h-16 rounded mr-4" />
                                  <div className="flex flex-col">
                                    <p className="font-medium">{session.name}</p>
                                    <p className="text-xs text-gray-500">{session.duracion_minutos} mins</p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p>No hay sesiones disponibles</p>
                            )}
                          </div>
                          <hr className="my-4" />
                          <Link href={`/content/evaluation/detailEvaluation?id=${module.evaluation_id}`}>
                            <p className="flex items-center py-4 px-6 mt-6 hover:bg-gray-100 rounded-lg">
                              <ClipboardIcon className="w-5 h-5 text-gray-500 mr-2" />
                              <strong><span className="ml-2">{getEvaluationName(module.evaluation_id)}</span></strong>
                            </p>
                          </Link>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                </div>
              ))}
            </div>
            {selectedSession && (
              <aside className="w-3/5 bg-white p-4 border-l border-gray-300 shadow-lg ml-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">{selectedSession.name}</h2>
                  <div className="flex items-center space-x-2">
                    <Link href={`/content/editSession?id=${selectedSession.session_id}`}>
                      <PencilIcon className="w-6 h-5 text-blue-500 cursor-pointer" />
                    </Link>
                    <button onClick={() => handleDelete(selectedSession.session_id)}>
                      <TrashIcon className="w-6 h-5 text-red-500 cursor-pointer" />
                    </button>
                    <button onClick={handleCloseSession}>
                      <XMarkIcon className="w-6 h-5 text-gray-500 cursor-pointer" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-center">
                  <video controls src={selectedSession.video_enlace} className="w-full h-auto"></video>
                </div>
              </aside>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModulesPage;
