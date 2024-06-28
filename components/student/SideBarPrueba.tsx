import React from 'react';
import { CourseModule, ModuleEvaluation, Question, UserSessionProgress } from '../../interfaces/StudentModule';
import { CircularProgressbar } from 'react-circular-progressbar';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import 'react-circular-progressbar/dist/styles.css';

interface SidebarProps {
  courseModules: CourseModule[];
  courseEvaluation: ModuleEvaluation;
  moduleEvaluations: ModuleEvaluation[];
  onSelect: (sessionName: string, evaluation?: ModuleEvaluation | Question[]) => void;
}

// Función que obtiene el progreso de una sesión
const getSessionProgress = (progresses: UserSessionProgress[]) => {
  const progress = progresses?.[0]?.progress ?? 0;
  return progress;
};

// Función para determinar si todos los módulos están completos
const areAllModulesCompleted = (modules: CourseModule[]) => {
  return modules.every(module => module.usermoduleprogress?.[0]?.progress === 100);
};

// Función para determinar si todas las sesiones de un módulo están completas
const areAllSessionsCompleted = (sessions: UserSessionProgress[]) => {
  return sessions.every(session => session.progress === 100);
};

// Componente SidebarPrueba
const SidebarPrueba: React.FC<SidebarProps> = ({ courseModules, courseEvaluation, moduleEvaluations, onSelect }) => {

  // Función que determina si una sesión está bloqueada
  const isLocked = (progress: number, allCompleted: boolean) => {
    return progress === 0 || !allCompleted;
  };

  // Verifica si todos los módulos están completos
  const allModulesCompleted = areAllModulesCompleted(courseModules);

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
            const allSessionsCompleted = areAllSessionsCompleted(session.usersessionprogress);
            const locked = isLocked(sessionProgress, allSessionsCompleted);

            return (
              <div
                key={idx}
                className={`cursor-pointer py-2 flex items-center ${locked ? 'text-gray-400' : ''}`}
                onClick={() => !locked && onSelect(session.name)}
              >
                <div className="w-8 h-8 mr-2">
                  <CircularProgressbar value={sessionProgress} text={`${sessionProgress}%`} />
                </div>
                <div className="flex-1">
                  {locked ? <LockClosedIcon className="w-5 h-5 inline-block mr-2" /> : null}
                  Sesión {idx + 1}: {session.name}
                </div>
              </div>
            );
          })}
          <div className="mt-2 cursor-pointer font-bold text-sm" onClick={() => onSelect('', module.moduleEvaluation)}>
            Evaluación del Módulo {index + 1}: {module.moduleEvaluation.name}
            {allModulesCompleted ? null : <LockClosedIcon className="w-5 h-5 inline-block ml-2" />}
          </div>
        </div>
      ))}
      <div className="mt-4 py-4">
        <div className="cursor-pointer font-bold text-base" onClick={() => onSelect('', courseEvaluation)}>
          Evaluación Final: {courseEvaluation.name}
          {allModulesCompleted ? null : <LockClosedIcon className="w-5 h-5 inline-block ml-2" />}
        </div>
      </div>
    </div>
  );
};

export default SidebarPrueba;
