import React, { useEffect, useRef } from 'react';
import { useSessionProgress, CascadeResult } from '@/hooks/useSessionProgress';
import { useAuth } from '@/context/AuthContext';

interface PresentationViewerProps {
  src: string;
  sessionId?: number;
  onCascadeResult?: (result: CascadeResult) => void;
}

const PresentationViewer: React.FC<PresentationViewerProps> = ({
  src,
  sessionId,
  onCascadeResult,
}) => {
  const { user } = useAuth();
  const userInfo = user as { id: number };
  const { sendProgress, cascadeResult } = useSessionProgress(sessionId, userInfo.id);
  const sentRef = useRef(false);

  const onCascadeResultRef = useRef(onCascadeResult);
  onCascadeResultRef.current = onCascadeResult;

  useEffect(() => {
    sentRef.current = false;
  }, [sessionId, src]);

  useEffect(() => {
    if (!sessionId || sentRef.current) return;
    sentRef.current = true;
    sendProgress(100, true);
  }, [sessionId, src, sendProgress]);

  useEffect(() => {
    if (cascadeResult) {
      onCascadeResultRef.current?.(cascadeResult);
    }
  }, [cascadeResult]);

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
