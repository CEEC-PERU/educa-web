import React, { useState } from "react";
import SidebarDrawer from "@/components/student/DrawerNavigation";
import Navbar from "@/components/Navbar";
import { useEvaluationUI } from "@/hooks/ui/useEvaluationUI";
import { useMyTrainingsDetails } from "@/hooks/useMyTrainingsDetails";
import { useRouter } from "next/router";
import { MyProgramDay } from "@/interfaces/Training/Training";
import DayContentsModal from "@/components/Training/DayContentsModal";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Lock,
  Play,
  FileText,
  Video,
  Monitor,
  ChevronRight,
  Eye,
} from "lucide-react";

const MyTrainingsPage: React.FC = () => {
  const router = useRouter();
  const { isDrawerOpen, toggleSidebar, userProfile } = useEvaluationUI();
  const [selectedDay, setSelectedDay] = useState<MyProgramDay | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const programId = Number(router.query.programId);

  const { myTrainingDetails, loading, error, refetch } =
    useMyTrainingsDetails(programId);

  if (!router.isReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  if (!router.query.programId || isNaN(programId)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-red-500">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            ID de programa inválido
          </h2>
          <button
            onClick={() => router.push("/student/capacitaciones")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver a Capacitaciones
          </button>
        </div>
      </div>
    );
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-5 h-5" />;
      case "video":
        return <Video className="w-5 h-5" />;
      case "scorm":
        return <Monitor className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          color: "bg-green-50 text-green-700 border-green-200",
          icon: <CheckCircle2 className="w-4 h-4" />,
          label: "Completado",
        };
      case "in_progress":
        return {
          color: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <Play className="w-4 h-4" />,
          label: "En progreso",
        };
      default:
        return {
          color: "bg-gray-50 text-gray-600 border-gray-200",
          icon: <Clock className="w-4 h-4" />,
          label: "Sin iniciar",
        };
    }
  };

  const handleViewDayContents = (e: React.MouseEvent, day: MyProgramDay) => {
    e.stopPropagation();
    if (day.is_unlocked) {
      setSelectedDay(day);
      setIsModalOpen(true);
    }
  };

  const handleContentClick = (
    e: React.MouseEvent,
    dayId: number,
    contentId: number,
  ) => {
    e.stopPropagation();
    router.push(
      `/student/trainings/${programId}/days/${dayId}/contents/${contentId}`,
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative z-10">
        <Navbar
          bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
          borderColor="border border-stone-300"
          user={
            userProfile.uri_picture
              ? { profilePicture: userProfile.uri_picture }
              : undefined
          }
          toggleSidebar={toggleSidebar}
        />
        <SidebarDrawer
          isDrawerOpen={isDrawerOpen}
          toggleSidebar={toggleSidebar}
        />
      </div>

      <div className="pt-16">
        <div
          className={`transition-all duration-300 ${isDrawerOpen ? "lg:ml-64" : "lg:ml-16"}`}
        >
          <div className="container mx-auto px-4 py-8">
            {loading ? (
              <div className="space-y-6">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-12 bg-gray-200 rounded w-1/2 mb-6"></div>
                  <div className="h-20 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-full mb-4">
                  <svg
                    className="w-10 h-10 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {error}
                </h3>
                <button
                  onClick={refetch}
                  className="mt-4 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            ) : !myTrainingDetails ? (
              <div className="text-center py-16">
                <p className="text-gray-600">No se encontró el programa</p>
              </div>
            ) : (
              <>
                {/* Breadcrumb */}
                <div className="mb-6">
                  <nav className="flex items-center gap-2 text-sm text-gray-600">
                    <button
                      onClick={() => router.push("/student/capacitaciones")}
                      className="hover:text-blue-600 transition-colors"
                    >
                      Capacitaciones
                    </button>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">
                      {myTrainingDetails.title}
                    </span>
                  </nav>
                </div>

                {/* Header del Programa */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {myTrainingDetails.title}
                      </h1>
                      <p className="text-gray-600">
                        {myTrainingDetails.description}
                      </p>
                    </div>
                  </div>

                  {/* Progreso General */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Progreso General
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {myTrainingDetails.overall_progress.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${myTrainingDetails.overall_progress}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Lista de Días */}
                <div className="space-y-6">
                  {myTrainingDetails.days.map((day) => (
                    <div
                      key={day.day_id}
                      className={`bg-white rounded-xl shadow-sm border ${
                        day.is_unlocked
                          ? "border-gray-200"
                          : "border-gray-300 opacity-60"
                      } overflow-hidden`}
                    >
                      {/* Header del Día */}
                      <div
                        className={`p-5 ${day.is_unlocked ? "bg-gradient-to-r from-blue-50 to-purple-50" : "bg-gray-50"}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className={`p-3 rounded-lg ${day.is_unlocked ? "bg-white" : "bg-gray-200"}`}
                            >
                              {day.is_unlocked ? (
                                <BookOpen className="w-6 h-6 text-blue-600" />
                              ) : (
                                <Lock className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h2 className="text-xl font-bold text-gray-900">
                                {day.title}
                              </h2>
                              <p className="text-sm text-gray-600">
                                Día {day.day_number} • {day.contents.length}{" "}
                                contenido(s)
                              </p>
                            </div>

                            {day.is_unlocked && (
                              <button
                                onClick={(e) => handleViewDayContents(e, day)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all font-medium"
                              >
                                <Eye className="w-4 h-4" />
                                <span className="hidden sm:inline">
                                  Ver todo
                                </span>
                              </button>
                            )}
                          </div>

                          <div className="text-right ml-4">
                            <div className="text-2xl font-bold text-gray-900">
                              {day.completion_percentage ?? 0}%
                            </div>
                            <div className="text-xs text-gray-500">
                              completado
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${day.completion_percentage ?? 0}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="p-5">
                        {day.is_unlocked ? (
                          <div className="space-y-3">
                            {day.contents.slice(0, 3).map((content) => {
                              const status = getStatusConfig(content.status);
                              return (
                                <div
                                  key={content.content_id}
                                  onClick={(e) =>
                                    handleContentClick(
                                      e,
                                      day.day_id,
                                      content.content_id,
                                    )
                                  }
                                  className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 hover:border-blue-300 transition-all cursor-pointer"
                                >
                                  <div className="flex items-center gap-4 flex-1">
                                    <div className="p-3 bg-white rounded-lg border border-gray-200 group-hover:border-blue-300 transition-colors">
                                      {getContentIcon(content.content_type)}
                                    </div>
                                    <div className="flex-1">
                                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {content.title}
                                      </h3>
                                      <div className="flex items-center gap-3 mt-1">
                                        <span
                                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${status.color}`}
                                        >
                                          {status.icon} {status.label}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          Progreso:{" "}
                                          {parseFloat(
                                            content.progress_percentage,
                                          ).toFixed(0)}
                                          %
                                        </span>
                                        {content.is_mandatory && (
                                          <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                                            Obligatorio
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                </div>
                              );
                            })}

                            {day.contents.length > 3 && (
                              <button
                                onClick={(e) => handleViewDayContents(e, day)}
                                className="w-full py-3 text-center text-blue-600 hover:text-blue-700 font-medium text-sm border-t border-gray-200 mt-3 pt-3 hover:bg-blue-50 transition-colors rounded-b-lg"
                              >
                                Ver los {day.contents.length - 3} contenidos
                                restantes →
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <Lock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <p className="font-medium">Día bloqueado</p>
                            <p className="text-sm">
                              Completa el día {day.day_number - 1} para
                              desbloquear
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <DayContentsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        day={selectedDay}
      />
    </div>
  );
};

export default MyTrainingsPage;
