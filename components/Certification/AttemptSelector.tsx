import { CertificationAttempt } from "@/interfaces/Certification/CertificationStudentAttempt";
import { AttemptStatusBadge } from "./AttemptStatusBadge";
import React from "react";

interface AttemptSelectorProps {
  attempts: CertificationAttempt[];
  selectedAttempt: CertificationAttempt | null;
  onSelectAttempt: (attemptId: number) => void;
}

const AttemptSelectorCertification: React.FC<AttemptSelectorProps> = ({
  attempts,
  selectedAttempt,
  onSelectAttempt,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Ordenar intentos: completados/abandonados primero, luego en progreso
  const sortedAttempts = [...attempts].sort((a, b) => {
    if (a.status === "in_progress" && b.status !== "in_progress") return 1;
    if (a.status !== "in_progress" && b.status === "in_progress") return -1;
    return (
      new Date(b.completed_at || b.started_at).getTime() -
      new Date(a.completed_at || a.started_at).getTime()
    );
  });

  if (attempts.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Intentos Realizados ({attempts.length})
      </h3>
      {/* Lista detallada para desktop */}
      <div className="space-y-3">
        {sortedAttempts.map((attempt) => (
          <div
            key={attempt.attempt_id}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              selectedAttempt?.attempt_id === attempt.attempt_id
                ? "border-brand-200 bg-brand-50 ring-1 ring-brand-200"
                : "border-gray-200 hover:bg-gray-50"
            }`}
            onClick={() => onSelectAttempt(attempt.attempt_id)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    Intento #{attempt.attempt_number}
                  </span>
                  <AttemptStatusBadge
                    status={attempt.status}
                    score={attempt.score_obtained}
                    passed={attempt.passed}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Iniciado:</span>{" "}
                    {formatDate(attempt.started_at)}
                  </div>

                  {attempt.completed_at && (
                    <div>
                      <span className="font-medium">Finalizado:</span>{" "}
                      {formatDate(attempt.completed_at)}
                    </div>
                  )}

                  <div>
                    <span className="font-medium">Tiempo:</span>{" "}
                    {attempt.time_spent_minutes} min
                  </div>
                </div>

                {/* Información específica por estado */}
                {attempt.status === "completed" && (
                  <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Puntuación:</span>{" "}
                      {attempt.score_obtained} /{" "}
                      {attempt.total_points_available} pts
                    </div>
                    <div>
                      <span className="font-medium">Porcentaje:</span>{" "}
                      {attempt.total_points_available > 0
                        ? Math.round(
                            (attempt.score_obtained /
                              attempt.total_points_available) *
                              100
                          )
                        : 0}
                      %
                    </div>
                  </div>
                )}

                {attempt.status === "abandoned" && (
                  <div className="mt-2 text-sm text-yellow-700">
                    El intento fue abandonado antes de completarse
                  </div>
                )}

                {attempt.status === "in_progress" && (
                  <div className="mt-2 text-sm text-blue-700">
                    Este intento aún está en progreso
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttemptSelectorCertification;
