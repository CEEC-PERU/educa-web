// pages/student/studentList.js
import React from 'react';
import { useAuth } from '../../context/AuthContext';
const StudentIndex : React.FC = () => {
  const { logout } = useAuth();

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="p-8 rounded-lg shadow-md max-w-md w-full bg-gray-50">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Página principal de Usuario Estudiante
        </h1>
        <button 
          onClick={logout} 
          className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
    </div>
  );
}

export default StudentIndex;
