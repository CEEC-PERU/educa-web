import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/calidad/SibebarCalidad';
import ScreenSecurity from '../../../components/ScreenSecurity';
import ProtectedRoute from '../../../components/Auth/ProtectedRoute';
import { useRouter } from 'next/router';

interface ModuleResult {
  evaluation_id: number;
  module_id: number;
  puntaje: string;
  user_id: number;
  created_at: string;
}

interface Module {
  name: string;
  is_active: boolean;
  module_id: number;
  evaluation_id: number;
  created_at: string;
  ModuleResults: ModuleResult[];
  ResultAuditoria: any[];
}

interface Course {
  course_id: number;
  name: string;
  evaluation_id: number;
  courseModules: Module[];
}

const NotasIndex: React.FC = () => {
  const { user, profileInfo } = useAuth();
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
  const [observaciones, setObservaciones] = useState<string>(''); // Estado para guardar la nota de auditoría
  const [codllamada, setCodLlamada] = useState<string>(''); 
  const [resultado, setResultado] = useState<string>(''); 
  const [ , ] = useState<string>(''); 
  const [ , ] = useState<string>(''); 
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null); // Estado para guardar el módulo seleccionado
  const router = useRouter();
  const { user_id , course_id} = router.query;

  console.log("course_id",course_id)

  const toggleSidebar = () => setIsDrawerOpen(!isDrawerOpen);

  const handleToggleNotas = (courseId: number) => {
    setSelectedCourseId(selectedCourseId === courseId ? null : courseId);
  };

  // Fetch course data from API
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(`http://localhost:4100/api/resultado/datos/838/75`); // Replace with actual URL
        const data = await response.json();
        setCourseData(data[0]); // Assuming the data structure matches
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };

    fetchCourseData();
  }, []);

  const handleOpenModal = (moduleId: number) => {
    setSelectedModuleId(moduleId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setObservaciones('');
    setSelectedModuleId(null);
  };

  const handleSubmitAuditoria = () => {
    //no validar observaciones , no es obligatorio

    if (codllamada.trim() === '') {
      alert('Por favor, ingrese el codigo de llamada.');
      return;
    }

    if (resultado.trim() === '') {
      alert('Por favor, ingrese un resultado .');
      return;
    }
    // Aquí iría la lógica para guardar el resultado de auditoría en la base de datos
    // Por ejemplo, hacer una llamada a la API para registrar la nota de auditoría

    console.log(`Registrando nota de auditoría para el módulo ${selectedModuleId}: ${observaciones}`);



    // Cerrar el modal después de registrar
    handleCloseModal();
  };

  return (
    <ProtectedRoute>
      <div className="bg-white min-h-screen">
        <ScreenSecurity />
        <div className="relative z-10">
          <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
          <Sidebar showSidebar={true} setShowSidebar={() => { }} />
        </div>

        <div className="min-h-screen flex flex-col items-center p-6">
          <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {courseData && courseData.courseModules.map((module) => (
              <div key={module.module_id} className="bg-white p-6 rounded-xl shadow-lg transition transform hover:scale-105">
                <h3 className="text-2xl font-bold text-blue-600 mb-4">{module.name}</h3>
                <div className="space-y-4">
                  {module.ModuleResults.length > 0 ? (
                    module.ModuleResults.map((result, index) => (
                      <div key={index} className="flex justify-between items-center text-lg font-medium">
                        <span className="text-gray-800">Nota: <span className="font-semibold text-green-500">{result.puntaje}</span></span>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Resultado Auditoría: Vacío</span>
                      <button
                        className="btn bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4 py-2 transition-colors"
                        onClick={() => handleOpenModal(module.module_id)} // Abre el modal cuando se hace clic en el botón
                      >
                        Registrar Resultado Auditoría
                      </button>
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  {module.ResultAuditoria.length === 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Resultado Auditoría: Vacío</span>
                      <button
                        className="btn bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-4 py-2 transition-colors"
                        onClick={() => handleOpenModal(module.module_id)} // Abre el modal cuando se hace clic en el botón
                      >
                        Registrar Resultado Auditoría
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal para registrar la auditoría */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-lg w-96">
              <h3 className="text-xl font-bold mb-4">Registrar Resultado Auditoría</h3>
              
              <input
                type="input"
                value={codllamada}
                onChange={(e) => setCodLlamada(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
                placeholder="Cod.Llamada"
              />
              <input
                type="input"
                value={resultado}
                onChange={(e) => setResultado(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
                placeholder="Resultado"
              />
              <input
                type="text"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
                placeholder="Observaciones"
              />

              <div className="flex justify-end space-x-4">
                <button
                  className="btn bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-4 py-2"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
                <button
                  className="btn bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2"
                  onClick={handleSubmitAuditoria}
                >
                  Registrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default NotasIndex;
