import React, { useState, useEffect, useRef } from 'react';
import { useSesionProgress } from '../../hooks/useProgressSession';
import { useAuth } from '../../context/AuthContext';

interface VideoPlayerProps {
  src: string;
  sessionId?: number;
  onProgress?: (progress: number, isCompleted: boolean) => void;
  videoProgress?: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  sessionId,
  onProgress,
  videoProgress = 0,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isProgressSent = useRef(false);

  const { createSession_Progress } = useSesionProgress();
  const { user } = useAuth();
  const userInfo = user as { id: number };

  useEffect(() => {
    isProgressSent.current = false;
  }, [sessionId, src]);

  useEffect(() => {
    if (!videoRef.current) return;

    const sendSessionProgress = async (progress: number, isCompleted: boolean) => {
      if (!sessionId || isProgressSent.current) return;

      await createSession_Progress({
        session_id: sessionId,
        progress: Math.round(progress),
        is_completed: isCompleted,
        user_id: userInfo.id,
      });

      if (!isCompleted) {
        isProgressSent.current = false;
      }
    };

    const handleTimeUpdate = () => {
      const video = videoRef.current!;
      const progress = (video.currentTime / video.duration) * 100;

      if (onProgress) onProgress(progress, false);

      if (progress >= 100 && !isProgressSent.current) {
        sendSessionProgress(100, true);
        isProgressSent.current = true;
      }

      setCurrentTime(video.currentTime);
    };

    const handlePause = () => {
      if (!videoRef.current) return;
      const video = videoRef.current;
      const progress = (video.currentTime / video.duration) * 100;
      sendSessionProgress(progress, false);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && videoRef.current) {
        videoRef.current.pause();
      }
    };

    const handlePopState = () => {
      if (!videoRef.current) return;
      const video = videoRef.current;
      const progress = (video.currentTime / video.duration) * 100;
      sendSessionProgress(progress, false);
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!videoRef.current) return;
      const video = videoRef.current;
      const progress = (video.currentTime / video.duration) * 100;
      if (onProgress) onProgress(progress, false);
      video.pause();
      e.preventDefault();
      e.returnValue = '';
    };

    const handleSeeking = () => {
      if (videoRef.current!.currentTime > currentTime) {
        videoRef.current!.currentTime = currentTime;
      }
    };

    const video = videoRef.current;
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('seeking', handleSeeking);
    video.addEventListener('pause', handlePause);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    if (videoProgress > 0 && !videoEnded) {
      const targetTime = (videoProgress / 100) * video.duration;
      if (targetTime > 0 && targetTime < video.duration) {
        video.currentTime = targetTime;
      }
    }

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('seeking', handleSeeking);
      video.removeEventListener('pause', handlePause);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onProgress, currentTime, videoProgress, videoEnded, src]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full">
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
          <video
            key={src}
            controls
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
            className="w-full h-full object-contain"
            playsInline
            onEnded={() => setVideoEnded(true)}
            ref={videoRef}
          >
            <source src={src} type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
