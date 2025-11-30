import { useState, useEffect } from "react";
import {
  CertificationAttempt,
  UseCertificationResultReturn,
} from "@/interfaces/Certification/CertificationStudentAttempt";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { toInteger } from "lodash";
import { getCertificationAttemptsStudent } from "@/services/certification/certification";

export const useCertificationResult = (): UseCertificationResultReturn => {
  const [attempts, setAttempts] = useState<CertificationAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAttempt, setSelectedAttempt] =
    useState<CertificationAttempt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const { assignment_id } = router.query;
  const userInfo = user as { id: number; enterprise_id: number };

  const selectLatestAttempt = (attempts: CertificationAttempt[]) => {
    if (attempts.length > 0) {
      // Filtrar solo intentos completados/abandonados (no in_progress)
      const completedAttempts = attempts.filter(
        (attempt) => attempt.status !== "in_progress"
      );

      if (completedAttempts.length > 0) {
        const latestAttempt = completedAttempts.reduce((latest, current) =>
          new Date(current.completed_at) > new Date(latest.completed_at)
            ? current
            : latest
        );
        setSelectedAttempt(latestAttempt);
      } else if (attempts.length > 0) {
        // Si solo hay intentos en progreso, mostrar el más reciente
        const latestInProgress = attempts.reduce((latest, current) =>
          new Date(current.started_at) > new Date(latest.started_at)
            ? current
            : latest
        );
        setSelectedAttempt(latestInProgress);
      }
    }
  };

  const selectAttemptById = (attemptId: number) => {
    const attempt = attempts.find((a) => a.attempt_id === attemptId);
    if (attempt) {
      setSelectedAttempt(attempt);
    }
  };

  useEffect(() => {
    const fetchCertificationResults = async () => {
      if (!assignment_id || !userInfo?.id) return;
      try {
        setLoading(true);
        setError(null);

        const data = await getCertificationAttemptsStudent(
          userInfo.id,
          toInteger(assignment_id)
        );

        console.log("Data de intentos de certificación:", data);

        if (data.success && data.data) {
          // CORRECCIÓN: data.data ya es el array de attempts
          const formattedAttempts = Array.isArray(data.data) ? data.data : [];

          console.log("Attempts formateados:", formattedAttempts);
          console.log("Número de attempts:", formattedAttempts.length);

          // Debug: mostrar estructura de cada attempt
          formattedAttempts.forEach((attempt, index) => {
            console.log(`Attempt ${index + 1}:`, {
              id: attempt.attempt_id,
              status: attempt.status,
              score: attempt.score_obtained,
              passed: attempt.passed,
              certification: attempt.certification?.title,
            });
          });

          setAttempts(formattedAttempts);
          selectLatestAttempt(formattedAttempts);
        } else {
          setError("No se encontraron intentos de certificación.");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        console.error(
          "Error al obtener los resultados de la certificacion:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCertificationResults();
  }, [assignment_id, userInfo?.id]);

  return {
    attempts,
    selectedAttempt,
    loading,
    error,
    selectAttemptById,
    setSelectedAttempt,
  };
};
