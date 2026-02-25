import React, { useRef } from 'react';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import {
  MediaPlayer,
  MediaProvider,
  MediaPlayerInstance,
  MediaTimeUpdateEventDetail,
  MediaTimeUpdateEvent,
  MediaRateChangeEvent,
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

  // --- LÓGICA DE VELOCIDAD ---
  const handleRateChange = (detail: number, event: MediaRateChangeEvent) => {
    const MAX_SPEED = 1.5;

    // Si la nueva velocidad es mayor a 1.5
    if (detail > MAX_SPEED && player.current) {
      // Forzamos a que sea 1.5
      player.current.playbackRate = MAX_SPEED;
    }
  };

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
        onRateChange={handleRateChange} // <-- Escuchamos el cambio de velocidad
        onEnded={() => {
          lastSavedProgress.current = 100;
          onEnded();
        }}
        className="w-full max-w-5xl aspect-video shadow-2xl"
        playsInline
      >
        <MediaProvider>
          <video
            controlsList="nodownload noplaybackrate" // Intenta ocultar el menú nativo en algunos navegadores
            onContextMenu={(e) => e.preventDefault()}
            className="w-full h-full"
          />
        </MediaProvider>

        <DefaultVideoLayout
          icons={defaultLayoutIcons}
          slots={{
            beforeTimeSlider: null,
            timeSlider: null,
            afterTimeSlider: null,
          }}
        />
      </MediaPlayer>
    </div>
  );
};

export default VideoPlayer;
