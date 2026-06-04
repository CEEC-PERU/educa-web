import React, { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { getUsersByEnterpriseWithSessions } from "../../services/courses/courseStudent";
import TopStudentsChart from "../../components/Corporate/TopStudent";
import AppLayout from "../../components/layouts/AppLayout";
import type { NextPageWithLayout } from "../../types/next";
import {
  UserGroupIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

interface StudentSession {
  id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  profile_picture: string | null;
  loginCount: number;
  lastSession: string | null;
}

const today = new Date();
const DEFAULT_START = new Date(today.getFullYear(), today.getMonth(), 1)
  .toISOString()
  .split("T")[0];
const DEFAULT_END = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  .toISOString()
  .split("T")[0];

const FALLBACK_AVATAR =
  "https://res.cloudinary.com/dk2red18f/image/upload/v1713896612/CEEC/PERFIL/egwjjcrs2aon5hhtxabj.png";

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "Sin sesiones en el período";
  return new Date(dateStr).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Sesion: NextPageWithLayout = () => {
  const { user } = useAuth();
  const enterpriseId = user
    ? (user as { enterprise_id: number }).enterprise_id
    : null;

  const [startDate, setStartDate] = useState(DEFAULT_START);
  const [endDate, setEndDate] = useState(DEFAULT_END);
  const [hasFiltered, setHasFiltered] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const {
    data: students = [],
    isLoading,
    isError,
  } = useQuery<StudentSession[]>({
    queryKey: ["sessions", enterpriseId, startDate, endDate],
    queryFn: () =>
      getUsersByEnterpriseWithSessions(
        startDate,
        endDate,
        enterpriseId as number,
      ),
    enabled: !!enterpriseId && !!startDate && !!endDate,
  });

  const sorted = [...students].sort((a, b) => b.loginCount - a.loginCount);

  const handleDownloadChart = () => {
    const canvas = chartRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `sesiones-${startDate}-${endDate}.png`;
    link.click();
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Sesiones de usuarios
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Actividad por rango de fechas
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Filtrar período
          </p>
          <div className="flex items-center gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Desde</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setHasFiltered(true); }}
                className="block p-2 text-sm border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Hasta</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setHasFiltered(true); }}
                className="block p-2 text-sm border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {!isLoading && students.length > 0 && (
        <div className="mb-6">
          <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 flex items-center gap-3 shadow-sm w-fit">
            <UserGroupIcon className="h-6 w-6 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">Usuarios capturados</p>
              <p className="text-xl font-bold text-gray-900">
                {students.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {hasFiltered && !isLoading && students.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">
              Top 3 usuarios más activos
            </p>
            <button
              onClick={handleDownloadChart}
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
            >
              <ArrowDownTrayIcon className="h-3.5 w-3.5" />
              Descargar
            </button>
          </div>
          <div ref={chartRef} className="flex justify-center">
            <TopStudentsChart students={students} />
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      ) : isError ? (
        <div className="text-center py-16 text-red-500 text-sm">
          Error al cargar los datos. Intenta nuevamente.
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <UserGroupIcon className="mx-auto h-10 w-10 mb-3 text-gray-300" />
          <p className="text-sm">No hay actividad registrada en este período.</p>
          <p className="text-xs mt-1 text-gray-300">
            Prueba ajustando el rango de fechas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 shrink-0 rounded-full overflow-hidden bg-gray-100">
                  <img
                    src={student.profile_picture ?? FALLBACK_AVATAR}
                    alt={`${student.first_name} ${student.last_name}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_AVATAR;
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate uppercase">
                    {student.first_name} {student.last_name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {student.email}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold text-blue-600">
                    {student.loginCount}
                  </p>
                  <p className="text-xs text-gray-400">sesiones</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-400">Última sesión</p>
                <p className="text-xs font-medium text-gray-600">
                  {formatDate(student.lastSession)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

Sesion.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Sesion;
