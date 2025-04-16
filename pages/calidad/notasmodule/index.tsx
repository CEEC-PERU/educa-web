import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/calidad/SibebarCalidad';
import ScreenSecurity from '../../../components/ScreenSecurity';
import ProtectedRoute from '../../../components/Auth/ProtectedRoute';
import { API_RESPONSE} from "../../../utils/Endpoints";
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
  ResultAuditoria: {
    user_id :number;
    module_id: number;
    cod_llamada: string;
    resultado: boolean;
    observaciones: string;
  }[];
  
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

  //validar e hndleToglleNotas
  const handleToggleNotas = (courseId: number) => {
    setSelectedCourseId(selectedCourseId === courseId ? null : courseId);
  };

  // obtener datos del response 
 
const fetchCourseData = async () => {
  if (user_id && course_id) {
    try {
      const response = await fetch(`${API_RESPONSE}/datos/${user_id}/${course_id}`);
      const data = await response.json();
      setCourseData(data[0]);
      console.log('Course data:', data[0]);
    } catch (error) {
      console.error('Error fetching course data:', error);
    }
  }
};

useEffect(() => {
  fetchCourseData();
}, [user_id, course_id]);

  const handleOpenModal = (moduleId: number) => {
    setSelectedModuleId(moduleId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setObservaciones('');
    setSelectedModuleId(null);
  };

 

//envio post a base de datos 
  const handleSubmitAuditoria = async () => {
    if (codllamada.trim() === '') {
      alert('Por favor, ingrese el código de llamada.');
      return;
    }
  
    if (resultado.trim() === '') {
      alert('Por favor, seleccione un resultado.');
      return;
    }
  
    const payload = {
      user_id: Number(user_id),
      module_id: selectedModuleId,
      cod_llamada: codllamada,
      resultado: resultado === "true", // convertir a boolean
      observaciones: observaciones
    };
  
    try {
      const response = await fetch( `${API_RESPONSE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        alert('Resultado registrado correctamente');
        handleCloseModal();
        setCodLlamada('');
        setResultado('');
        setObservaciones('');
        fetchCourseData(); // Refrescar los datos después de registrar
      } else {
        alert('Error al registrar resultado');
      }
    } catch (error) {
      console.error('Error enviando datos:', error);
      alert('Error en la conexión al servidor');
    }
  };
  


  return (
  
      <div className="bg-white min-h-screen">
        <ScreenSecurity />
        <div className="relative z-10 pt-16">
          <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
          <Sidebar showSidebar={true} setShowSidebar={() => { }} />
        </div>

        <div className="min-h-screen flex flex-col items-center p-20">
          <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {courseData && courseData.courseModules.map((module) => (
              <div key={module.module_id} className="bg-white p-6 rounded-xl shadow-lg transition transform hover:scale-105">
                <h3 className="text-2xl font-bold text-blue-600 mb-4">{module.name}</h3>
                
                <div className="space-y-4">
  {/* Mostrar las notas si existen */}
  {module.ModuleResults.length > 0 && module.ModuleResults.map((result, index) => (
    <div key={index} className="flex justify-between items-center text-lg font-medium">
      <span className="text-gray-800">
        Nota: <span className="font-semibold text-green-500">{result.puntaje}</span>
      </span>
    </div>
  ))}

  {/* Mostrar resultado de auditoría si existe */}
  {module.ResultAuditoria.length > 0 ? (
    <div className="text-gray-700">
       <p><strong>Observaciones:</strong> {module.ResultAuditoria[0].cod_llamada|| 'Ninguno'}</p>
      <p><strong>Resultado Auditoría:</strong> {module.ResultAuditoria[0].resultado ? 'Aprobado' : 'Desaprobado'}</p>
      <p><strong>Observaciones:</strong> {module.ResultAuditoria[0].observaciones || 'Ninguna'}</p>
    </div>
  ) : (
    // Si no hay resultado de auditoría, mostrar botón para registrar
    <div className="flex justify-between items-center pt-5">
      <button
        className="btn bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-4 py-2 transition-colors"
        onClick={() => handleOpenModal(module.module_id)}
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
           

            <div className="bg-white p-10 rounded-2xl shadow-md hover:shadow-lg transition-transform transform hover:scale-105 border border-gray-200">

              <h3 className="text-xl font-bold mb-4">Registrar Resultado Auditoría</h3>
              
              <input
                type="input"
                value={codllamada}
                onChange={(e) => setCodLlamada(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
                placeholder="Cod.Llamada"
              />
            
            <select
  value={resultado}
  onChange={(e) => setResultado(e.target.value)}
  className="w-full p-2 border border-gray-300 rounded mb-4"
>
  <option value="">Seleccionar Resultado</option>
  <option value="true">Aprobado</option>
  <option value="false">Desaprobado</option>
</select>

<textarea
  value={observaciones}
  onChange={(e) => setObservaciones(e.target.value)}
  className="w-full p-2 border border-gray-300 rounded mb-4"
  placeholder="Observaciones (opcional)"
  rows={3}
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
 
  );
};

export default NotasIndex;
