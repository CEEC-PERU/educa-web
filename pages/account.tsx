import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { useEnterprise } from "../hooks/useEnterprise";
import AppLayout from "@/components/layouts/AppLayout";
import { Profile } from "../interfaces/User/UserInterfaces";
import type { NextPageWithLayout } from "../types/next";
import { PencilIcon, HomeIcon } from "@heroicons/react/24/outline";

const DASHBOARD_BY_ROLE: Record<number, string> = {
  1: "/student",
  2: "/corporate",
  3: "/content",
  4: "/admin",
  5: "/admincorporative",
  6: "/supervisor",
  7: "/calidad",
  8: "/comercial",
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-white bg-opacity-20 backdrop-blur-sm p-5 rounded-xl shadow-lg">
    <p className="text-xs font-semibold text-white uppercase tracking-wider mb-2 opacity-90">
      {label}
    </p>
    <p className="text-lg font-medium text-white break-words">{value}</p>
  </div>
);

const AccountPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { user, profileInfo } = useAuth();
  const { enterprise, isLoading, error } = useEnterprise();
  const [avatarError, setAvatarError] = useState(false);
  const [coverError, setCoverError] = useState(false);

  const role = (user as { role: number } | null)?.role;
  const dashboardHref = role !== undefined ? (DASHBOARD_BY_ROLE[role] ?? "/") : "/";

  const profile = profileInfo as Profile | null;
  const fullName =
    `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim() || "Usuario";

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-brandazul-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4" />
          <p className="text-white text-lg">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-brandazul-600">
        <div className="bg-white bg-opacity-20 backdrop-blur-sm p-8 rounded-xl text-center max-w-md">
          <p className="text-white text-lg font-semibold mb-4">
            Error al cargar el perfil
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
            src={coverError ? "/default-cover.png" : (enterprise?.enterprise.image_fondo ?? "/default-cover.png")}
            alt=""
            className="w-full h-full object-cover"
            onError={() => setCoverError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center lg:items-start lg:pl-8 pb-6">
            <div className="relative h-32 w-32 lg:h-40 lg:w-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white">
              <img
                src={avatarError ? "/default-avatar.png" : (profile?.profile_picture ?? "/default-avatar.png")}
                alt={fullName}
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
            {fullName}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/student/edit-profile")}
              title="Editar perfil"
              className="p-2.5 rounded-full bg-brandm365-100 text-white hover:bg-branda365-800 transition-all hover:shadow-lg"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => router.push(dashboardHref)}
              title="Ir al Dashboard"
              className="p-2.5 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all"
            >
              <HomeIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <h2 className="text-xl lg:text-2xl text-white font-bold mb-6">
          Datos Personales
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
          <InfoItem label="Nombres" value={profile?.first_name ?? "-"} />
          <InfoItem label="Apellidos" value={profile?.last_name ?? "-"} />
          <InfoItem label="Email" value={profile?.email ?? "-"} />
          <InfoItem label="Teléfono" value={profile?.phone ?? "-"} />
          <InfoItem label="Empresa" value={enterprise?.enterprise.name ?? "-"} />
          <InfoItem label="Usuario" value={(user as { dni: string } | null)?.dni ?? "-"} />
        </div>
      </div>
    </div>
  );
};

AccountPage.getLayout = (page) => <AppLayout noPadding>{page}</AppLayout>;

export default AccountPage;
