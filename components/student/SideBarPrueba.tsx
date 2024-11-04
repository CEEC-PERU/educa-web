import React, { useState, useEffect, useRef } from 'react';
import { CourseModule, ModuleEvaluation, Question, UserSessionProgress } from '../../interfaces/StudentModule';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useAuth } from '../../context/AuthContext';
import { API_SOCKET_URL } from '../../utils/Endpoints';
import io from 'socket.io-client';
const socket = io(API_SOCKET_URL);
interface SidebarProps {
  courseModules: CourseModule[];
  courseEvaluation: ModuleEvaluation;
  moduleEvaluations: ModuleEvaluation[];
  onSelect: (sessionName: string, evaluation?: ModuleEvaluation | Question[], moduleId?: number) => void;
  videoProgress?: { [key: string]: number };
}

const SidebarPrueba: React.FC<SidebarProps> = ({ courseModules, courseEvaluation, onSelect, videoProgress = {} }) => {
  const { user } = useAuth();
  const userInfo = user as { id: number };

  useEffect(() => {
    // Emitir progreso del módulo al servidor cuando cambie
    courseModules.forEach(module => {
      const moduleProgress = calculateModuleProgress(module);
      socket.emit('module', {
        module_id: module.module_id,
        progress: moduleProgress,
        is_completed: moduleProgress === 100,
        user_id: userInfo.id
      });
    });
  }, [courseModules, userInfo.id]);
  // Función para obtener el progreso de una sesión
  const getSessionProgress = (session: UserSessionProgress[], sessionId: number) => {
    const sessionProgress = session.find(progress => progress.session_id === sessionId && progress.user_id === userInfo.id)?.progress || 0;
    const videoProg = videoProgress[sessionId] || 0;
    return Math.max(sessionProgress, videoProg);
  };

  // Función para calcular el progreso total de un módulo
  const calculateModuleProgress = (module: CourseModule) => {
    const totalSessions = module.moduleSessions.length;
    const totalProgress = module.moduleSessions.reduce((acc, session) => {
      const progress = getSessionProgress(session.usersessionprogress, session.session_id);
      return acc + progress;
    }, 0);

    return Math.round(totalSessions > 0 ? totalProgress / totalSessions : 0);
  };

  // Verificar si todos los módulos están completados
  const allModulesCompleted = courseModules.every(module => calculateModuleProgress(module) === 100);

  return (
    <div className="bg-brand-500 text-white divide-y divide-neutral-100 h-full p-4 overflow-y-auto lg:w-96 lg:fixed lg:right-0 lg:top-16  pb-16 lg:h-full w-full">
      {courseModules.map((module, moduleIndex) => {
        const moduleProgress = calculateModuleProgress(module);
        const roundedModuleProgress = Math.round(moduleProgress);
        return (
          <div key={module.module_id} className="py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 mr-4">
                <CircularProgressbar
                  value={moduleProgress}
                  text={`${roundedModuleProgress}%`} 
                  styles={{
                    path: { stroke: "#8204E7" },
                    text: { fill: "#8204E7" },
                  }} 
                />
              </div>
              <h2 className="font-bold text-lg flex-1">Módulo {moduleIndex + 1}: {module.name}</h2>
            </div>
            {module.moduleSessions.map((session, sessionIndex) => {
              const sessionProgress = getSessionProgress(session.usersessionprogress, session.session_id);
              const roundedSessionProgress = Math.round(sessionProgress);
              console.log("SessionProgress" , sessionProgress)
              return (
                <div
                  key={session.session_id}
                  className="cursor-pointer py-2 flex items-center"
                  onClick={() => onSelect(session.name, undefined, module.module_id)}
                >
                  <div className="w-8 h-8 mr-2">
                    <CircularProgressbar
                      value={sessionProgress}
                      text={`${roundedSessionProgress}%`}
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
