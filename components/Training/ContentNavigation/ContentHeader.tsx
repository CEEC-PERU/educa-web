import React from 'react';
import {
  ChevronLeft,
  FileText,
  Video,
  Monitor,
  BookOpen,
  Info,
} from 'lucide-react';
import { MyContentDetails } from '@/interfaces/Training/Training';

interface ContentHeaderProps {
  programTitle: string;
  dayNumber: number;
  onBack: () => void;
  content: MyContentDetails;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({
  programTitle,
  dayNumber,
  onBack,
  content,
}) => {
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

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 group"
              title="Volver al programa"
            >
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </button>

            <div>
              <nav className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <span className="truncate max-w-[150px]">{programTitle}</span>
                <span>/</span>
                <span>Día {dayNumber}</span>
              </nav>
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                  {getContentIcon(content.content_type)}
                </div>
                <h1 className="text-lg md:text-xl font-bold text-gray-900 truncate max-w-[300px] md:max-w-md">
                  {content.title}
                </h1>
              </div>
            </div>
          </div>

          {/* badges de estado */}
          <div className="flex items-center gap-3 self-end md:self-center">
            {content.is_mandatory && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
                <Info className="w-3.5 h-3.5" />
                Obligatorio
              </span>
            )}

            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                Tu Progreso
              </span>
              <span className="text-sm font-bold text-blue-600">
                {content.progress_percentage}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* barra de progreso */}
      <div className="w-full h-1 bg-gray-100">
        <div
          className="h-full bg-blue-600 transition-all duration-1000 ease-out"
          style={{ width: `${content.progress_percentage}%` }}
        />
      </div>
    </header>
  );
};

export default ContentHeader;
