import { CertificationAttemptsResponse } from "@/interfaces/Certification/CertificationStudentAttempt";
import { API_STUDENT_CERTIFICATIONS } from "@/utils/Endpoints";

export const getCertificationAttemptsStudent = async (
  userId: number,
  assignmentId: number
): Promise<CertificationAttemptsResponse> => {
  try {
    const response = await fetch(
      `${API_STUDENT_CERTIFICATIONS}/attempts/${assignmentId}/user/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Validar y normalizar la respuesta
    if (data.success && data.data) {
      // Asegurar que attempts sea un array
      const attempts = Array.isArray(data.data) ? data.data : [];

      // Validar que cada attempt tenga los campos requeridos
      const validatedAttempts = attempts.map((attempt: any) => ({
        ...attempt,
        status: attempt.status || "unknown",
        score_obtained: attempt.score_obtained || 0,
        total_points_available: attempt.total_points_available || 0,
        passed: attempt.passed || false,
        time_spent_minutes: attempt.time_spent_minutes || 0,
        answers: attempt.answers || [],
        certification: attempt.certification ||
          attempt.assignment?.certification || {
            title: "Certificación no disponible",
            description: "",
            duration_in_minutes: 0,
            passing_percentage: 0,
          },
      }));

      return {
        success: true,
        data: validatedAttempts,
      };
    }

    return {
      success: false,
      data: [],
    };
  } catch (error) {
    console.error("Error fetching certification attempts:", error);
    throw error;
  }
};
