import React from 'react';
import { Question, ModuleResults, CourseResults } from '../../interfaces/StudentModule';
import { CascadeResult } from '@/hooks/useSessionProgress';
import PresentationViewer from './PresentationViewer';
import VideoPlayer from './VideoPlayer';
import QuizPlayer from './QuizPlayer';

interface SessionViewerProps {
  sessionVideo?: string;
  sessionId?: number;
  evaluationQuestions?: Question[];
  onUpdated?: () => void;
  onCascadeResult?: (result: CascadeResult) => void;
  videoProgress?: number;
  sessionCompleted?: boolean;
  selectedModuleId?: number | null;
  moduleResults?: ModuleResults[];
  courseResults?: CourseResults[];
}

const SessionViewer: React.FC<SessionViewerProps> = ({
  sessionVideo,
  sessionId,
  evaluationQuestions,
  onUpdated,
  onCascadeResult,
  videoProgress = 0,
  sessionCompleted = false,
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
            onCascadeResult={onCascadeResult}
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
          onCascadeResult={onCascadeResult}
          videoProgress={videoProgress}
          sessionCompleted={sessionCompleted}
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
