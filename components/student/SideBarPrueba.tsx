import React from 'react';
import { CourseModule, ModuleEvaluation, Question, UserSessionProgress } from '../../interfaces/StudentModule';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  courseModules: CourseModule[];
  courseEvaluation: ModuleEvaluation;
  moduleEvaluations: ModuleEvaluation[];
  onSelect: (sessionName: string, evaluation?: ModuleEvaluation | Question[], moduleId?: number) => void;
  videoProgress?: { [key: string]: number };
}

const SidebarPrueba: React.FC<SidebarProps> = ({ courseModules, courseEvaluation, moduleEvaluations, onSelect, videoProgress = {} }) => {
  const { user } = useAuth();
  const userInfo = user as { id: number };

  const getSessionProgress = (progresses: UserSessionProgress[], videoProgress: number) => {
    const progress = progresses?.[0]?.progress ?? 0;
    return Math.max(progress, videoProgress);
  };

  const calculateModuleProgress = (module: CourseModule, videoProgress: { [key: string]: number }) => {
    const sessions = module.moduleSessions;
    const totalSessions = sessions.length;
    const totalProgress = sessions.reduce((acc, session) => {
      const sessionProgress = getSessionProgress(session.usersessionprogress, videoProgress[session.session_id] || 0);
      return acc + sessionProgress;
    }, 0);

    const progressNumber = Math.round(totalSessions > 0 ? totalProgress / totalSessions : 0);
    const isCompleted = progressNumber === 100;

    return progressNumber;
  };

  const allModulesCompleted = courseModules.every(module => module.usermoduleprogress?.[0]?.progress === 100);

  return (
    <div className="bg-brand-500 text-white divide-y divide-neutral-100 h-full p-4 overflow-y-auto lg:w-96 lg:fixed lg:right-0 lg:top-16 lg:h-full w-full">
      {courseModules.map((module, moduleIndex) => {
        const moduleProgress = calculateModuleProgress(module, videoProgress);
        const roundedModuleProgress = Math.round(moduleProgress);

        return (
          <div key={moduleIndex} className="py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 mr-4">
                <CircularProgressbar value={moduleProgress} text={`${roundedModuleProgress}%`} 
                  styles={{
                    path: { stroke: "#8204E7" },
                    text: { fill: "#8204E7" },
                  }} 
                />
              </div>
              <h2 className="font-bold text-lg flex-1">Módulo {moduleIndex + 1}: {module.name}</h2>
            </div>
            {module.moduleSessions.map((session, sessionIndex) => {
              const sessionProgress = getSessionProgress(session.usersessionprogress, videoProgress[session.session_id] || 0);
              const roundedSessionProgress = Math.round(sessionProgress);

              return (
                <div
                  key={sessionIndex}
                  className="cursor-pointer py-2 flex items-center"
                  onClick={() => onSelect(session.name, undefined, module.module_id)}
                >
                  <div className="w-8 h-8 mr-2">
                    <CircularProgressbar value={sessionProgress} text={`${roundedSessionProgress}%`} 
                      styles={{
                        path: { stroke: "#8204E7" },
                        text: { fill: "#8204E7" },
                      }} 
                    />
                  </div>
                  <div className="flex-1">
                    Sesión {sessionIndex + 1}: {session.name}
                  </div>
                </div>
              );
            })}
            <div
              className={`mt-2 cursor-pointer font-bold text-sm ${moduleProgress === 100 ? '' : 'text-gray-400'}`}
              onClick={() => moduleProgress === 100 && onSelect('', module.moduleEvaluation.questions, module.module_id)}
            >
              Evaluación del Módulo {moduleIndex + 1}: {module.moduleEvaluation.name}
            </div>
          </div>
        );
      })}
      <div
        className={`mt-4 py-4 cursor-pointer font-bold text-base ${allModulesCompleted ? '' : 'text-gray-400'}`}
        onClick={() => allModulesCompleted && onSelect('', courseEvaluation.questions)}
      >
        Evaluación Final: {courseEvaluation.name}
      </div>
    </div>
  );
};

export default SidebarPrueba;
