import React from 'react';

interface CircularBarProps {
  percentage: number;
  label: string;
}

const CircularBar: React.FC<CircularBarProps> = ({ percentage, label }) => {
  const circumference = 2 * Math.PI * 45; // Radio de 45 para el círculo
  const offset = circumference - (percentage / 100) * circumference;

  let strokeColor;
  if (percentage <= 30) {
    strokeColor = 'red';
  } else if (percentage <= 70) {
    strokeColor = 'blue';
  } else {
    strokeColor = 'green';
  }

  return (
    <div className="relative flex flex-col items-center">
      <svg width="100" height="100">
        <circle
          stroke="gray"
          fill="transparent"
          strokeWidth="10"
          r="45"
          cx="50"
          cy="50"
        />
        <circle
          stroke={strokeColor}
          fill="transparent"
          strokeWidth="10"
          r="45"
          cx="50"
          cy="50"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize="20px"
          fill={strokeColor}
        >
          {percentage}%
        </text>
      </svg>
      <div className="text-center mt-2">{label}</div>
    </div>
  );
};

export default CircularBar;
