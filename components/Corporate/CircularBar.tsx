// components/Corporate/CircularBar.tsx
import React from 'react';

interface CircularBarProps {
  percentage: number;
}

const CircularBar: React.FC<CircularBarProps> = ({ percentage }) => {
  const circumference = 2 * Math.PI * 45; // Radio de 45 para el círculo
  const offset = circumference - (percentage / 100) * circumference;

  return (
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
        stroke="blue"
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
        fill="blue"
      >
        {percentage}%
      </text>
    </svg>
  );
};

export default CircularBar;
