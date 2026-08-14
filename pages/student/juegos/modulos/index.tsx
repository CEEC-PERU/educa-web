import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { useRouter } from "next/router";
import { Module } from "../../../../interfaces/Module";
import { getModulesByCourseId } from "../../../../services/courses/courseService";
import { useFlashcards } from "../../../../hooks/useFlashCards";

interface ModuleCardProps {
  module: Module;
  onPlay: () => void;
}

const ModuleCard = ({ module, onPlay }: ModuleCardProps) => {
  const { flashcards, isLoading } = useFlashcards(module.module_id);
  const hasFlashcards = !isLoading && flashcards.length > 0;

  return (
    <div className="bg-brandmorado-700 rounded-lg shadow-md p-6 flex flex-col justify-between">
      <h3 className="text-lg font-semibold text-white">{module.name}</h3>
      <div className="mt-4">
        {isLoading ? (
          <div className="h-10 bg-white/10 animate-pulse rounded-full" />
        ) : hasFlashcards ? (
          <button
            onClick={onPlay}
            className="w-full px-4 py-2 bg-white text-brand-300 font-bold rounded-full hover:bg-brand-200 transition-colors"
          >
            Jugar Flashcards
          </button>
        ) : (
          <p className="text-sm text-white/50 text-center py-2">
            Sin flashcards disponibles
          </p>
        )}
      </div>
    </div>
  );
};

const ModuleIndex = () => {
  const router = useRouter();
  const { courseid } = router.query;
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseid) return;
    const fetchModules = async () => {
      setIsLoading(true);
      try {
        const data = await getModulesByCourseId(Number(courseid));
        setModules(data);
      } catch {
        setError("No se pudieron cargar los módulos. Intenta nuevamente.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchModules();
  }, [courseid]);

  const navigateToFlashcard = (module_id: number) => {
    router.push({ pathname: "/student/juegos/modulos/flashcards", query: { module_id } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-student-bg-start via-student-bg-mid to-student-bg-end">
        <p className="text-white">Cargando módulos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-student-bg-start via-student-bg-mid to-student-bg-end">
        <p className="text-red-300">{error}</p>
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-student-bg-start via-student-bg-mid to-student-bg-end">
        <p className="text-white">Este curso no tiene módulos.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-student-bg-start via-student-bg-mid to-student-bg-end px-4 py-10 sm:px-8 sm:py-14">
      <div className="w-full max-w-screen-lg mx-auto">
        <button
          onClick={() => router.back()}
          className="text-white/70 hover:text-white text-sm mb-6 flex items-center gap-1 transition-colors"
        >
          ← Volver
        </button>
        <h1 className="text-2xl font-bold text-white mb-8">Módulos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <ModuleCard
              key={module.module_id}
              module={module}
              onPlay={() => navigateToFlashcard(module.module_id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

ModuleIndex.getLayout = (page: React.ReactNode) => (
  <AppLayout noPadding>{page}</AppLayout>
);

export default ModuleIndex;
