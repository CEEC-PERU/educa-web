'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/supervisor/SibebarSupervisor';
import { useRouter } from 'next/router';
import { useTrainingContent } from '@/hooks/resultado/useTrainingContent';
import { TrainingContent } from '@/interfaces/Training/Training';
import TrainingContentCard from '@/components/Training/TrainingContentCard';
export default function DayDetailPage() {
  const router = useRouter();
  const { programId, dayId } = router.query;
  const [showSidebar, setShowSidebar] = useState(true);
  const { trainingContents, loading, error, refetch } = useTrainingContent(
    dayId ? Number(dayId) : undefined,
  );

  const openCreateModal = () => {};

  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main
          className={`p-6 flex-grow transition-all duration-300 ease-in-out ${showSidebar ? 'ml-20' : 'ml-0'}`}
        >
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="mb-4 text-gray-600 hover:text-gray-800"
            >
              ← Volver a Días
            </button>
          </div>

          <div className="mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Contenidos del Día de Formación
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Gestiona los contenidos de formación para el día seleccionado.
                </p>
              </div>

              <div className="mt-4 sm:mt-0">
                <button
                  onClick={openCreateModal}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Añadir Nuevo Contenido
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12"></div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
              </div>
            ) : trainingContents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No hay contenidos de formación para este día.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trainingContents.map((content: TrainingContent) => (
                  <TrainingContentCard
                    key={content.content_id}
                    content={content}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
