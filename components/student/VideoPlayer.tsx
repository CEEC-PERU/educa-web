import React, { useEffect, useRef } from "react";
import { useSessionProgress, CascadeResult } from "@/hooks/useSessionProgress";
import { useAuth } from "@/context/AuthContext";

interface VideoPlayerProps {
  src: string;
  sessionId?: number;
  onProgress?: (progress: number, isCompleted: boolean) => void;
  onCascadeResult?: (result: CascadeResult) => void;
  videoProgress?: number;
  sessionCompleted?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  sessionId,
  onProgress,
  onCascadeResult,
  videoProgress = 0,
  sessionCompleted = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const completionSentRef = useRef(false);
  const lastTimeRef = useRef(0);

  const { user } = useAuth();
  const userId = (user as { id: number } | null)?.id ?? 0;

  const { sendProgress, sendProgressDebounced, cascadeResult } =
    useSessionProgress(sessionId, userId);

  const onCascadeResultRef = useRef(onCascadeResult);
  onCascadeResultRef.current = onCascadeResult;

  useEffect(() => {
    if (cascadeResult) {
      onCascadeResultRef.current?.(cascadeResult);
    }
  }, [cascadeResult]);

  useEffect(() => {
    completionSentRef.current = false;
    lastTimeRef.current = 0;
  }, [sessionId, src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100;
      sendProgressDebounced(progress, false);
      if (progress >= 100 && !completionSentRef.current) {
        completionSentRef.current = true;
        sendProgress(100, true);
      }
      lastTimeRef.current = video.currentTime;
    };

    const handleEnded = () => {
      sendProgressDebounced.cancel();
      completionSentRef.current = true;
      sendProgress(100, true);
    };

    const handlePause = () => {
      const progress = (video.currentTime / video.duration) * 100;
      sendProgressDebounced.cancel();
      sendProgress(progress, progress >= 100);
    };

    // seeking: intenta bloquear al inicio (webkit, Firefox)
    // seeked:  corrige si el browser completó el seek igual (Firefox fallback)
    const handleSeekGuard = () => {
      if (sessionCompleted) return;
      if (video.currentTime > lastTimeRef.current) {
        video.currentTime = lastTimeRef.current;
      }
    };

    const handleLoadedMetadata = () => {
      if (videoProgress > 0) {
        const targetTime = (videoProgress / 100) * video.duration;
        if (targetTime > 0 && targetTime < video.duration) {
          video.currentTime = targetTime;
          lastTimeRef.current = targetTime;
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") video.pause();
    };

    const saveProgress = () => {
      if (!video.duration) return;
      sendProgressDebounced.cancel();
      sendProgress((video.currentTime / video.duration) * 100, false);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("seeking", handleSeekGuard);
    video.addEventListener("seeked", handleSeekGuard);
    video.addEventListener("pause", handlePause);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", saveProgress);
    window.addEventListener("popstate", saveProgress);

    return () => {
      saveProgress();
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("seeking", handleSeekGuard);
      video.removeEventListener("seeked", handleSeekGuard);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", saveProgress);
      window.removeEventListener("popstate", saveProgress);
    };
  }, [videoProgress, sessionCompleted, src, sendProgress, sendProgressDebounced]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full">
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
          <video
            key={src}
            ref={videoRef}
            controls
            controlsList="nodownload"
            className={`w-full h-full object-contain${!sessionCompleted ? " no-seekbar" : ""}`}
            playsInline
            onContextMenu={(e) => e.preventDefault()}
          >
            <source src={src} type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
