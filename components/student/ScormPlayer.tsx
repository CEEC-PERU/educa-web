import { ScormPlayerProps } from '@/interfaces/Scorm';
import React, { useRef, useState, useEffect } from 'react';
import { useScormPlayer } from '@/hooks/useScormPlayer';

const ScormPlayer: React.FC<ScormPlayerProps> = ({
  scormUrl,
  contentId,
  studentId,
  onComplete,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { isInitialized, scormData, manualCommit } = useScormPlayer({
    contentId,
    studentId,
    onComplete: () => {
      console.log('Contenido SCORM completado');
      if (onComplete) {
        onComplete();
      }
    },
  });

  const handleIframeLoad = () => {
    setIsLoading(false);
    console.log('SCORM content loaded in iframe');
  };

  const handleIframeError = () => {
    setError('Error al cargar el contenido SCORM.');
    setIsLoading(false);
  };

  const handleClose = () => {
    manualCommit();
    if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      manualCommit();
      e.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [manualCommit]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Cargando contenido SCORM...</p>
        <p className="ml-3">Inicializando...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="bg-brandmorado-700 text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold">Contenido SCORM</h2>
        </div>
        <button
          onClick={handleClose}
          className="bg-white text-brandmorado-700 px-4 py-2 rounded hover:bg-gray-100 transition"
        >
          Cerrar
        </button>
      </div>
      {/* iframe */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <p>Cargando contenido SCORM...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={scormUrl}
          className="w-full h-full border-0"
          title="SCORM Content"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          allow="autoplay; fullscreen"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
        />
      </div>
      <div className="bg-gray-100 p-2 text-sm text-gray-600 text-center">
        Asegúrate de completar el contenido antes de cerrar esta ventana.
      </div>
    </div>
  );
};

export default ScormPlayer;
