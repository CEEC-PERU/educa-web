import React, { useRef } from 'react';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import {
  MediaPlayer,
  MediaProvider,
  MediaPlayerInstance,
  MediaTimeUpdateEventDetail,
  MediaTimeUpdateEvent,
} from '@vidstack/react';
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';

interface VideoPlayerProps {
  url: string;
  onProgress: (state: { played: number; playedSeconds: number }) => void;
  onEnded: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  onProgress,
  onEnded,
}) => {
  const player = useRef<MediaPlayerInstance>(null);
  const lastSavedProgress = useRef<number>(0);

  const handleTimeUpdate = (
    detail: MediaTimeUpdateEventDetail,
    event: MediaTimeUpdateEvent,
  ) => {
    const { currentTime } = detail;
    const { duration } = event.target;

    if (duration > 0) {
      const currentProgress = (currentTime / duration) * 100;

      if (
        currentProgress - lastSavedProgress.current >= 1 ||
        currentProgress === 100
      ) {
        lastSavedProgress.current = currentProgress;

        onProgress({
          played: currentProgress,
          playedSeconds: currentTime,
        });
      }
    }
  };

  return (
    <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden">
      <MediaPlayer
        ref={player}
        title="Capacitación MentorMind"
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          lastSavedProgress.current = 100;
          onEnded();
        }}
        className="w-full max-w-5xl aspect-video shadow-2xl"
        playsInline
      >
        <MediaProvider>
          <video
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
            className="w-full h-full"
          />
        </MediaProvider>
        <DefaultVideoLayout icons={defaultLayoutIcons} />
      </MediaPlayer>
    </div>
  );
};

export default VideoPlayer;
