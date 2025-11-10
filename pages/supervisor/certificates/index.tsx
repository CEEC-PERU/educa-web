import React from 'react';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/supervisor/SibebarSupervisor';
import { useRouter } from 'next/router';

const CertificateCourses: React.FC = () => {
  const router = useRouter();
  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50">
      <Navbar bgColor="bg-gradient-to-r from-blue-600 to-indigo-700" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={true} setShowSidebar={() => {}} />

        <main className="p-6 flex-grow ml-20">
          <div className="flex justify-between items-center mb-8 w-full">
            <div>
              <h1 className="text-3xl font-semibold text-gray-800">
                Gestión de Certificados
              </h1>
              <p className="text-gray-600 mt-2">
                Administra los certificados a tus classroms.
              </p>
            </div>

            <button
              onClick={() => router.push('/supervisor/certificates/create')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Crear Certificado
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CertificateCourses;
