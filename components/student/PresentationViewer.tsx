import React, { useEffect, useRef } from 'react';
import { useSesionProgress } from '../../hooks/useProgressSession';
import { useAuth } from '../../context/AuthContext';

interface PresentationViewerProps {
  src: string;
  sessionId?: number;
  onProgress?: (progress: number, isCompleted: boolean) => void;
}

const PresentationViewer: React.FC<PresentationViewerProps> = ({
  src,
  sessionId,
  onProgress,
}) => {
  const { createSession_Progress } = useSesionProgress();
  const { user } = useAuth();
  const userInfo = user as { id: number };
  const isProgressSent = useRef(false);

  useEffect(() => {
    isProgressSent.current = false;
  }, [sessionId, src]);

  useEffect(() => {
    if (!sessionId || isProgressSent.current) return;

    const sendProgress = async () => {
      await createSession_Progress({
        session_id: sessionId,
        progress: 100,
        is_completed: true,
        user_id: userInfo.id,
      });
      if (onProgress) onProgress(100, true);
      isProgressSent.current = true;
    };

    sendProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, src]);

  return (
    <div className="flex flex-col items-center h-full">
      <iframe
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(src)}`}
        width="100%"
        height="600px"
        frameBorder="0"
        title="PPTX Viewer"
        allowFullScreen
        style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px #0002' }}
      />
    </div>
  );
};

export default PresentationViewer;
