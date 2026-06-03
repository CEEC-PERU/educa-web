import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import AppLayout from "@/components/layouts/AppLayout";
import { Profile } from "../../interfaces/User/UserInterfaces";
import { useEnterprise } from "../../hooks/useEnterprise";

const ProfileInfoItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="bg-white bg-opacity-20 backdrop-blur-sm p-5 rounded-xl shadow-lg transition-all hover:bg-opacity-25">
    <p className="text-xs font-semibold text-white uppercase tracking-wider mb-2 opacity-90">
      {label}
    </p>
    <p className="text-lg font-medium text-white break-words">{value}</p>
  </div>
);

const StudentProfile = () => {
  const { user, profileInfo } = useAuth();
  const { enterprise, error, isLoading } = useEnterprise();
  const router = useRouter();
  const [avatarError, setAvatarError] = useState(false);
  const [coverError, setCoverError] = useState(false);

  const profileData = {
    firstName: (profileInfo as Profile)?.first_name || "",
    lastName: (profileInfo as Profile)?.last_name || "",
    fullName:
      `${(profileInfo as Profile)?.first_name || ""} ${(profileInfo as Profile)?.last_name || ""}`.trim() ||
      "Usuario",
    email: (profileInfo as Profile)?.email || "-",
    phone: (profileInfo as Profile)?.phone || "-",
    avatarUrl:
      (profileInfo as Profile)?.profile_picture || "/default-avatar.png",
    coverUrl: enterprise?.enterprise.image_fondo || "/default-cover.png",
    companyName: enterprise?.enterprise.name || "-",
    dni: (user as { dni: string })?.dni || "-",
  };

  const handleEditClick = () => {
    router.push("/student/edit-profile");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-brandazul-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-brandazul-600">
        <div className="bg-white bg-opacity-20 backdrop-blur-sm p-8 rounded-xl shadow-lg text-center max-w-md">
          <p className="text-white text-lg font-semibold mb-4">
            Error al cargar el perfil
          </p>
          <p className="text-white text-sm mb-6 opacity-90">
            {error || "Ocurrió un error inesperado"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-brandm365-100 text-white px-6 py-2 rounded-full hover:bg-branda365-800 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-brandazul-600">
      <div className="relative w-full max-w-4xl mx-auto mb-8">
        <div className="relative w-full h-64 lg:h-80 overflow-hidden rounded-b-3xl">
          <img
            src={coverError ? "/default-cover.png" : profileData.coverUrl}
            alt="Cover image"
            className="w-full h-full object-cover"
            onError={() => setCoverError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50"></div>
          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center lg:items-start lg:pl-8 pb-6">
            <div className="relative h-32 w-32 lg:h-40 lg:w-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white">
              <img
                src={
                  avatarError ? "/default-avatar.png" : profileData.avatarUrl
                }
                alt={`${profileData.fullName} avatar`}
                className="w-full h-full object-cover"
                onError={() => setAvatarError(true)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 pb-12">
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start mb-8 gap-4">
          <h1 className="text-3xl lg:text-4xl text-white font-bold text-center lg:text-left">
            {profileData.fullName}
          </h1>
          <button
            onClick={handleEditClick}
            className="bg-brandm365-100 text-white px-6 py-2.5 rounded-full hover:bg-branda365-800 transition-all hover:shadow-lg font-medium"
          >
            Editar Perfil
          </button>
        </div>

        <h2 className="text-xl lg:text-2xl text-white font-bold mb-6">
          Datos Personales
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
          <ProfileInfoItem label="Nombres" value={profileData.firstName} />
          <ProfileInfoItem label="Apellidos" value={profileData.lastName} />
          <ProfileInfoItem label="Email" value={profileData.email} />
          <ProfileInfoItem label="Teléfono" value={profileData.phone} />
          <ProfileInfoItem label="Empresa" value={profileData.companyName} />
          <ProfileInfoItem label="Usuario" value={profileData.dni} />
        </div>
      </div>
    </div>
  );
};

StudentProfile.getLayout = (page: React.ReactNode) => (
  <AppLayout noPadding>{page}</AppLayout>
);

export default StudentProfile;
