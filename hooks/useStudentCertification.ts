import { useState, useCallback } from "react";
import {
  PendingCertification,
  ExamData,
  AnswerSubmission,
  AttemptResult,
  StudentAttempt,
} from "../interfaces/StudentCertification";
import { API_STUDENT_CERTIFICATIONS } from "../utils/Endpoints";
import { fetchWithTimeout, handleApiResponse } from "../utils/apiHelpers";

export const useStudentCertifications = () => {
  const [pendingCertifications, setPendingCertifications] = useState<
    PendingCertification[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentExam, setCurrentExam] = useState<ExamData | null>(null);
  const [examLoading, setExamLoading] = useState(false);
  const [examError, setExamError] = useState<string | null>(null);

  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // 🎯 OBTENER CERTIFICACIONES PENDIENTES
  const fetchPendingCertifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      const response = await fetchWithTimeout(
        `${API_STUDENT_CERTIFICATIONS}/pending`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await handleApiResponse(response);

      setPendingCertifications(result.data || []);
      return result.data || [];
    } catch (error: any) {
      const errorMessage =
        error.message || "Error al cargar certificaciones pendientes";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // 🎯 INICIAR INTENTO DE EXAMEN
  const startExamAttempt = useCallback(async (assignmentId: number) => {
    setExamLoading(true);
    setExamError(null);

    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      const response = await fetchWithTimeout(
        `${API_STUDENT_CERTIFICATIONS}/attempt/start`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ assignment_id: assignmentId }),
        }
      );

      const result = await handleApiResponse(response);

      setCurrentExam(result.data);
      return result.data;
    } catch (error: any) {
      const errorMessage = error.message || "Error al iniciar el examen";
      setExamError(errorMessage);
      throw error;
    } finally {
      setExamLoading(false);
    }
  }, []);

  // 🎯 ENVIAR RESPUESTAS
  const submitExamAttempt = useCallback(
    async (attemptId: number, answers: AnswerSubmission[]) => {
      setSubmissionLoading(true);
      setSubmissionError(null);

      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          throw new Error("No se encontró el token de autenticación");
        }

        const response = await fetchWithTimeout(
          `${API_STUDENT_CERTIFICATIONS}/attempt/submit`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              attempt_id: attemptId,
              answers: answers,
            }),
          }
        );

        const result = await handleApiResponse(response);

        setCurrentExam(null); // Limpiar examen actual
        return result.data;
      } catch (error: any) {
        const errorMessage = error.message || "Error al enviar las respuestas";
        setSubmissionError(errorMessage);
        throw error;
      } finally {
        setSubmissionLoading(false);
      }
    },
    []
  );

  // 🎯 OBTENER RESULTADOS
  const getAttemptResults = useCallback(async (attemptId: number) => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      const response = await fetchWithTimeout(
        `${API_STUDENT_CERTIFICATIONS}/attempt/${attemptId}/results`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await handleApiResponse(response);
      return result.data;
    } catch (error: any) {
      const errorMessage = error.message || "Error al obtener resultados";
      throw error;
    }
  }, []);

  // 🎯 OBTENER INTENTOS DEL ESTUDIANTE
  const getStudentAttempts = useCallback(async (assignmentId: number) => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      const response = await fetchWithTimeout(
        `${API_STUDENT_CERTIFICATIONS}/assignment/${assignmentId}/attempts`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await handleApiResponse(response);
      return result.data || [];
    } catch (error: any) {
      const errorMessage = error.message || "Error al obtener intentos";
      throw error;
    }
  }, []);

  // 🎯 ABANDONAR INTENTO
  const abandonAttempt = useCallback(async (attemptId: number) => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      const response = await fetchWithTimeout(
        `${API_STUDENT_CERTIFICATIONS}/attempt/abandon`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ attempt_id: attemptId }),
        }
      );

      const result = await handleApiResponse(response);
      setCurrentExam(null); // Limpiar examen actual
      return result;
    } catch (error: any) {
      const errorMessage = error.message || "Error al abandonar el intento";
      throw error;
    }
  }, []);

  // 🎯 LIMPIAR ESTADOS
  const clearCurrentExam = useCallback(() => {
    setCurrentExam(null);
    setExamError(null);
  }, []);

  const clearErrors = useCallback(() => {
    setError(null);
    setExamError(null);
    setSubmissionError(null);
  }, []);

  return {
    // Estados
    pendingCertifications,
    loading,
    error,

    currentExam,
    examLoading,
    examError,

    submissionLoading,
    submissionError,

    // Métodos
    fetchPendingCertifications,
    startExamAttempt,
    submitExamAttempt,
    getAttemptResults,
    getStudentAttempts,
    abandonAttempt,
    clearCurrentExam,
    clearErrors,
  };
};
