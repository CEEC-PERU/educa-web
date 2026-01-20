import React from 'react';
import { TrainingContent } from '@/interfaces/Training/Training';
import { MdOutlineWebAsset, MdAudiotrack } from 'react-icons/md';
import { FaVideo, FaRegFilePdf, FaLock, FaUnlock } from 'react-icons/fa';
import { BiCalendar } from 'react-icons/bi';
import { HiOutlineArrowRight } from 'react-icons/hi';

interface TrainingContentCardProps {
  content: TrainingContent;
  onView?: () => void;
}

const contentTypeConfig = {
  scorm: {
    icon: MdOutlineWebAsset,
    label: 'SCORM',
    gradient: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200',
  },
  video: {
    icon: FaVideo,
    label: 'Video',
    gradient: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-200',
  },
  pdf: {
    icon: FaRegFilePdf,
    label: 'PDF',
    gradient: 'from-red-500 to-orange-600',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    borderColor: 'border-red-200',
  },
  audio: {
    icon: MdAudiotrack,
    label: 'Audio',
    gradient: 'from-green-500 to-teal-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    borderColor: 'border-green-200',
  },
};

const TrainingContentCard: React.FC<TrainingContentCardProps> = ({
  content,
  onView,
}) => {
  const config = contentTypeConfig[content.content_type];
  const Icon = config.icon;

  return (
    <div className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="absolute top-4 right-4">
        <div
          className={`${config.bgColor} ${config.textColor} ${config.borderColor} border rounded-full px-3 py-1.5 flex items-center gap-2 text-xs font-medium shadow-sm`}
        >
          <Icon className="text-sm" />
          <span>{config.label}</span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4 pr-32">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
            {content.title}
          </h3>
        </div>

        <div className="space-y-3 mb-5">
          <div className="flex items-center gap-2 text-sm">
            {content.is_mandatory ? (
              <>
                <FaLock className="text-red-500" />
                <span className="font-medium text-red-600">Obligatorio</span>
              </>
            ) : (
              <>
                <FaUnlock className="text-green-500" />
                <span className="font-medium text-green-600">Opcional</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700">
              {content.order_index}
            </div>
            <span>Orden en el programa</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <BiCalendar className="text-gray-400" />
            <span>
              Creado el{' '}
              {new Date(content.created_at).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {onView && (
          <button
            onClick={onView}
            className={`w-full mt-4 bg-gradient-to-r ${config.gradient} text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 group-hover:gap-3`}
          >
            <span>Ver contenido</span>
            <HiOutlineArrowRight className="text-lg transition-transform group-hover:translate-x-1" />
          </button>
        )}
      </div>
      <div
        className={`absolute inset-0 border-2 border-transparent group-hover:border-gradient-to-r ${config.gradient} rounded-2xl pointer-events-none transition-all duration-300 opacity-0 group-hover:opacity-100`}
      />
    </div>
  );
};

export default TrainingContentCard;
