import { useState, useEffect, useRef, useCallback } from "react";
import { debounce } from "lodash";
import { useAuth } from "@/context/AuthContext";
import { getScormPlayerUrl } from "@/utils/scormUrlTransformer";
import { trackScormData } from "@/services/training/trainingStudentService";

// Declarar tipos globales para SCORM API
declare global {
  interface Window {
    API?: ScormApi;
    API_1484_11?: Scorm2004Api;
  }
}

interface ScormApi {
  LMSInitialize: (param: string) => string;
  LMSFinish: (param: string) => string;
  LMSGetValue: (key: string) => string;
  LMSSetValue: (key: string, value: string) => string;
  LMSCommit: (param: string) => string;
  LMSGetLastError: () => string;
  LMSGetErrorString: (errorCode: string) => string;
  LMSGetDiagnostic: (errorCode: string) => string;
}

interface Scorm2004Api {
  Initialize: (param: string) => string;
  Terminate: (param: string) => string;
  GetValue: (key: string) => string;
  SetValue: (key: string, value: string) => string;
  Commit: (param: string) => string;
  GetLastError: () => string;
  GetErrorString: (errorCode: string) => string;
  GetDiagnostic: (errorCode: string) => string;
}

interface ScormData {
  completion_status: string;
  success_status: string;
  progress_measure: number;
  score_raw?: number;
  score_scaled?: number;
  lesson_location?: string;
  session_time?: string;
}

