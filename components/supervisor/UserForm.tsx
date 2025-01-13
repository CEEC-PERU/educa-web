import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_USERS_COURSE_CREATE, API_USERS_CREATE } from '../../utils/Endpoints';
import AlertComponent from '../../components/AlertComponent';
import * as XLSX from 'xlsx';
import { useClassroomBySupervisor } from '../../hooks/useClassroom';
import { useCourseStudent } from '../../hooks/useCourseStudents';
import { UserGroupIcon } from '@heroicons/react/24/outline';
//usuarios formulario para registrar
const UserForm: React.FC<{ roleId: number; onClose: () => void; onSuccess: () => void; maxUsersAllowed: number }> = ({ roleId, onClose, onSuccess, maxUsersAllowed }) => {
  
  
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user, token } = useAuth();
  const userInfo = user as { id: number, enterprise_id: number };

  const [showCourses, setShowCourses] = useState(false);
  const [showClassroomAndCourses, setShowClassroomAndCourses] = useState(true);
  const [selectedClassroom, setSelectedClassroom] = useState<number | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); 
  const { classrooms, isLoading: loadingClassrooms } = useClassroomBySupervisor();
  const { courseStudent, isLoading: loadingCourses } = useCourseStudent();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({
    startDate: false,
    endDate: false,
    selectedEnterprise: false,
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const newUsers = jsonData.slice(1).map((row) => ({
        dni: row[0]?.toString(),
        password: row[0]?.toString(),
        is_active: true,
        role_id: roleId,
        enterprise_id: userInfo.enterprise_id,
      }));

      if (newUsers.length > maxUsersAllowed) {
        setError(`Excede el límite permitido. Solo puede registrar ${maxUsersAllowed} usuarios.`);
        return;
      }

      setUsers(newUsers);
      setError(null); // Limpiar errores si la carga es exitosa
    };

    reader.readAsArrayBuffer(file);
  };

  const handleCourseSelect = (courseId: number) => {
    setSelectedCourses((prevSelected) => 
      prevSelected.includes(courseId) ? prevSelected.filter(id => id !== courseId) : [...prevSelected, courseId]
    );
  };

  const handleClassroomSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const classroomId = Number(event.target.value); // Convertimos el valor seleccionado a un número
    setSelectedClassroom(classroomId);
  };
  
  const handleRegister = async () => {
    try {
      // Validación antes de registrar
      if (showCourses && selectedCourses.length === 0) {
        setError('Debe seleccionar al menos un curso.');
        return;
      }
  
      if (showClassroomAndCourses) {
        if (selectedClassroom === null) {
          setError('Debe seleccionar un aula.');
          return;
        }
        if (selectedCourses.length === 0) {
          setError('Debe seleccionar al menos un curso.');
          return;
        }
      }
      if (!users.length) {
        setError('Debe cargar un archivo con usuarios.');
        return;
      }

      
     

      if (users.length > maxUsersAllowed) {
        setError(`Excede el límite permitido. Solo puede registrar ${maxUsersAllowed} usuarios.`);
        return;
      }
  
      setIsLoading(true); // Iniciar el estado de carga
      // Crear el cuerpo de la solicitud para enviar al backend del courseuserinfo
      const requestBody = {
        users,
        course_id: selectedCourses, // Enviar el `course_id` seleccionado
        classroom_id: showClassroomAndCourses ? selectedClassroom : null, // Enviar `classroom_id` si se seleccionó un aula
        deadline : startDate,
      };
  
      console.log(requestBody)
      const response = await fetch(API_USERS_COURSE_CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Añadir el token de autenticación
        },
        body: JSON.stringify(requestBody), // Enviar `requestBody`
      });
  
    

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
  
      setSuccess('Usuarios registrados correctamente');
      onSuccess();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message); // Accede al mensaje del error
      } else {
        setError('Ocurrió un error inesperado.'); // Manejo genérico para errores no esperados
      }
    }finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-h-[500px] overflow-y-auto">
      <h1 className="font-bold text-black text-3xl text-center mb-6">Registrar nuevos usuarios</h1>

      <div className="mb-4 flex items-center justify-center space-x-4 text-black font-bold">
        <input
          type="file"
          accept=".xlsx, .xls"
          className="w-48 p-2 border rounded-lg shadow-sm"
          onChange={handleFileUpload}
        />
     


        <button
          onClick={() => { setShowClassroomAndCourses(true); setShowCourses(false); }}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Asignar Aula / Cursos
        </button>
      </div>
           
   
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 text-black">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b bg-gray-100 text-left text-black font-bold">Usuario</th>
              <th className="py-2 px-4 border-b bg-gray-100 text-left text-black font-bold">Contraseña</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="border-b text-black font-bold hover:bg-gray-50">
                <td className="py-2 px-4  text-black font-bold">{user.dni}</td>
                <td className="py-2 px-4  text-black font-bold">{user.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {showClassroomAndCourses && (
        <div className="font-bold text-lg text-black ">
          <h2 className="font-bold text-lg mt-6 mb-2 text-blue-700 ">Seleccionar Aula</h2>
          <select
            className="w-full p-2 border-4 border-gray-300 rounded-md "
            onChange={handleClassroomSelect}
            value={selectedClassroom ?? ''}
          >
            <option className="font-bold text-lg text-black" value="" disabled>Seleccione una aula</option>
            {loadingClassrooms ? (
              <option className="font-bold text-lg text-black">Cargando aulas...</option>
            ) : (
              classrooms.map((classroom) => (
                <option className="font-bold text-black " key={classroom.classroom_id} value={classroom.classroom_id}>
                  {classroom.code} - Empresa: {classroom.Enterprise.name} - Turno: {classroom.Shift.name} - Profesor: {classroom.User.userProfile.first_name} {classroom.User.userProfile.last_name}
                </option>
              ))
            )}
          </select>
           
        </div>
      )}

<div className="mb-4 flex items-center justify-center space-x-4 mt-5">
                <label className="block text-black text-md font-bold mb-2">Fecha Limite:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  onBlur={() => setTouchedFields((prev) => ({ ...prev, startDate: true }))}
                  className={`border-4 shadow appearance-none  rounded w-full py-2 px-3 text-black font-bold leading-tight focus:outline-none focus:shadow-outline ${touchedFields.startDate && !startDate ? 'border-red-500' : ''}`}
                />
              </div>

      {(showCourses || showClassroomAndCourses) && (
        <div>
          <h4 className="font-bold text-md mt-6  text-black ">Seleccionar Cursos</h4>
          {loadingCourses ? (
            <p>Cargando cursos...</p>
          ) : courseStudent.length > 0 ? (
            courseStudent.map((course) => (
              <div
                key={course.course_id}
                className={`flex items-center font-bold text-black mt-2 p-5 rounded-sm ${selectedCourses.includes(course.course_id) ? 'bg-green-500' : 'border-2 border-gray-500 '}`}
                onClick={() => handleCourseSelect(course.course_id)}
              >
                <img
                  src={course.Course.image || '/default-course-image.jpg'}
                  alt={course.Course.name}
                  className="h-12 w-12 mr-4 rounded-full"
                />
                <p className="text-gray-700">{course.Course.name}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No hay cursos asignados</p>
          )}
        </div>
      )}

{success && <AlertComponent type="success" message={success} onClose={() => setSuccess(null)} />}
      {error && <AlertComponent type="danger" message={error} onClose={() => setError(null)} />}

      <div className="mt-6 flex justify-center">
       
        <button
          onClick={handleRegister}
          disabled={isLoading} // Deshabilitar mientras está cargando
          className={`bg-yellow-500 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin h-5 w-5 text-white mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Registrando...
            </span>
          ) : (
            'Registrar'
          )}
        </button>
      </div>
    </div>
  );
};

export default UserForm;
