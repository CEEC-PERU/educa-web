import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from './../../components/Content/SideBar';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import AlertComponent from '@/components/AlertComponent';
//import Link from 'next/link';
import './../../app/globals.css';

const FlashcardsPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [showSidebar, setShowSidebar] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
        <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
        <div className="flex flex-1 pt-16">
          <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
          <main
            className={`p-6 flex-grow ${showSidebar ? 'ml-20' : ''} transition-all duration-300 ease-in-out`}
          >
            {successMessage && (
              <AlertComponent
                type="success"
                message={successMessage}
                onClose={() => setSuccessMessage(null)}
              />
            )}
            {statusMessage && (
              <AlertComponent
                type="info" // Azul para información
                message={statusMessage}
                onClose={() => setStatusMessage(null)}
              />
            )}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Flashcards</h2>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex">
              <div
                className={`space-y-4 mb-10 transition-all duration-300 ease-in-out ${
                  selectedModule ? 'w-2/5' : 'w-full'
                }`}
              ></div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default FlashcardsPage;
