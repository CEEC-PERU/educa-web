import React from 'react';
import { Question, ModuleResults, CourseResults } from '../../interfaces/StudentModule';
import PresentationViewer from './PresentationViewer';
import VideoPlayer from './VideoPlayer';
import QuizPlayer from './QuizPlayer';

interface SessionViewerProps {
  sessionVideo?: string;
  sessionId?: number;
  evaluationQuestions?: Question[];
  onUpdated?: () => void;
  onProgress?: (progress: number, isCompleted: boolean) => void;
  videoProgress?: number;
  selectedModuleId?: number | null;
  moduleResults?: ModuleResults[];
  courseResults?: CourseResults[];
}

const SessionViewer: React.FC<SessionViewerProps> = ({
  sessionVideo,
  sessionId,
  evaluationQuestions,
  onUpdated,
  onProgress,
  videoProgress = 0,
  selectedModuleId,
  moduleResults,
  courseResults,
}) => {
  if (sessionVideo) {
    if (sessionVideo.endsWith('.pptx')) {
      return (
        <div className="h-full w-full p-4">
          <PresentationViewer
            key={sessionVideo}
            src={sessionVideo}
            sessionId={sessionId}
            onProgress={onProgress}
          />
        </div>
      );
    }
    return (
      <div className="h-full w-full p-4">
        <VideoPlayer
          key={sessionVideo}
          src={sessionVideo}
          sessionId={sessionId}
          onProgress={onProgress}
          videoProgress={videoProgress}
        />
      </div>
    );
  }

  if (evaluationQuestions && evaluationQuestions.length > 0) {
    return (
      <div className="h-full w-full p-4 relative">
        <QuizPlayer
          key={`${selectedModuleId ?? 'final'}-${evaluationQuestions[0]?.evaluation_id}`}
          evaluationQuestions={evaluationQuestions}
          selectedModuleId={selectedModuleId}
          moduleResults={moduleResults}
          courseResults={courseResults}
          onUpdated={onUpdated}
        />
      </div>
    );
  }

  return (
    <div className="h-full w-full p-4">
      <div className="flex justify-center items-center h-full w-full text-white">
        Selecciona una sesión para iniciar el curso
      </div>
    </div>
  );
};

export default SessionViewer;
