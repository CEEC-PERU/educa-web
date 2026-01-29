// components/Training/ContentViewer/ScormPlayer.tsx
import React, { useEffect } from 'react';

interface ScormPlayerProps {
  scormUrl: string;
  scormData: {
    lesson_status: string;
    progress_measure: number;
  };
  onDataChange: (data: {
    completion_status?: string;
    progress_measure?: number;
  }) => void;
}

const ScormPlayer: React.FC<ScormPlayerProps> = ({
  scormUrl,
  onDataChange,
}) => {
  useEffect(() => {
    (window as any).API = {
      LMSInitialize: () => 'true',
      LMSFinish: () => 'true',
      LMSGetValue: (key: string) => '',
      LMSSetValue: (key: string, value: string) => {
        if (key === 'cmi.core.lesson_status') {
          onDataChange({ completion_status: value });
        }
        if (key === 'cmi.core.score.raw') {
          onDataChange({ progress_measure: parseInt(value) / 100 });
        }
        return 'true';
      },
      LMSCommit: () => 'true',
      LMSGetLastError: () => 0,
      LMSGetErrorString: () => 'NoError',
      LMSGetDiagnostic: () => 'NoError',
    };

    return () => {
      delete (window as any).API;
    };
  }, [onDataChange]);

  return (
    <div className="w-full h-full bg-white">
      <iframe
        src={scormUrl}
        className="w-full h-full border-none"
        allow="autoplay; fullscreen"
      />
    </div>
  );
};

export default ScormPlayer;
