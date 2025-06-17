import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/comercial/ComercialSidebar';
import { useAuth } from '../../context/AuthContext';
import { getUsersByEnterpriseWithSessions } from '../../services/courseStudent';
import Loader from '../../components/Loader';
import TopStudentsChart from '../../components/Corporate/TopStudent';
import './../../app/globals.css';
import { Profile } from '../../interfaces/UserInterfaces';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
const CorporateUsers: React.FC = () => {
  const { logout, user, profileInfo } = useAuth();
  const enterpriseId = user
    ? (user as { id: number; role: number; dni: string; enterprise_id: number })
        .enterprise_id
    : null;
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  let name = '';
  let uri_picture = '';

  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    uri_picture = profile.profile_picture!;
  }

  useEffect(() => {
    if (enterpriseId) {
      const fetchStudents = async () => {
        setLoading(true);
        try {
          const today = new Date();
          const firstDayOfMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
          )
            .toISOString()
            .split('T')[0];
          const lastDayOfMonth = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            0
          )
            .toISOString()
            .split('T')[0];
          setStartDate(firstDayOfMonth);
          setEndDate(lastDayOfMonth);
          const response = await getUsersByEnterpriseWithSessions(
            firstDayOfMonth,
            lastDayOfMonth,
            enterpriseId
          );
          setStudents(response);
          console.log(response);
        } catch (error) {
          console.error('Error fetching students:', error);
          setError('Error fetching students');
        } finally {
          setLoading(false);
        }
      };
      fetchStudents();
    }
  }, [enterpriseId]);

  useEffect(() => {
    if (enterpriseId && startDate && endDate) {
      const fetchStudents = async () => {
        setLoading(true);
        try {
          const response = await getUsersByEnterpriseWithSessions(
            startDate,
            endDate,
            enterpriseId
          );
          setStudents(response);
        } catch (error) {
          console.error('Error fetching students:', error);
          setError('Error fetching students');
        } finally {
          setLoading(false);
        }
      };
      fetchStudents();
    }
  }, [enterpriseId, startDate, endDate]);

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
        <Navbar
          bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90 "
          borderColor="border border-stone-300"
          user={user ? { profilePicture: uri_picture } : undefined}
        />
        <div className="flex flex-1 pt-16">
          <Sidebar showSidebar={true} setShowSidebar={() => {}} />
          <main
            className={`p-6 flex-grow transition-all duration-300 ease-in-out ml-20`}
          >
            <h2 className="text-2xl font-bold mb-6">Usuarios de la Empresa</h2>
            <div className="flex flex-wrap gap-4 mb-4">
              <TopStudentsChart students={students} />
              <div className="flex flex-col gap-4 w-full md:w-auto">
                <div>
                  <label className="block text-gray-700">
                    Fecha de inicio:
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Fecha de fin:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                  />
                </div>
              </div>
            </div>
            {loading ? (
              <Loader />
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="border-4 border-gray-300 p-4 rounded-md shadow-sm bg-purple-200"
                    >
                      <div className="flex items-center mb-2">
                        <img
                          src={
                            student.profile_picture ||
                            'https://res.cloudinary.com/dk2red18f/image/upload/v1713896612/CEEC/PERFIL/egwjjcrs2aon5hhtxabj.png'
                          }
                          alt={`${student.first_name} ${student.last_name}`}
                          className="w-12 h-12 rounded-full bg-gray-200"
                        />
                        <div className="ml-4">
                          <p className="font-semibold">
                            {student.first_name && student.last_name
                              ? `${student.first_name} ${student.last_name}`
                              : student.dni}
                          </p>

                          <p className="text-gray-500">{student.email}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-gray-600">Sesiones iniciadas:</p>
                        <p className="font-bold">{student.loginCount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CorporateUsers;