interface UseScormPlayerProps {
  contentUrl: string;
  contentId: number;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

export const useScormPlayer = ({
  contentUrl,
  contentId,
  onProgress,
  onComplete,
}: UseScormPlayerProps) => {
  const [scormUrl, setScormUrl] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  // Ref para mantener los datos SCORM actualizados sin re-renders
  const scormDataRef = useRef<ScormData>({
    completion_status: "not attempted",
    success_status: "unknown",
    progress_measure: 0,
  });

  // Guardar datos SCORM en el backend (con debounce)
  const syncScormData = useCallback(
    debounce(async (data: ScormData) => {
      if (!token || !contentId) return;
      try {
        await trackScormData(contentId, data, token);
        console.log("SCORM data synced to backend:", data);
      } catch (err) {
        console.error("Error syncing SCORM data:", err);
      }
    }, 2000),
    [token, contentId],
  );

  // Inicializar SCORM API
  useEffect(() => {
    if (!contentUrl) {
      setError("URL de contenido no proporcionada");
      return;
    }

    // Transformar URL a ruta local para Same-Origin
    const processedUrl = getScormPlayerUrl(contentUrl, "scorm");
    setScormUrl(processedUrl);

    // Crear API SCORM 1.2
    const API: ScormApi = {
      LMSInitialize: (param: string) => {
        console.log("SCORM 1.2: LMSInitialize", param);
        setIsInitialized(true);
        setError(null);
        return "true";
      },

      LMSFinish: (param: string) => {
        console.log("SCORM 1.2: LMSFinish", param);
        // Sincronizar datos finales
        syncScormData.flush();

        const data = scormDataRef.current;
        if (
          data.completion_status === "completed" ||
          data.completion_status === "passed" ||
          data.success_status === "passed"
        ) {
          onComplete?.();
        }
        return "true";
      },

      LMSGetValue: (key: string) => {
        console.log("SCORM 1.2: LMSGetValue", key);
        const data = scormDataRef.current;

        const valueMap: Record<string, string> = {
          "cmi.core.lesson_status": data.completion_status || "not attempted",
          "cmi.core.lesson_location": data.lesson_location || "",
          "cmi.core.score.raw": String(data.score_raw || 0),
          "cmi.core.score.min": "0",
          "cmi.core.score.max": "100",
          "cmi.suspend_data": "",
          "cmi.core.student_id": "",
          "cmi.core.student_name": "",
        };

        return valueMap[key] ?? "";
      },

      LMSSetValue: (key: string, value: string) => {
        console.log("SCORM 1.2: LMSSetValue", key, "=", value);
        const data = scormDataRef.current;

        // Procesar diferentes claves SCORM
        if (key === "cmi.core.lesson_status") {
          data.completion_status = value;
          if (value === "completed" || value === "passed") {
            data.progress_measure = 1;
            onProgress?.(100);
            onComplete?.();
          }
        } else if (key === "cmi.core.lesson_location") {
          data.lesson_location = value;
        } else if (key === "cmi.core.score.raw") {
          data.score_raw = parseInt(value, 10);
          const progress = Math.min(100, Math.max(0, data.score_raw));
          data.progress_measure = progress / 100;
          onProgress?.(progress);
        } else if (key === "cmi.core.session_time") {
          data.session_time = value;
        }

        scormDataRef.current = data;
        syncScormData(data);
        return "true";
      },

      LMSCommit: (param: string) => {
        console.log("SCORM 1.2: LMSCommit", param);
        syncScormData(scormDataRef.current);
        return "true";
      },

      LMSGetLastError: () => "0",
      LMSGetErrorString: (errorCode: string) => "",
      LMSGetDiagnostic: (errorCode: string) => "",
    };

    // Crear API SCORM 2004
    const API_1484_11: Scorm2004Api = {
      Initialize: (param: string) => {
        console.log("SCORM 2004: Initialize", param);
        setIsInitialized(true);
        setError(null);
        return "true";
      },

      Terminate: (param: string) => {
        console.log("SCORM 2004: Terminate", param);
        syncScormData.flush();

        const data = scormDataRef.current;
        if (
          data.completion_status === "completed" ||
          data.success_status === "passed"
        ) {
          onComplete?.();
        }
        return "true";
      },

      GetValue: (key: string) => {
        console.log("SCORM 2004: GetValue", key);
        const data = scormDataRef.current;

        const valueMap: Record<string, string> = {
          "cmi.completion_status": data.completion_status || "unknown",
          "cmi.success_status": data.success_status || "unknown",
          "cmi.score.scaled": String(data.score_scaled || 0),
          "cmi.score.raw": String(data.score_raw || 0),
          "cmi.progress_measure": String(data.progress_measure || 0),
          "cmi.location": data.lesson_location || "",
        };

        return valueMap[key] ?? "";
      },

      SetValue: (key: string, value: string) => {
        console.log("SCORM 2004: SetValue", key, "=", value);
        const data = scormDataRef.current;

        if (key === "cmi.completion_status") {
          data.completion_status = value;
          if (value === "completed") {
            data.progress_measure = 1;
            onProgress?.(100);
            onComplete?.();
          }
        } else if (key === "cmi.success_status") {
          data.success_status = value;
          if (value === "passed") {
            onComplete?.();
          }
        } else if (key === "cmi.score.scaled") {
          data.score_scaled = parseFloat(value);
          data.progress_measure = Math.max(0, Math.min(1, data.score_scaled));
          onProgress?.(data.progress_measure * 100);
        } else if (key === "cmi.score.raw") {
          data.score_raw = parseFloat(value);
        } else if (key === "cmi.progress_measure") {
          data.progress_measure = parseFloat(value);
          onProgress?.(data.progress_measure * 100);
        } else if (key === "cmi.location") {
          data.lesson_location = value;
        } else if (key === "cmi.session_time") {
          data.session_time = value;
        }

        scormDataRef.current = data;
        syncScormData(data);
        return "true";
      },

      Commit: (param: string) => {
        console.log("SCORM 2004: Commit", param);
        syncScormData(scormDataRef.current);
        return "true";
      },

      GetLastError: () => "0",
      GetErrorString: (errorCode: string) => "",
      GetDiagnostic: (errorCode: string) => "",
    };

    // Registrar APIs en window
    window.API = API;
    window.API_1484_11 = API_1484_11;

    console.log("SCORM APIs registered on window");

    // Cleanup al desmontar
    return () => {
      syncScormData.cancel();
      delete window.API;
      delete window.API_1484_11;
      console.log("SCORM APIs removed from window");
    };
  }, [contentUrl, contentId, token, onProgress, onComplete, syncScormData]);

  return {
    scormUrl,
    isInitialized,
    error,
  };
};
