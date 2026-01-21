import React from 'react';

interface AudioPlayerProps {
  audioSrc: string;
  title?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioSrc, title }) => {
  return (
    <div className="audio-player-container">
      {title && <h3 className="audio-title">{title}</h3>}
      <audio controls className="w-full">
        <source src={audioSrc} type="audio/mpeg" />
        Tu navegador no soporta la reproducción de audio.
      </audio>
    </div>
  );
};

export default AudioPlayer;
