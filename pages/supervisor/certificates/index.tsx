import Navbar from '@/components/Navbar';
import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/supervisor/SibebarSupervisor';
import './../../../app/globals.css';
import { CheckCircleIcon, PlusCircleIcon } from 'lucide-react';
import {
  ClipboardDocumentListIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import Modal from '../../../components/Admin/Modal';

interface Certification {
  certification_id: number;
  title: string;
  description: string;
  // ...
}

const CertificatesPage: React.FC = () => {
  const [showSideBar, setShowSidebar] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCertificate, setEditingCertificate] =
    useState<Certification | null>(null);

  // reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      instructions: '',
      total_questions: 0,
      duration_in_minutes: 60,
      default_passing_score: '',
      max_attempts: 0,
      is_active: true,
      show_results_immediately: true,
      questions: [],
    });
    resetCurrentQuestion();
    setErrors({});
  };

  const resetCurrentQuestion = () => {};

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingCertificate(null);
    // reset form | falta implementar
  };

  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    //falta implementar assignmentFormData
    //fatla implementar assignmentErrors
  };

  const handleAssignCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    // implementar lógica de petición
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleDownloadTemplate = () => {
    // plantilla
    alert('descarga de plantilla');
  };

  const renderFormField = (
    error: string | undefined,
    children: React.ReactNode
  ) => (
    <div className="space-y-1">
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );

  //obtener la fecha actual
  useEffect(() => {
    const now = new Date();
    //console.log('Fecha actual:', now);
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 7);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSideBar} setShowSidebar={setShowSidebar} />
        <main
          className={`flex-grow p-4 md:p-6 transition:all duration-300 ease-in-out`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Gestión de Certificados
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Administra los certificados para tus estudiantes desde esta
                  sección.
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                {/* plantilla para carga de preguntas masivas */}
                <button
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center px-4 py-2 text-white bg-purple-500 rounded-md"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  <span className="ml-2">Descargar Plantilla</span>
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {/* Icono de agregar certificado */}
                  <PlusCircleIcon className="h-4 w-4 mr-2" />
                  Crear Certificado
                </button>
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <ClipboardDocumentListIcon className="h-4 w-4 mr-2" />
                  Asignar Certificado
                </button>
              </div>
            </div>
            {/* contenido de certificados */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-center py-12">
                {/* logica de mostrar una animación de carga */}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal para crear/editar certificados */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={handleCloseModal}
          title={
            editingCertificate ? 'Editar Certificado' : 'Crear Certificado'
          }
          size="xl"
          closeOnBackdropClick={false}
        >
          {/* Contenido del modal para crear/editar certificados */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                {/* Información básica para la creación de un certificado */}
                <CheckCircleIcon className="h-5 w-5 mr-2 text-blue-600" />
                Información del Certificado
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderFormField(
                  errors.title,
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título del Certificado
                    </label>
                    <input
                      type="text"
                      required
                      value={''}
                      onChange={() => {}}
                      className={`block w-full focus:outline-none rounded-md shadow-sm p-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.title
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder="Ingrese el título del certificado"
                    />
                  </div>
                )}

                {renderFormField(
                  errors.duration_in_minutes,
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duración (en minutos)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={''}
                      onChange={() => {}}
                      className={`block w-full focus:outline-none rounded-md shadow-sm p-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.duration_in_minutes
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder="Ingrese la duración en minutos"
                    />
                  </div>
                )}

                {renderFormField(
                  errors.default_passing_score,
                  <div>
                    <label className="bloc text-sm font-medium text-gray-700 mb-1">
                      Puntuación mínima para aprobar
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={''}
                      onChange={() => {}}
                      className={`block w-full focus:outline-none rounded-md shadow-sm p-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.default_passing_score
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder="Ingrese la puntuación mínima para aprobar"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cantidad Total de Preguntas
                    {/*solo lectura - va a funcionar como contador */}
                  </label>
                  <input
                    type="number"
                    value={0}
                    readOnly
                    className={`block w-full focus:outline-none rounded-md shadow-sm p-2 border border-gray-300 bg-gray-100`}
                    placeholder="Cantidad total de preguntas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cantidad máxima de Intentos
                  </label>
                  <input
                    type="number"
                    value={0}
                    onChange={() => {}}
                    className="block w-full focus:outline-none rounded-md shadow-sm p-2 border border-gray-300"
                    placeholder="Ingrese la cantidad máxima de intentos"
                  />
                </div>
              </div>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción del Certificado
                  </label>
                  <textarea
                    value={''}
                    rows={3}
                    onChange={() => {}}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none"
                    placeholder="Ingrese una descripción para el certificado"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instrucciones para el Certificado
                  </label>
                  <textarea
                    value={''}
                    rows={3}
                    onChange={() => {}}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none"
                    placeholder="Ingrese las instrucciones para el certificado"
                  ></textarea>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => {}}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Mostrar resultados inmediatamente
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => {}}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Certificado activo
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* sección de preguntas */}
            <div className="bg-gray-50 p-6 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <CheckCircleIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Preguntas del Certificado
                </h3>
              </div>

              {errors.questions && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{errors.questions}</p>
                </div>
              )}

              {/* lista de preguntas */}
              <div className="mb-6 space-y-3">
                <h4 className="font-medium text-gray-700">
                  Preguntas agregadas:
                </h4>
              </div>

              {/* formulario para agregar nueva pregunta */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-700 mb-4">
                  Agregar Nueva Pregunta
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Texto de la Pregunta
                    </label>
                    <textarea
                      value={''}
                      rows={3}
                      onChange={() => {}}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none"
                      placeholder="Ingrese el texto de la pregunta"
                    ></textarea>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Pregunta
                    </label>
                    <select
                      value={''}
                      onChange={() => {}}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    >
                      {/*De momento solo se va a usar preguntas de timpo simple */}
                      <option value="">Seleccione un tipo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Puntuación de la Pregunta
                    </label>
                    <input
                      type="number"
                      value={0}
                      onChange={() => {}}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="Ingrese la puntuación de la pregunta"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Opciones
                    </label>
                    <button
                      type="button"
                      onClick={() => {}}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Agregar Opción
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal para asignar certificados */}
      {showAssignModal && (
        <Modal
          isOpen={showAssignModal}
          onClose={handleCloseAssignModal}
          title="Asignar Certificado"
          size="lg"
        >
          <form onSubmit={handleAssignCertificate} className="space-y-6">
            <div className="space-y-4">
              {/* Seleccionar un Certificado */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Seleccionar Certificado
                </label>
                <select
                  value={''}
                  onChange={() => {}}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value={0}>Seleccione un certificado</option>
                </select>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="bloc text-sm font-medium text-gray-700 mb-1">
                    Fecha de Inicio
                  </label>
                  <input
                    type="datetime-local"
                    value={''}
                    onChange={() => {}}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>

                <div>
                  <label className="bloc text-sm font-medium text-gray-700 mb-1">
                    Fecha de Vencimiento
                  </label>
                  <input
                    type="datetime-local"
                    value={''}
                    onChange={() => {}}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Aulas
                </label>
                <div className="border border-gray-300 rounded-md shadow-sm p-4 max-h-60 overflow-y-auto">
                  <div className="space-y-3">
                    <div
                      key={''}
                      className="flex items-center p-3 hover:bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        id={''}
                        checked={false}
                        onChange={() => {}}
                      />
                      <label
                        htmlFor={''}
                        className="ml-3 flex-1 cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Aula: {''}
                            </p>
                            <p className="text-xs text-gray-500">
                              Turno: {''} | Profesor {''}
                            </p>
                          </div>
                          <div className="text-xs text-gray-400">
                            '**Nombre de Empresa**'
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCloseAssignModal}
                disabled={false}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={false}
                className="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50"
              ></button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CertificatesPage;
