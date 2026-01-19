import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/supervisor/SibebarSupervisor';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useTrainingDay } from '@/hooks/resultado/useTrainingDay';
import { useRouter } from 'next/router';

const TrainingDaysPage: React.FC = () => {
  const router = useRouter();
  const { programId } = router.query;
  const [showSidebar, setShowSidebar] = useState(true);
  const { trainingDays, loading, error, refetch } = useTrainingDay(
    programId ? Number(programId) : undefined,
  );

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen flex flex-col bg-gradient to-b">
        <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
        <div className="flex flex-1 pt-16">
          <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
          <main className="p-6 flex-grow transition-all duration-300 ease-in-out ml-20">
            <div className="mb-6">
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
              >
                ← Volver a Programas de Formación
              </button>
            </div>

            {/* cards de dias de formacion */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <p>Cargando días de formación...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : trainingDays.length === 0 ? (
                <p>No hay días de formación disponibles.</p>
              ) : (
                trainingDays.map((day) => (
                  <div
                    key={day.day_id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/supervisor/trainings/${programId}/days/${day.day_id}`,
                      )
                    }
                  >
                    <h2 className="text-xl font-bold mb-2">{day.title}</h2>
                    <p className="text-gray-600">{day.description}</p>
                  </div>
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default TrainingDaysPage;
