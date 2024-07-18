import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Admin/SideBarAdmin';
import { getUsersByEnterprise } from '../../services/userService';
import { getUsersActivityCount } from '../../services/appSessionService';
import { getEnterprises } from '../../services/enterpriseService';
import { Enterprise } from '../../interfaces/Enterprise';
import AlertComponent from '../../components/AlertComponent';
import './../../app/globals.css';

const AdminPage: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [selectedEnterprise, setSelectedEnterprise] = useState<number | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredData, setFilteredData] = useState({
    totalUsers: 0,
    visitorUsers: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({
    startDate: false,
    endDate: false,
    selectedEnterprise: false,
  });
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

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    localStorage.setItem('sidebarState', JSON.stringify(!showSidebar));
  };

  const handleEnterpriseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEnterprise(Number(e.target.value));
    setTouchedFields((prev) => ({ ...prev, selectedEnterprise: true }));
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouchedFields({
      startDate: true,
      endDate: true,
      selectedEnterprise: true,
    });

    if (!startDate || !endDate || selectedEnterprise === null) {
      setError('Todos los campos deben ser llenados');
      return;
    }

    const fetchData = async () => {
      try {
        const [usersData, visitorData] = await Promise.all([
          getUsersByEnterprise(selectedEnterprise),
          getUsersActivityCount(startDate, endDate, selectedEnterprise)
        ]);

        setFilteredData({
          totalUsers: usersData.totalUsers,
          visitorUsers: visitorData.length
        });
        setError(null); // Clear the error message if data is successfully fetched
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      }
    };

    fetchData();
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`flex-grow p-6 transition-all duration-300 ease-in-out ${showSidebar ? 'ml-20' : ''}`}>
          {error && <AlertComponent type="danger" message={error} onClose={() => setError(null)} />}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form className="flex items-center space-x-4 mb-4" onSubmit={handleFilterSubmit}>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Filtrar por:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  onBlur={() => setTouchedFields((prev) => ({ ...prev, startDate: true }))}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${touchedFields.startDate && !startDate ? 'border-red-500' : ''}`}
                />
              </div>
              <div>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  onBlur={() => setTouchedFields((prev) => ({ ...prev, endDate: true }))}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-6 ${touchedFields.endDate && !endDate ? 'border-red-500' : ''}`}
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
                onBlur={() => setTouchedFields((prev) => ({ ...prev, selectedEnterprise: true }))}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${touchedFields.selectedEnterprise && !selectedEnterprise ? 'border-red-500' : ''}`}
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
              <div className="text-4xl font-bold text-red-900">{filteredData.visitorUsers}</div>
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
