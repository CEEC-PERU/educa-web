import React, { useEffect } from 'react';
import {
  CourseModule,
  CourseEvaluation,
  ModuleEvaluation,
  Question,
  UserSessionProgress,
} from '../../interfaces/StudentModule';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useAuth } from '../../context/AuthContext';
import { API_SOCKET_URL } from '../../utils/Endpoints';
import io from 'socket.io-client';

const socket = io(API_SOCKET_URL);

interface CourseSidebarProps {
  courseModules: CourseModule[];
  courseEvaluation: CourseEvaluation;
  onSelect: (
    sessionName: string,
    evaluation?: ModuleEvaluation | Question[],
    moduleId?: number
  ) => void;
  videoProgress?: { [key: string]: number };
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  courseModules,
  courseEvaluation,
  onSelect,
  videoProgress = {},
}) => {
  const { user } = useAuth();
  const userInfo = user as { id: number };

  const getSessionProgress = (session: UserSessionProgress[], sessionId: number) => {
    const sessionProgress =
      session.find(
        (p) => p.session_id === sessionId && p.user_id === userInfo.id
      )?.progress || 0;
    return Math.max(sessionProgress, videoProgress[sessionId] || 0);
  };

  const calculateModuleProgress = (module: CourseModule) => {
    const total = module.moduleSessions.length;
    const sum = module.moduleSessions.reduce(
      (acc, s) => acc + getSessionProgress(s.usersessionprogress, s.session_id),
      0,
    );
    return Math.round(total > 0 ? sum / total : 0);
  };

  useEffect(() => {
    courseModules.forEach((module) => {
      const progress = calculateModuleProgress(module);
      socket.emit('module', {
        module_id: module.module_id,
        progress,
        is_completed: progress === 100,
        user_id: userInfo.id,
      });
    });
  }, [courseModules, userInfo.id]);

  const allModulesCompleted = courseModules.every(
    (module) => calculateModuleProgress(module) === 100
  );

  return (
    <div className="bg-brand-500 text-white divide-y divide-neutral-100 h-full p-4 overflow-y-auto lg:w-96 lg:fixed lg:right-0 lg:top-16 pb-16 lg:h-full w-full">
      {courseModules.map((module, moduleIndex) => {
        const moduleProgress = calculateModuleProgress(module);
        return (
          <div key={module.module_id} className="py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 mr-4">
                <CircularProgressbar
                  value={moduleProgress}
                  text={`${moduleProgress}%`}
                  styles={{ path: { stroke: '#8204E7' }, text: { fill: '#8204E7' } }}
                />
              </div>
              <h2 className="font-bold text-lg flex-1">
                Módulo {moduleIndex + 1}: {module.name}
              </h2>
            </div>

            {module.moduleSessions.map((session, sessionIndex) => {
              const sessionProgress = Math.round(
                getSessionProgress(session.usersessionprogress, session.session_id)
              );
              return (
                <div
                  key={session.session_id}
                  className="cursor-pointer py-2 flex items-center"
                  onClick={() => onSelect(session.name, undefined, module.module_id)}
                >
                  <div className="w-8 h-8 mr-2">
                    <CircularProgressbar
                      value={sessionProgress}
                      text={`${sessionProgress}%`}
                      styles={{ path: { stroke: '#8204E7' }, text: { fill: '#8204E7' } }}
                    />
                  </div>
                  <div className="flex-1">
                    Sesión {sessionIndex + 1}: {session.name}
                  </div>
                </div>
              );
            })}

            <div
              className={`mt-2 cursor-pointer font-bold text-sm ${
                moduleProgress === 100 ? '' : 'text-gray-400'
              }`}
              onClick={() =>
                moduleProgress === 100 &&
                onSelect('', module.moduleEvaluation.questions, module.module_id)
              }
            >
              {module.moduleEvaluation && (
                <div>
                  Evaluación del Módulo {moduleIndex + 1}: {module.moduleEvaluation.name}
                </div>
              )}
            </div>
          </div>
        );
      })}

      <div
        className={`mt-4 py-4 cursor-pointer font-bold text-base ${
          allModulesCompleted ? '' : 'text-gray-400'
        }`}
        onClick={() => allModulesCompleted && onSelect('', courseEvaluation.questions)}
      >
        Evaluación Final: {courseEvaluation.name}
      </div>
    </div>
  );
};

export default CourseSidebar;
