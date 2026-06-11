import React from "react";
import { useRouter } from "next/router";
import AppLayout from "../../../../components/layouts/AppLayout";
import type { NextPageWithLayout } from "../../../../types/next";
import { useUserByIdQuery } from "@/features/users/users.queries";
import { useEnterpriseByIdQuery } from "@/features/enterprises/enterprises.queries";
import {
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  IdentificationIcon,
  UserIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const InfoField = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string | undefined;
}) => (
  <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
    <div className="flex-shrink-0 p-2 bg-purple-50 rounded-lg">
      <Icon className="h-5 w-5 text-purple-500" />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-semibold text-gray-800 break-words">
        {value || "—"}
      </p>
    </div>
  </div>
);

const UserProfile: NextPageWithLayout = () => {
  const router = useRouter();
  const userId = router.query.userId ? Number(router.query.userId) : undefined;

  const userQuery = useUserByIdQuery(userId);
  const user = userQuery.data as any;

  const enterpriseQuery = useEnterpriseByIdQuery(user?.enterprise_id);
  const enterprise = enterpriseQuery.data;

  const isLoading = userQuery.isLoading || enterpriseQuery.isLoading;
  const isError = userQuery.isError || enterpriseQuery.isError;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-red-500 font-medium">
          No se pudo cargar la información del usuario
        </p>
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Volver
        </button>
      </div>
    );
  }

  if (isLoading || !user || !enterprise) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors mt-4 mb-3 px-4"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Volver
      </button>

      <div className="relative rounded-2xl overflow-hidden shadow-md mx-4">
        <img
          src={enterprise.image_fondo}
          className="w-full h-36 object-cover"
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 flex items-end gap-4">
          <img
            src={user.userProfile?.profile_picture}
            alt="Foto de perfil"
            className="h-20 w-20 rounded-full border-4 border-white shadow-lg flex-shrink-0"
          />
          <div className="pb-1">
            <h1 className="text-xl font-bold text-white leading-tight">
              {user.userProfile?.first_name} {user.userProfile?.last_name}
            </h1>
            <p className="text-sm text-white/75">{enterprise.name}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 px-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InfoField
          icon={UserIcon}
          label="Nombres"
          value={user.userProfile?.first_name}
        />
        <InfoField
          icon={UserIcon}
          label="Apellidos"
          value={user.userProfile?.last_name}
        />
        <InfoField
          icon={EnvelopeIcon}
          label="Email"
          value={user.userProfile?.email}
        />
        <InfoField
          icon={PhoneIcon}
          label="Teléfono"
          value={user.userProfile?.phone}
        />
        <InfoField
          icon={BuildingOfficeIcon}
          label="Empresa"
          value={enterprise.name}
        />
        <InfoField icon={IdentificationIcon} label="DNI" value={user.dni} />
      </div>
    </div>
  );
};

UserProfile.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default UserProfile;
