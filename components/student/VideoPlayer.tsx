import React, { useEffect, useRef, useState } from "react";
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
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const completionSentRef = useRef(false);
  const currentTimeRef = useRef(0);

  const { user } = useAuth();
  const userInfo = user as { id: number };

  const { sendProgress, sendProgressDebounced, cascadeResult } =
    useSessionProgress(sessionId, userInfo.id);

  const onCascadeResultRef = useRef(onCascadeResult);
  onCascadeResultRef.current = onCascadeResult;

  useEffect(() => {
    if (cascadeResult) {
      onCascadeResultRef.current?.(cascadeResult);
    }
  }, [cascadeResult]);

  useEffect(() => {
    completionSentRef.current = false;
    setVideoEnded(false);
  }, [sessionId, src]);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100;

      sendProgressDebounced(progress, false);

      if (progress >= 100 && !completionSentRef.current) {
        completionSentRef.current = true;
        sendProgress(100, true);
      }

      currentTimeRef.current = video.currentTime;
    };

    const handlePause = () => {
      const progress = (video.currentTime / video.duration) * 100;
      sendProgressDebounced.cancel();
      sendProgress(progress, false);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        video.pause();
      }
    };

    const handlePopState = () => {
      const progress = (video.currentTime / video.duration) * 100;
      sendProgressDebounced.cancel();
      sendProgress(progress, false);
    };

    const handleBeforeUnload = () => {
      const progress = (video.currentTime / video.duration) * 100;
      sendProgressDebounced.cancel();
      sendProgress(progress, false);
      video.pause();
    };

    const handleSeeking = () => {
      if (sessionCompleted) return;
      if (video.currentTime > currentTimeRef.current) {
        video.currentTime = currentTimeRef.current;
      }
    };

    const handleLoadedMetadata = () => {
      if (videoProgress > 0 && !sessionCompleted) {
        const targetTime = (videoProgress / 100) * video.duration;
        if (targetTime > 0 && targetTime < video.duration) {
          video.currentTime = targetTime;
          currentTimeRef.current = targetTime;
        }
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("seeking", handleSeeking);
    video.addEventListener("pause", handlePause);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("seeking", handleSeeking);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [
    videoProgress,
    sessionCompleted,
    videoEnded,
    src,
    sendProgress,
    sendProgressDebounced,
  ]);

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
