import React from "react";
import {
  ClockIcon,
  DocumentCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

interface CourseDetailViewProps {
  name: string;
  imageUrl?: string;
  descriptionShort?: string;
  descriptionLarge?: string;
  evaluationName?: string;
  duration?: string;
  isActive?: boolean;
  videoUrl?: string;
}

const DetailView: React.FC<CourseDetailViewProps> = ({
  name,
  imageUrl,
  descriptionShort,
  descriptionLarge,
  evaluationName,
  duration,
  isActive,
  videoUrl,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {imageUrl && (
        <div className="w-full aspect-video overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6 flex flex-col gap-5">
        <h1 className="text-2xl font-semibold text-gray-900">{name}</h1>

        {descriptionShort && (
          <p className="text-sm text-gray-500 italic border-l-2 border-blue-400 pl-3">
            {descriptionShort}
          </p>
        )}

        <hr className="border-gray-100" />

        {descriptionLarge && (
          <p className="text-base text-gray-700 leading-relaxed">
            {descriptionLarge}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          {duration && (
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
              <ClockIcon className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400 leading-none mb-0.5">
                  Duración
                </p>
                <p className="text-sm font-medium text-gray-700">{duration}</p>
              </div>
            </div>
          )}

          {evaluationName && (
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
              <DocumentCheckIcon className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400 leading-none mb-0.5">
                  Evaluación
                </p>
                <p className="text-sm font-medium text-gray-700">
                  {evaluationName}
                </p>
              </div>
            </div>
          )}

          <div
            className={`flex items-center gap-2 rounded-xl px-4 py-2 border ${
              isActive
                ? "bg-green-50 border-green-200"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            {isActive ? (
              <CheckCircleIcon className="w-4 h-4 text-green-500" />
            ) : (
              <XCircleIcon className="w-4 h-4 text-gray-400" />
            )}
            <p
              className={`text-sm font-medium ${
                isActive ? "text-green-700" : "text-gray-500"
              }`}
            >
              {isActive ? "Activo" : "Inactivo"}
            </p>
          </div>
        </div>

        {videoUrl && (
          <div className="flex flex-col gap-2 pt-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Video de introducción
            </p>
            <div className="aspect-video rounded-xl overflow-hidden bg-black">
              <video src={videoUrl} controls className="w-full h-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailView;
