import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  bgColor: string;
  textColor: string;
}

export const StatCard = ({
  title,
  value,
  icon,
  bgColor,
  textColor,
}: StatCardProps) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className={`text-2xl font-bold ${textColor}`}>{value}</h3>
        </div>
        <div className={`${bgColor} p-3 rounded-full ${textColor}`}>{icon}</div>
      </div>
    </div>
  );
};
