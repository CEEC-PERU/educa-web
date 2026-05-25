import React from "react";
import Link from "next/link";
import AppLayout from "../../components/layouts/AppLayout";
import type { NextPageWithLayout } from "../../types/next";
import {
  useProfessorsQuery,
  useLevelsQuery,
} from "@/features/professors/professors.queries";
import { getUserFacingMessage } from "@/lib/http/error";
import ProfessorCard from "@/components/professors/ProfessorCard";
import { useRouter } from "next/router";
import { PlusIcon } from "@heroicons/react/24/outline";

const ProfessorCardSkeleton = () => (
  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden animate-pulse">
    <div className="h-16 bg-gray-200" />
    <div className="flex flex-col items-center -mt-8 px-6 pb-6">
      <div className="w-16 h-16 rounded-full bg-gray-300 ring-4 ring-white" />
      <div className="mt-3 h-4 w-32 bg-gray-200 rounded" />
      <div className="mt-1.5 h-3 w-24 bg-gray-200 rounded" />
      <div className="mt-2 h-5 w-16 bg-gray-200 rounded-full" />
      <div className="mt-5 h-9 w-full bg-gray-100 rounded-xl" />
    </div>
  </div>
);

const Profesores: NextPageWithLayout = () => {
  const router = useRouter();
  const professorsQuery = useProfessorsQuery();
  const levelsQuery = useLevelsQuery();

  const professors = professorsQuery.data ?? [];
  const levels = levelsQuery.data ?? [];
  const isLoading = professorsQuery.isLoading || levelsQuery.isLoading;
  const error =
    professorsQuery.isError || levelsQuery.isError
      ? getUserFacingMessage(professorsQuery.error ?? levelsQuery.error)
      : null;

  const handleViewProfile = (id: number) => {
    router.push(`/content/detailProfessor?id=${id}`);
  };

  const getLevelName = (levelId: number) => {
    const level = levels.find((l) => l.level_id === levelId);
    return level ? level.name : "N/A";
  };

  if (isLoading) {
    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Profesores</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProfessorCardSkeleton key={i} />
          ))}
        </div>
      </>
    );
  }

  if (error) {
    return <p className="text-gray-500 text-center mt-20">{error}</p>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Profesores</h2>
        <Link
          href="/content/addProfessor"
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Añadir Profesor
        </Link>
      </div>

      {professors.length === 0 ? (
        <p className="text-gray-400 text-center mt-20">
          No hay profesores registrados.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {professors.map((professor) => (
            <ProfessorCard
              key={professor.professor_id}
              name={professor.full_name}
              title={professor.especialitation}
              imageUrl={professor.image}
              level={getLevelName(professor.level_id)}
              onViewProfile={() => handleViewProfile(professor.professor_id)}
            />
          ))}
        </div>
      )}
    </>
  );
};

Profesores.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Profesores;
