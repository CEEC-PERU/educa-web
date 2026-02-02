import React, { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { useAuth } from "@/context/AuthContext";
import { trackScormData } from "@/services/training/trainingStudentService";

interface ScormPlayerProps {
  scormUrl: string;
  contentId: number;
  onComplete?: () => void;
}

const ScormPlayer: React.FC<ScormPlayerProps> = ({
  scormUrl,
  contentId,
  onComplete,
}) => {
  const { token } = useAuth();
  const [scormData, setScormData] = useState({
    completion_status: "",
    success_status: "",
    progress_measure: 0,
  });

  const syncScormData = useCallback(
    debounce(async (data: any) => {
      if (!token || !contentId) return;
      try {
        await trackScormData(contentId, data, token);
      } catch (error) {
        console.error("Error saving SCORM data:", error);
      }
    }, 2000),
    [token, contentId],
  );

  useEffect(() => {
    const API = {
      LMSInitialize: () => "true",

      LMSFinish: () => {
        if (token && contentId) {
          trackScormData(contentId, scormData, token).catch((err: any) =>
            console.error("Error saving final SCORM data:", err),
          );
        }

        if (
          scormData.completion_status === "completed" ||
          scormData.completion_status === "passed" ||
          scormData.success_status === "passed"
        ) {
          onComplete?.();
        }

        return "true";
      },

      LMSGetValue: (key: string) => {
        const valueMap: any = {
          "cmi.core.lesson_status":
            scormData.completion_status || "not attempted",
          "cmi.core.score.raw": scormData.progress_measure * 100 || 0,
          "cmi.completion_status": scormData.completion_status || "unknown",
          "cmi.success_status": scormData.success_status || "unknown",
          "cmi.score.scaled": scormData.progress_measure || 0,
        };
        return valueMap[key] || "";
      },

      LMSSetValue: (key: string, value: string) => {
        const updates: any = {};

        if (key === "cmi.core.lesson_status") {
          updates.completion_status = value;
          if (value === "completed" || value === "passed") {
            if (token && contentId) {
              trackScormData(
                contentId,
                { ...scormData, completion_status: value },
                token,
              )
                .then(() => onComplete?.())
                .catch((err: any) => console.error("Error:", err));
            }
          }
        }

        if (key === "cmi.core.score.raw") {
          updates.progress_measure = parseInt(value) / 100;
          updates.score_raw = parseInt(value);
        }

        if (key === "cmi.completion_status") {
          updates.completion_status = value;
          if (value === "completed") {
            if (token && contentId) {
              trackScormData(
                contentId,
                { ...scormData, completion_status: value },
                token,
              )
                .then(() => onComplete?.())
                .catch((err: any) => console.error("Error:", err));
            }
          }
        }

        if (key === "cmi.success_status") {
          updates.success_status = value;
          if (value === "passed") {
            if (token && contentId) {
              trackScormData(
                contentId,
                { ...scormData, success_status: value },
                token,
              )
                .then(() => onComplete?.())
                .catch((err: any) => console.error("Error:", err));
            }
          }
        }

        if (key === "cmi.score.scaled") {
          updates.score_scaled = parseFloat(value);
          updates.progress_measure = parseFloat(value);
        }

        if (key === "cmi.progress_measure") {
          updates.progress_measure = parseFloat(value);
        }

        const newScormData = { ...scormData, ...updates };
        setScormData(newScormData);
        syncScormData(newScormData);

        return "true";
      },

      LMSCommit: () => {
        if (token && contentId) {
          trackScormData(contentId, scormData, token).catch((err: any) =>
            console.error("Error on commit:", err),
          );
        }
        return "true";
      },

      LMSGetLastError: () => 0,
      LMSGetErrorString: () => "No Error",
      LMSGetDiagnostic: () => "No Error",
    };

    const API_1484_11 = {
      Initialize: () => "true",

      Terminate: () => {
        if (token && contentId) {
          trackScormData(contentId, scormData, token).catch((err: any) =>
            console.error("Error on terminate:", err),
          );
        }

        if (
          scormData.completion_status === "completed" ||
          scormData.success_status === "passed"
        ) {
          onComplete?.();
        }

        return "true";
      },

      GetValue: API.LMSGetValue,
      SetValue: API.LMSSetValue,
      Commit: API.LMSCommit,
      GetLastError: API.LMSGetLastError,
      GetErrorString: API.LMSGetErrorString,
      GetDiagnostic: API.LMSGetDiagnostic,
    };

    (window as any).API = API;
    (window as any).API_1484_11 = API_1484_11;

    if (window.top && window.top !== window) {
      (window.top as any).API = API;
      (window.top as any).API_1484_11 = API_1484_11;
    }

    return () => {
      delete (window as any).API;
      delete (window as any).API_1484_11;
    };
  }, [onComplete, scormData, token, contentId, syncScormData]);

  return (
    <div className="w-full h-full bg-white flex flex-col">
      {scormData.progress_measure > 0 && (
        <div className="bg-gray-800 px-4 py-2">
          <div className="flex items-center justify-between text-white text-sm">
            <span>Progreso SCORM</span>
            <span className="font-semibold">
              {(scormData.progress_measure * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${scormData.progress_measure * 100}%` }}
            />
          </div>
        </div>
      )}

      <iframe
        src={scormUrl}
        className="flex-1 w-full border-none"
        allow="autoplay; fullscreen"
        title="Contenido SCORM"
      />
    </div>
  );
};

export default ScormPlayer;
