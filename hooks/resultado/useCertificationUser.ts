import { useState, useCallback } from "react";
import { API_CERTIFICATES } from "../../utils/Endpoints";

export const useCertificationUser = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Solo necesitamos 2 funciones
  const getCertificationAssignmentDetails = useCallback(
    async (certificationId: number) => {
      try {
        setLoading(true);
        const token = localStorage.getItem("userToken");

        const response = await fetch(
          `${API_CERTIFICATES}/${certificationId}/assignment-details`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al cargar los detalles de la certificación");
        }

        return await response.json();
      } catch (error) {
        console.error("Error fetching assignment details:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getCertificationStudentsProgress = useCallback(
    async (certificationId: number) => {
      try {
        setLoading(true);
        const token = localStorage.getItem("userToken");

        const response = await fetch(
          `${API_CERTIFICATES}/${certificationId}/students-progress`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al cargar el progreso de estudiantes");
        }

        return await response.json();
      } catch (error) {
        console.error("Error fetching students progress:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    getCertificationAssignmentDetails,
    getCertificationStudentsProgress,
    loading,
    error,
  };
};
