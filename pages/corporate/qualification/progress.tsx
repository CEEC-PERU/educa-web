import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Corporate/CorporateSideBar';
import { useAuth } from '../../../context/AuthContext';
import { getStudentsByEnterprise } from '../../../services/courseStudent';
import Loader from '../../../components/Loader';
import ProgressBar from '../../../components/Corporate/ProgressBar';
import './../../../app/globals.css';

const CorporateUsers: React.FC = () => {
  const { user } = useAuth();
  const enterpriseId = user ? (user as { id: number; role: number; dni: string; enterprise_id: number }).enterprise_id : null;
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (enterpriseId) {
      const fetchStudents = async () => {
        setLoading(true);
        try {
          const response = await getStudentsByEnterprise(enterpriseId);
          console.log('Fetched students:', response); // Agregamos un console.log para verificar los datos
          setStudents(response);
        } catch (error) {
          console.error('Error fetching students:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchStudents();
    }
  }, [enterpriseId]);

  const filteredStudents = students.filter(student =>
    student.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewGrades = (student: any) => {
    router.push(`/corporate/qualification/${student.user_id}`);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={true} setShowSidebar={() => {}} />
        <main className="p-6 flex-grow transition-all duration-300 ease-in-out ml-20">
          <h2 className="text-2xl font-bold mb-6">Usuarios de la Empresa</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar por apellido"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            />
          </div>
          {loading ? (
            <Loader />
          ) : (
            <ul className="space-y-4">
              {filteredStudents.map(student => (
                <li key={student.user_id} className="flex flex-col md:flex-row justify-between items-center border p-4 rounded-md shadow-sm">
                  <div className="flex items-center w-full md:w-auto mb-4 md:mb-0 overflow-hidden">
                    <img src={student.profile_picture || 'default_profile_picture.png'} alt={`${student.first_name} ${student.last_name}`} className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0" />
                    <div className="ml-4 overflow-hidden">
                      <p className="font-semibold truncate">{student.first_name} {student.last_name}</p>
                      <p className="text-gray-500 truncate">{student.email}</p>
                    </div>
                  </div>
                  <div className="w-full md:w-auto flex items-center justify-between md:justify-end space-x-4">
                    <button
                      onClick={() => handleViewGrades(student)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Notas
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
};

export default CorporateUsers;
