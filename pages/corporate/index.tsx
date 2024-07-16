import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Corporate/CorporateSideBar';
import { useAuth } from '../../context/AuthContext';
import { getUsersByEnterpriseWithSessions } from '../../services/courseStudent';
import Loader from '../../components/Loader';
import './../../app/globals.css';

const CorporateUsers: React.FC = () => {
  const { user } = useAuth();
  const enterpriseId = user ? (user as { id: number; role: number; dni: string; enterprise_id: number }).enterprise_id : null;
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (enterpriseId && startDate && endDate) {
      const fetchUsers = async () => {
        setLoading(true);
        try {
          const response = await getUsersByEnterpriseWithSessions(startDate, endDate, enterpriseId);
          if (Array.isArray(response)) {
            setUsers(response);
          } else {
            setError('Unexpected response format');
          }
        } catch (error) {
          console.error('Error fetching users:', error);
          setError('Error fetching users');
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }
  }, [enterpriseId, startDate, endDate]);

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={true} setShowSidebar={() => {}} />
        <main className={`p-6 flex-grow transition-all duration-300 ease-in-out ml-20`}>
          <h2 className="text-2xl font-bold mb-6">Usuarios de la Empresa</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Fecha de inicio:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Fecha de fin:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            />
          </div>
          {loading ? (
            <Loader />
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <ul>
              {users.map((user) => (
                <li key={user.id}>{user.dni} - Ingresos: {user.loginCount}</li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
};

export default CorporateUsers;
