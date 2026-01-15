import Navbar from '@/components/Navbar';
import React, { useState } from 'react';
import Sidebar from '../../../components/supervisor/SibebarSupervisor';
import './../../../app/globals.css';
import Modal from '../../../components/Admin/Modal';
//import { useRouter } from 'next/router';

const TrainingsPage: React.FC = () => {
  //const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  //revisar el estado con el que inicia ya que tiene que un objeto definido
  const [editingTraining, setEditingTraining] = useState(null);

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main
          className={`flex-grow p-4 md:p-6 transition-all duration-300 ease-in-out`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Programas de Formación
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Administra las capacitaciones para tus estudiantes desde esta
                  sección.
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                {/* contenido y eventos para creación de capacitaciones */}
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Crear Nuevo Programa
                </button>

                <button
                  onClick={() => setShowAssignModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Asignar Programa
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              {/* ========================= MAIN CONTENT ========================= */}
            </div>
          </div>
        </main>
      </div>
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={handleCloseModal}
          title={
            editingTraining
              ? 'Editar programa de formación'
              : 'Crear nuevo programa de formación'
          }
          size="xl"
          closeOnBackdropClick={false}
        >
          Dato
        </Modal>
      )}

      {showAssignModal && (
        <Modal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          title="Asignar programa de formación"
          size="lg"
          closeOnBackdropClick={false}
        >
          Dato
        </Modal>
      )}
    </div>
  );
};

export default TrainingsPage;
