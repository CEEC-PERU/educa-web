import React from 'react';

interface VideoPlayerProps {
  videoSrc: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoSrc }) => {
  return (
    <div className="video-player-container">
      <video controls className="w-full h-auto">
        <source src={videoSrc} type="video/mp4" />
        Tu navegador no soporta la reproducción de video.
      </video>
    </div>
  );
};

export default VideoPlayer;
