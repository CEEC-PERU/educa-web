import React from 'react';
import { CourseModule, ModuleEvaluation, Question, UserSessionProgress } from '../../interfaces/StudentModule';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface SidebarProps {
  courseModules: CourseModule[];
  courseEvaluation: ModuleEvaluation;
  moduleEvaluations: ModuleEvaluation[];
  onSelect: (sessionName: string, evaluation?: ModuleEvaluation | Question[]) => void;
}

const getSessionProgress = (progresses: UserSessionProgress[]) => {
  const progress = progresses?.[0]?.progress ?? 0;
  return progress;
};

const SidebarPrueba: React.FC<SidebarProps> = ({ courseModules, courseEvaluation, moduleEvaluations, onSelect }) => {
  return (
    <div className="bg-brand-500 text-white divide-y divide-neutral-100 h-full p-4 overflow-y-auto lg:w-96 lg:fixed lg:right-0 lg:top-16 lg:h-full w-full">
      {courseModules.map((module, index) => (
        <div key={index} className="py-4">
          <div className="flex items-center">
            <div className="w-10 h-10 mr-4">
              <CircularProgressbar value={module.usermoduleprogress?.[0]?.progress ?? 0} text={`${module.usermoduleprogress?.[0]?.progress ?? 0}%`} />
            </div>
            <h2 className="font-bold text-lg flex-1">Módulo {index + 1}: {module.name}</h2>
          </div>
          {module.moduleSessions.map((session, idx) => {
            const sessionProgress = getSessionProgress(session.usersessionprogress);
            return (
              <div key={idx} className="cursor-pointer py-2 flex items-center" onClick={() => onSelect(session.name)}>
                <div className="w-8 h-8 mr-2">
                  <CircularProgressbar value={sessionProgress} text={`${sessionProgress}%`} />
                </div>
                <div className="flex-1">
                  Sesión {idx + 1}: {session.name}
                </div>
              </div>
            );
          })}
          {moduleEvaluations.map((evaluation, idx) => (
            <div key={idx} className="mt-2 cursor-pointer font-bold text-sm" onClick={() => onSelect('', evaluation)}>
              Evaluación del Módulo {idx + 1}: {evaluation.name}
            </div>
          ))}
        </div>
      ))}
      <div className="mt-4 py-4">
        <div className="cursor-pointer font-bold text-base" onClick={() => onSelect('', courseEvaluation)}>
          Evaluación Final: {courseEvaluation.name}
        </div>
      </div>
    </div>
  );
};

export default SidebarPrueba;
