import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Admin/SideBarAdmin';
import { getUsersByEnterprise } from '../../services/userService';
import { getEnterprises } from '../../services/enterpriseService';
import { Enterprise } from '../../interfaces/Enterprise';
import './../../app/globals.css';

const AdminPage: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [selectedEnterprise, setSelectedEnterprise] = useState<number | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredData, setFilteredData] = useState({
    totalUsers: 0
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedState = localStorage.getItem('sidebarState');
    if (savedState !== null) {
      setShowSidebar(JSON.parse(savedState));
    }

    const fetchEnterprises = async () => {
      try {
        const data = await getEnterprises();
        setEnterprises(data);
      } catch (error) {
        console.error('Error fetching enterprises:', error);
      }
    };

    fetchEnterprises();
  }, []);

  useEffect(() => {
    if (selectedEnterprise !== null) {
      const fetchData = async () => {
        try {
          const data = await getUsersByEnterprise(selectedEnterprise);
          setFilteredData(data);
        } catch (error) {
          console.error('Error fetching users by enterprise:', error);
          setError('Error fetching users');
        }
      };

      fetchData();
    }
  }, [selectedEnterprise]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    localStorage.setItem('sidebarState', JSON.stringify(!showSidebar));
  };

  const handleEnterpriseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEnterprise(Number(e.target.value));
  };


  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`flex-grow p-6 transition-all duration-300 ease-in-out ${showSidebar ? 'ml-20' : ''}`}>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form className="flex items-center space-x-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Filtrar por:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-6"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-6"
                >
                  Filtrar
                </button>
              </div>
            </form>
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Empresa:</label>
                <select
                  value={selectedEnterprise || ''}
                  onChange={handleEnterpriseChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>Seleccione una empresa</option>
                  {enterprises.map(enterprise => (
                    <option key={enterprise.enterprise_id} value={enterprise.enterprise_id}>
                      {enterprise.name}
                    </option>
                  ))}
                </select>
              </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div className="bg-blue-100 p-6 rounded-lg shadow-md flex flex-col items-center">
              <div className="text-4xl font-bold text-blue-900">{filteredData.totalUsers}</div>
              <div className="text-gray-700">Usuarios inscritos</div>
            </div>
            <div className="bg-red-100 p-6 rounded-lg shadow-md flex flex-col items-center">
              <div className="text-4xl font-bold text-red-900">{0}</div>
              <div className="text-gray-700">Usuarios visitantes</div>
            </div>
            <div className="bg-green-100 p-6 rounded-lg shadow-md flex flex-col items-center">
              <div className="text-4xl font-bold text-green-900">{0}</div>
              <div className="text-gray-700">Usuarios estudiando</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
