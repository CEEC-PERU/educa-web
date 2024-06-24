// components/Sidebar.tsx
import React from 'react';

interface SidebarProps {
  courseModules: {
    name: string;
    moduleSessions: { name: string }[];
    moduleEvaluation: { name: string };
  }[];
  onSelect: (sessionName: string, evaluationName: string) => void;
}

const SidebarPrueba: React.FC<SidebarProps> = ({ courseModules, onSelect }) => {
  return (
    <div className="w-64 bg-gray-800 text-white h-full p-4">
      {courseModules.map((module, index) => (
        <div key={index}>
          <h2 className="font-bold text-lg">{module.name}</h2>
          {module.moduleSessions.map((session, idx) => (
            <div
              key={idx}
              className="cursor-pointer mt-2"
              onClick={() => onSelect(session.name, module.moduleEvaluation.name)}
            >
              {session.name}
            </div>
          ))}
          <div
            className="cursor-pointer mt-2"
            onClick={() => onSelect('', module.moduleEvaluation.name)}
          >
            {module.moduleEvaluation.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SidebarPrueba;
