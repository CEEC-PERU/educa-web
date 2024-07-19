import React from 'react';

interface ProgressBarProps {
  percentage: number | null;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
  const getColor = (percentage: number | null) => {
    if (percentage === null || percentage === 0) return 'bg-red-500';
    if (percentage <= 30) return 'bg-gray-500';
    if (percentage <= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatus = (percentage: number | null) => {
    if (percentage === null || percentage === 0) return 'no iniciado';
    if (percentage < 100) return 'in progress';
    return 'culminado';
  };

  const displayPercentage = percentage !== null && percentage !== undefined ? percentage : 0;

  return (
    <div className="flex items-center">
      <span className="text-gray-700 mr-2">{displayPercentage}%</span>
      <div className="w-32 bg-gray-200 rounded-full h-2 mx-2">
        <div
          className={`${getColor(displayPercentage)} h-2 rounded-full`}
          style={{ width: `${displayPercentage}%` }}
        ></div>
      </div>
      <span className="ml-2 text-gray-500 text-sm">{getStatus(displayPercentage)}</span>
    </div>
  );
};

export default ProgressBar;
