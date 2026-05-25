import React from "react";
import AppLayout from "../../components/layouts/AppLayout";
import type { NextPageWithLayout } from "../../types/next";
import {
  useProfessorsQuery,
  useLevelsQuery,
} from "@/features/professors/professors.queries";
import { getUserFacingMessage } from "@/lib/http/error";
import ButtonComponent from "../../components/ButtonComponent";
import ProfileCard from "../../components/ProfileCard";
import { useRouter } from "next/router";

const Profesores: NextPageWithLayout = () => {
  const router = useRouter();
  const professorsQuery = useProfessorsQuery();
  const levelsQuery = useLevelsQuery();

  const professors = professorsQuery.data ?? [];
  const levels = levelsQuery.data ?? [];
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

  return (
    <>
      <div className="flex justify-between items-center mb-4"></div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex justify-between items-center mb-6 mt-4">
        <ButtonComponent
          buttonLabel="Añadir Profesor"
          buttonroute="/content/addProfessor"
          backgroundColor="bg-gradient-blue"
          textColor="text-white"
          fontSize="text-xs"
          buttonSize="py-2 px-7"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {professors.map((professor) => (
          <ProfileCard
            key={professor.professor_id}
            name={professor.full_name}
            title={professor.especialitation}
            imageUrl={professor.image}
            level={getLevelName(professor.level_id)}
            onViewProfile={() => handleViewProfile(professor.professor_id)}
          />
        ))}
      </div>
    </>
  );
};

Profesores.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Profesores;
