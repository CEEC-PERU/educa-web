import React from "react";

interface ProfessorCardProps {
  name: string;
  title: string;
  level: string;
  imageUrl: string;
  onViewProfile: () => void;
}

const ProfessorCard: React.FC<ProfessorCardProps> = ({
  name,
  title,
  level,
  imageUrl,
  onViewProfile,
}) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Accent bar */}
      <div className="h-16 bg-gradient-to-r from-blue-500 to-indigo-600" />

      {/* Content — avatar overlaps the bar */}
      <div className="flex flex-col items-center -mt-8 px-6 pb-6">
        <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white shadow-sm flex-shrink-0">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>

        <h3 className="mt-3 text-base font-semibold text-gray-900 text-center leading-tight">
          {name}
        </h3>
        <p className="text-sm text-gray-500 text-center mt-0.5 line-clamp-1">
          {title}
        </p>

        <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
          {level}
        </span>

        <button
          onClick={onViewProfile}
          className="mt-5 w-full bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium py-2 rounded-xl transition-colors"
        >
          Ver Perfil
        </button>
      </div>
    </div>
  );
};

export default ProfessorCard;
