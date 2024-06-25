import React from 'react';
import { CourseModule, ModuleEvaluation, Question } from '../../interfaces/StudentModule';

interface SidebarProps {
  courseModules: CourseModule[];
  courseEvaluation: ModuleEvaluation;
  moduleEvaluations: ModuleEvaluation[];
  onSelect: (sessionName: string, evaluation?: ModuleEvaluation | Question[]) => void;
}

const SidebarPrueba: React.FC<SidebarProps> = ({ courseModules, courseEvaluation, moduleEvaluations, onSelect }) => {
  return (
    <div className="w-80 bg-brand-500 text-white h-full p-4 overflow-y-auto fixed right-0 top-16 divide-y divide-neutral-100"> {/* Cambiado w-64 a w-80 */}
      {courseModules.map((module, index) => (
        <div key={index} className="py-4"> {/* added padding */}
          <h2 className="font-bold text-lg">Módulo {index + 1}: {module.name}</h2>
          <div className="divide-y divide-neutral-100"> {/* added divide-y for moduleSessions */}
            {module.moduleSessions.map((session, idx) => (
              <div
                key={idx}
                className="cursor-pointer py-2" 
                onClick={() => onSelect(session.name)}
              >
                Sesión {idx + 1}: {session.name}
              </div>
            ))}
          </div>
          {moduleEvaluations.map((evaluation, idx) => (
            <div key={idx} className="mt-4">
              <div className="cursor-pointer mt-2 font-bold text-sm" onClick={() => onSelect('', evaluation)}>
                Evaluación del Módulo {idx + 1}: {evaluation.name}
              </div>
            </div>
          ))}
        </div>
      ))}
      <div className="mt-4 py-4"> {/* added padding */}
        <div className="cursor-pointer mt-2 font-bold text-base" onClick={() => onSelect('', courseEvaluation)}>
          Evaluación Final: {courseEvaluation.name}
        </div>
      </div>
    </div>
  );
};

export default SidebarPrueba;
