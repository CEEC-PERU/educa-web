"use client";

import React from "react";
import { useScormPlayer } from "@/hooks/useScormPlayer";

interface ScormPlayerProps {
  scormUrl: string;
  contentId: number;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

const ScormPlayer: React.FC<ScormPlayerProps> = ({
  scormUrl,
  contentId,
  onProgress,
  onComplete,
}) => {
  const { scormUrl: processedUrl, isInitialized, error } = useScormPlayer({
    contentUrl: scormUrl,
    contentId,
    onProgress,
    onComplete,
  });

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-red-50">
        <div className="text-center p-8 max-w-lg">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Error al cargar contenido SCORM
          </h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <details className="text-left bg-white p-4 rounded border text-sm">
            <summary className="cursor-pointer font-semibold">
              Detalles técnicos
            </summary>
            <p className="text-gray-500 mt-2 break-all">
              <strong>URL Original:</strong>
              <br />
              {scormUrl}
            </p>
            <p className="text-gray-500 mt-2 break-all">
              <strong>URL Procesada:</strong>
              <br />
              {processedUrl}
            </p>
          </details>
        </div>
      </div>
    );
  }

  if (!processedUrl) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Preparando contenido SCORM...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-white">
      {/* Indicador de inicialización */}
      {!isInitialized && (
        <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center py-1 text-sm z-10">
          <span className="inline-block animate-pulse">
            Inicializando contenido SCORM...
          </span>
        </div>
      )}

      {/* Indicador cuando está inicializado */}
      {isInitialized && (
        <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center py-1 text-sm z-10 transition-opacity duration-500">
          <span>✓ SCORM conectado</span>
        </div>
      )}

      {/* iframe del contenido SCORM */}
      <iframe
        src={processedUrl}
        className={`w-full h-full border-0 ${isInitialized ? "pt-7" : "pt-7"}`}
        title={`Contenido SCORM ${contentId}`}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-top-navigation"
        allow="fullscreen; autoplay"
      />
    </div>
  );
};

export default ScormPlayer;
