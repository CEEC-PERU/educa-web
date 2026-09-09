import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useEnterprise } from "../hooks/useEnterprise";
import { useUpdateAvatar } from "../hooks/user/useUpdateAvatar";
import AppLayout from "@/components/layouts/AppLayout";
import { Profile } from "../interfaces/User/UserInterfaces";
import type { NextPageWithLayout } from "../types/next";
import {
  HomeIcon,
  LockClosedIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";
import ChangePasswordModal from "../components/ChangePasswordModal";
import DailyQuoteBanner from "../components/student/DailyQuoteBanner";

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
  <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm">
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
      {label}
    </p>
    <p className="text-base font-medium text-gray-800 break-words">{value}</p>
  </div>
);

const AccountPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { user, profileInfo } = useAuth();
  const { enterprise, isLoading, error } = useEnterprise();
  const [avatarError, setAvatarError] = useState(false);
  const [coverError, setCoverError] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { isLoading: isUploadingAvatar, submitAvatarUpdate } =
    useUpdateAvatar();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const errorMessage = await submitAvatarUpdate(file);
    if (errorMessage) {
      toast.error(errorMessage);
    } else {
      setAvatarError(false);
      toast.success("Foto de perfil actualizada");
    }
  };

  const role = (user as { role: number } | null)?.role;
  const dashboardHref =
    role !== undefined ? (DASHBOARD_BY_ROLE[role] ?? "/") : "/";

  const profile = profileInfo as Profile | null;
  const fullName =
    `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim() ||
    "Usuario";

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brandrosado-800 mx-auto mb-4" />
          <p className="text-white/70 text-base">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300">
        <div className="bg-white border border-gray-200 p-8 rounded-2xl text-center max-w-md shadow-sm">
          <p className="text-gray-700 text-base font-semibold mb-4">
            Error al cargar el perfil
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-brandm365-100 text-white px-6 py-2 rounded-full hover:bg-branda365-800 transition-colors text-sm"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300">
      <div className="relative w-full max-w-4xl mx-auto">
        {/* Banner detrás del avatar, oculto por ahora.
        <div className="relative w-full h-52 lg:h-64 overflow-hidden rounded-b-2xl">
          <img
            src={
              coverError
                ? "/default-cover.png"
                : (enterprise?.enterprise.image_fondo ?? "/default-cover.png")
            }
            alt=""
            className="w-full h-full object-cover"
            onError={() => setCoverError(true)}
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        */}
        <DailyQuoteBanner />

        <div className="absolute left-1/2 -translate-x-1/2 lg:left-8 lg:translate-x-0 -bottom-14 h-28 w-28 lg:h-32 lg:w-32">
          <div className="relative h-full w-full rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100">
            <img
              src={
                avatarError
                  ? "/default-avatar.png"
                  : (profile?.profile_picture ?? "/default-avatar.png")
              }
              alt={fullName}
              className="w-full h-full object-cover"
              onError={() => setAvatarError(true)}
            />
            {isUploadingAvatar && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            disabled={isUploadingAvatar}
            aria-label="Cambiar foto de perfil"
            className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-brandrosado-800 text-white shadow-md transition-colors hover:bg-brandfucsia-900 disabled:opacity-50"
          >
            <CameraIcon className="h-4 w-4" />
          </button>

          <input
            ref={avatarInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 pt-20 pb-12">
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end mb-8 gap-4">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl lg:text-3xl font-bold text-white">
              {fullName}
            </h1>
            {enterprise?.enterprise.name && (
              <p className="text-sm text-white/70 mt-1">
                {enterprise.enterprise.name}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all text-sm font-medium shadow-sm backdrop-blur-sm"
            >
              <LockClosedIcon className="h-4 w-4" />
              Cambiar contraseña
            </button>
            <button
              onClick={() => router.push(dashboardHref)}
              title="Ir al Dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all text-sm font-medium shadow-sm backdrop-blur-sm"
            >
              <HomeIcon className="h-4 w-4" />
              Dashboard
            </button>
          </div>
        </div>

        <hr className="border-white/20 mb-8" />
        <h2 className="text-base font-semibold text-white/70 uppercase tracking-wider mb-5">
          Datos Personales
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
          <InfoItem label="Nombres" value={profile?.first_name ?? "-"} />
          <InfoItem label="Apellidos" value={profile?.last_name ?? "-"} />
          <InfoItem label="Email" value={profile?.email ?? "-"} />
          <InfoItem label="Teléfono" value={profile?.phone ?? "-"} />
          <InfoItem
            label="Empresa"
            value={enterprise?.enterprise.name ?? "-"}
          />
          <InfoItem
            label="Usuario"
            value={(user as { dni: string } | null)?.dni ?? "-"}
          />
        </div>
      </div>

      <ChangePasswordModal
        show={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
};

AccountPage.getLayout = (page) => <AppLayout noPadding>{page}</AppLayout>;

export default AccountPage;
