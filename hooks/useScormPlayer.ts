import { useState } from 'react';
import { ScormPlayerProps } from '@/interfaces/Scorm';

export const useScormPlayer = ({
  contentId,
  studentId,
  onComplete,
}: {
  contentId: string;
  studentId: string;
  onComplete?: () => void;
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [scormData, setScormData] = useState<any>(null);

  const manualCommit = () => {
    // enviar datos SCORM al back
  };

  return {
    isInitialized,
    scormData,
    manualCommit,
  };
};
