import React from 'react';
import { useRouter } from 'next/router';
import {
  X,
  ChevronRight,
  FileText,
  Video,
  Monitor,
  BookOpen,
} from 'lucide-react';
import { MyProgramDay } from '@/interfaces/Training/Training';

interface DayContentsModalProps {
  day: MyProgramDay | null;
  isOpen: boolean;
  onClose: () => void;
}

const DayContentsModal: React.FC<DayContentsModalProps> = ({
  day,
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const programId = router.query.programId;

  if (!isOpen || !day) return null;

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'scorm':
        return <Monitor className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const handleContentClick = (contentId: number, contentType: string) => {
    router.push(
      `/student/trainings/${programId}/days/${day.day_id}/contents/${contentId}/${contentType}`,
    );
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-2/3 lg:w-1/2 bg-white shadow-2xl z-50 overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white sticky top-0 z-10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">{day.title}</h2>
              <p className="text-sm text-white/80">
                {day.contents.length} contenido(s) • {day.completion_percentage}
                % completado
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Barra de progreso */}
          <div className="mt-4 bg-white/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${day.completion_percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Contenidos */}
        <div className="p-6 space-y-3">
          {day.contents.map((content, index) => (
            <div
              key={content.content_id}
              onClick={() =>
                handleContentClick(content.content_id, content.content_type)
              }
              className="group relative bg-white border-2 border-gray-200 hover:border-blue-400 rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg"
            >
              {/* Número */}
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                {index + 1}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1 ml-6">
                  <div className="p-3 bg-gray-50 group-hover:bg-blue-50 rounded-xl border border-gray-200 group-hover:border-blue-300 transition-all">
                    {getContentIcon(content.content_type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {content.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-200">
                        {content.content_type.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {parseFloat(content.progress_percentage).toFixed(0)}%
                        completado
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>

              {/* Barra de progreso */}
              <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${content.progress_percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Animación */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default DayContentsModal;
