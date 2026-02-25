// components/Training/ContentViewer/PDFViewer.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Clock, CheckCircle } from 'lucide-react';

interface PDFViewerProps {
  url: string;
  onComplete: () => void;
  totalPages?: number;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  url,
  onComplete,
  totalPages,
}) => {
  const requiredTime = useMemo(
    () => (totalPages && totalPages > 0 ? totalPages : 1) * 60,
    [totalPages],
  );

  const [secondsLeft, setSecondsLeft] = useState(requiredTime);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  const isReady = secondsLeft <= 0;

  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-gray-800">
      <div className="flex-1 relative">
        <iframe
          src={`${url}#toolbar=0`}
          className="w-full h-full border-none"
          title="Visor PDF"
        />
      </div>
      <div className="bg-gray-900 p-4 flex justify-between items-center border-t border-gray-700">
        {isReady ? (
          <>
            <p className="text-green-400 text-xs flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              Tiempo de lectura completado. Ya puedes marcar como leído.
            </p>
            <button
              onClick={onComplete}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg transition-all shadow-lg animate-fade-in"
            >
              Marcar como leído
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-400 text-xs">
              Lee el documento completo antes de marcarlo como leído.
            </p>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-amber-400 text-sm font-mono font-semibold">
                <Clock className="w-4 h-4 animate-pulse" />
                {formatTime(secondsLeft)}
              </span>
              <button
                disabled
                className="px-4 py-2 bg-gray-600 text-gray-400 text-sm font-bold rounded-lg cursor-not-allowed opacity-50"
              >
                Marcar como leído
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;
