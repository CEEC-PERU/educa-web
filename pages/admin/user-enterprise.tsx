import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBarAdmin';
import CardEnterprise from '../../components/CardEnterprise';
import ButtonComponent from '../../components/ButtonDelete';
import { getEnterprises } from '../../services/enterpriseService';
import { Enterprise } from '../../interfaces/Enterprise';
import Link from 'next/link';
import './../../app/globals.css';
import { useRouter } from 'next/router';

const EnterpriseList: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedState = localStorage.getItem('sidebarState');
    if (savedState !== null) {
      setShowSidebar(JSON.parse(savedState));
    }
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    localStorage.setItem('sidebarState', JSON.stringify(!showSidebar));
  };

  const fetchEnterprises = async () => {
    try {
      const data = await getEnterprises();
      setEnterprises(data);
    } catch (error) {
      setError('Error fetching enterprises');
      console.error('Error fetching enterprises:', error);
    }
  };

  useEffect(() => {
    fetchEnterprises();
  }, []);

  const handleButtonClick = (id: number) => {
    router.push(`/admin/detailEnterprise?id=${id}`);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`p-6 flex-grow ${showSidebar ? 'ml-64' : ''} transition-all duration-300 ease-in-out`}>
          <div className="flex justify-between items-center mb-4">
            <Link href="/enterprise/add">
              <ButtonComponent
                buttonLabel="Añadir Empresa"
                backgroundColor="bg-gradient-to-r from-blue-500 to-blue-400"
                textColor="text-white"
                fontSize="text-xs"
                buttonSize="py-2 px-7"
              />
            </Link>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {enterprises.map((enterprise) => (
              <CardEnterprise
                key={enterprise.enterprise_id}
                imageUrl={enterprise.image_log ?? '/placeholder-image.jpg'}
                title={enterprise.name}
                buttonLabel="Ver detalles"
                onButtonClick={() => handleButtonClick(enterprise.enterprise_id)}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EnterpriseList;
