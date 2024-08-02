import React from 'react';

interface ControlsDrawerProps {
  onPrevious: () => void;
  onNext: () => void;
  onPause: () => void;
  onPlay: () => void;
  onVolumeChange: (volume: number) => void;
  onFullscreen: () => void;
}

const ControlsDrawer: React.FC<ControlsDrawerProps> = ({
  onPrevious,
  onNext,
  onPause,
  onPlay,
  onVolumeChange,
  onFullscreen,
}) => {
  return (
    <div className="controls-drawer flex justify-around w-full fixed bottom-0 bg-white p-2 border-t border-gray-300">
      <button onClick={onPrevious}>◀️</button>
      <button onClick={onPause}>⏸️</button>
      <button onClick={onPlay}>▶️</button>
      <button onClick={onNext}>▶️▶️</button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
      />
      <button onClick={onFullscreen}>🔲</button>
    </div>
  );
};

export default ControlsDrawer;
