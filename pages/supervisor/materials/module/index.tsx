import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../../../components/Navbar';
import { updateModuleStatus, getModule } from '../../../../services/moduleService';
import { getModulesByCourseId } from '../../../../services/courseService';
import { deleteModule } from '../../../../services/moduleService';
import { deleteSession } from '../../../../services/sessionService';
import { getEvaluations } from '../../../../services/evaluationService';
import Sidebar from './../../../../components/supervisor/SibebarSupervisor';
import { Evaluation } from '../../../../interfaces/Evaluation';
import ButtonComponent from '../../../../components/ButtonComponent';
import { Module } from '../../../../interfaces/Module';
import Link from 'next/link';
import './../../../../app/globals.css';
import { Disclosure } from '@headlessui/react';
import FloatingButton from '../../../../components/FloatingButton';
import { ChevronUpIcon, ChevronDownIcon, PencilIcon, CheckCircleIcon, TrashIcon, ClipboardIcon, XMarkIcon } from '@heroicons/react/24/outline';
import ModalConfirmation from '../../../../components/ModalConfirmation';
import useModal from '../../../../hooks/useModal';
import AlertComponent from '../../../../components/AlertComponent';
import Modal from '../../../../components/Admin/Modal';
import AddModuleForm from './../../../content/addModule';
import EditModuleForm from './../../../content/editModule';
import ReactTooltip from 'react-tooltip';
import ProtectedRoute from '../../../../components/Auth/ProtectedRoute';

const ModulesPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [showSidebar, setShowSidebar] = useState(true);
  const [modules, setModules] = useState<Module[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [moduleToDelete, setModuleToDelete] = useState<number | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<number | null>(null);
  const [moduleToEdit, setModuleToEdit] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const { isVisible: isModuleModalVisible, showModal: showModuleModal, hideModal: hideModuleModal } = useModal();
  const { isVisible: isSessionModalVisible, showModal: showSessionModal, hideModal: hideSessionModal } = useModal();
  const { isVisible: isAddModuleModalVisible, showModal: showAddModuleModal, hideModal: hideAddModuleModal } = useModal();
  const { isVisible: isEditModuleModalVisible, showModal: showEditModuleModal, hideModal: hideEditModuleModal } = useModal();

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

    if (router.query.success) {
      setSuccessMessage(router.query.success as string);
      setTimeout(() => setSuccessMessage(null), 5000); // Ocultar la alerta después de 5 segundos
    }
  }, [id, router.query.success]);

  const handleDeleteModule = async () => {
    if (moduleToDelete !== null) {
      try {
        await deleteModule(moduleToDelete);
        setModules(modules.filter(module => module.module_id !== moduleToDelete));
        setSuccessMessage('Registro eliminado correctamente');
        setTimeout(() => setSuccessMessage(null), 5000); // Ocultar la alerta después de 5 segundos
        setModuleToDelete(null);
        hideModuleModal();
      } catch (error) {
        console.error('Error deleting module:', error);
        setError('Error deleting module');
      }
    }
  };

  const handleDeleteSession = async () => {
    if (sessionToDelete !== null) {
      try {
        await deleteSession(sessionToDelete);
        setModules(modules.map(module => ({
          ...module,
          moduleSessions: module.moduleSessions?.filter(session => session.session_id !== sessionToDelete) || []
        })));
        setSuccessMessage('Registro eliminado correctamente');
        setTimeout(() => setSuccessMessage(null), 5000); // Ocultar la alerta después de 5 segundos
        setSessionToDelete(null);
        hideSessionModal();
      } catch (error) {
        console.error('Error deleting session:', error);
        setError('Error deleting session');
      }
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

  const handleAddModuleSuccess = async () => {
    hideAddModuleModal();
    setSuccessMessage('Módulo creado exitosamente.');
    setTimeout(() => setSuccessMessage(null), 5000);
    if (id) {
      try {
        const modulesData = await getModulesByCourseId(Number(id));
        setModules(modulesData);
      } catch (error) {
        console.error('Error fetching modules:', error);
        setError('Error fetching modules');
      }
    }
  };

  const handleEditModuleSuccess = async () => {
    hideEditModuleModal();
    setSuccessMessage('Módulo actualizado exitosamente.');
    setTimeout(() => setSuccessMessage(null), 5000);
    if (id) {
      try {
        const modulesData = await getModulesByCourseId(Number(id));
        setModules(modulesData);
      } catch (error) {
        console.error('Error fetching modules:', error);
        setError('Error fetching modules');
      }
    }
  };

  const handleToggleModuleStatus = async (moduleId: number, currentStatus: boolean) => {
    try {
      await updateModuleStatus(moduleId, !currentStatus);
      setModules(modules.map(module => module.module_id === moduleId ? { ...module, is_active: !currentStatus } : module));
      setStatusMessage(`Módulo ${!currentStatus ? 'activado' : 'desactivado'}`);
      setTimeout(() => setStatusMessage(null), 5000); // Ocultar la alerta después de 5 segundos
    } catch (error) {
      console.error('Error updating module status:', error);
      setError('Error updating module status');
    }
  };

  return (
    <ProtectedRoute>
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`p-6 flex-grow transition-all duration-300 ease-in-out ${showSidebar ? 'ml-20' : ''}`}>
          {successMessage && (
            <AlertComponent
              type="success"
              message={successMessage}
              onClose={() => setSuccessMessage(null)}
            />
          )}
          {statusMessage && (
            <AlertComponent
              type="info" // Azul para información
              message={statusMessage}
              onClose={() => setStatusMessage(null)}
            />
          )}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Módulos</h2>
            <FloatingButton onClick={showAddModuleModal} label="Añadir Módulo" />
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
                              <ButtonComponent
                                buttonLabel="Añadir Sesión"
                                buttonroute={`/content/addSession?moduleId=${module.module_id}`}
                                backgroundColor="bg-gradient-blue"
                                textColor="text-white"
                                fontSize="text-xs"
                                buttonSize="py-2 px-7"
                              />
                            </div>
                            <button onClick={() => {
                              setModuleToEdit(module.module_id);
                              showEditModuleModal();
                            }}>
                              <PencilIcon className="w-6 h-5 text-blue-500 cursor-pointer" />
                            </button>
                            <button onClick={() => {
                              setModuleToDelete(module.module_id);
                              showModuleModal();
                            }}>
                              <TrashIcon className="w-6 h-5 text-red-500 cursor-pointer" />
                            </button>
                            <button
                              onClick={() => handleToggleModuleStatus(module.module_id, module.is_active)}
                              data-tooltip-id={`statusTooltip-${module.module_id}`}
                              data-tooltip-content={module.is_active ? 'Desactivar' : 'Activar'}
                            >
                              {module.is_active ? (
                                <CheckCircleIcon className="w-7 h-7 text-green-500 cursor-pointer" />
                              ) : (
                                <CheckCircleIcon className="w-7 h-7 text-gray-500 cursor-pointer" />
                              )}
                            </button>
                            <ReactTooltip id={`statusTooltip-${module.module_id}`} place="top" />
                          </div>
                        </Disclosure.Button>
                        <Disclosure.Panel className="text-m text-gray-700 px-6 py-4 rounded-b-lg">
                          <div className="flex flex-col space-y-2">
                            {module.moduleSessions?.length ? (
                              module.moduleSessions.map((session) => (
                                <div
                                  key={session.session_id}
                                  className={`flex items-center cursor-pointer hover:bg-purple-100 p-2 rounded ${selectedSession?.session_id === session.session_id ? 'bg-purple-200' : ''}`}
                                  onClick={() => setSelectedSession(session)}
                                >
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
                    <button onClick={() => {
                      setSessionToDelete(selectedSession.session_id);
                      showSessionModal();
                    }}>
                      <TrashIcon className="w-6 h-5 text-red-500 cursor-pointer" />
                    </button>
                    <button onClick={handleCloseSession}>
                      <XMarkIcon className="w-6 h-5 text-gray-500 cursor-pointer" />
                    </button>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </main>
      </div>
      <ModalConfirmation
        show={isModuleModalVisible}
        onClose={hideModuleModal}
        onConfirm={handleDeleteModule}
      />
      <ModalConfirmation
        show={isSessionModalVisible}
        onClose={hideSessionModal}
        onConfirm={handleDeleteSession}
      />
      <Modal
        show={isAddModuleModalVisible}
        onClose={hideAddModuleModal}
        title="Añadir Módulo"
      >
        <AddModuleForm courseId={Number(id)} onClose={hideAddModuleModal} onSuccess={handleAddModuleSuccess} />
      </Modal>
      {moduleToEdit !== null && ( // Asegúrate de que moduleToEdit no sea null
        <Modal
          show={isEditModuleModalVisible}
          onClose={hideEditModuleModal}
          title="Editar Módulo"
        >
          <EditModuleForm moduleId={moduleToEdit.toString()} onClose={hideEditModuleModal} onSuccess={handleEditModuleSuccess} />
        </Modal>
      )}
    </div>
    </ProtectedRoute>
  );
};

export default ModulesPage;
