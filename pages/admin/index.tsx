import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBarAdmin';
import './../../app/globals.css';

const AdminPage: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredData, setFilteredData] = useState({
    totalUsers: 0,
    visitors: 0,
    studyingUsers: 0
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    localStorage.setItem('sidebarState', JSON.stringify(!showSidebar));
  };

  const handleExportCSV = () => {
    router.push('/admin/exportCsv'); 
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`flex-grow p-6 transition-all duration-300 ease-in-out ${showSidebar ? 'ml-64' : ''}`}>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form className="flex items-center space-x-4 mb-20">
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
              <div>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-6"
                >
                  Exportar CSV
                </button>
              </div>
            </form>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div className="bg-blue-100 p-6 rounded-lg shadow-md flex flex-col items-center">
              <div className="text-4xl font-bold text-blue-900">{filteredData.totalUsers}</div>
              <div className="text-gray-700">Usuarios inscritos</div>
            </div>
            <div className="bg-red-100 p-6 rounded-lg shadow-md flex flex-col items-center">
              <div className="text-4xl font-bold text-red-900">{filteredData.visitors}</div>
              <div className="text-gray-700">Usuarios visitantes</div>
            </div>
            <div className="bg-green-100 p-6 rounded-lg shadow-md flex flex-col items-center">
              <div className="text-4xl font-bold text-green-900">{filteredData.studyingUsers}</div>
              <div className="text-gray-700">Usuarios estudiando</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
