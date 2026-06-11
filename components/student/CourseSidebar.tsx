import React, { useState } from "react";
import {
  CourseModule,
  CourseEvaluation,
  ModuleEvaluation,
  Question,
  UserSessionProgress,
} from "../../interfaces/StudentModule";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useAuth } from "../../context/AuthContext";

interface CourseSidebarProps {
  courseModules: CourseModule[];
  courseEvaluation: CourseEvaluation;
  onSelect: (
    sessionName: string,
    evaluation?: ModuleEvaluation | Question[],
    moduleId?: number,
  ) => void;
  videoProgress?: { [key: string]: number };
}

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="w-full h-full"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const LockIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-4 h-4 flex-shrink-0"
  >
    <path
      fillRule="evenodd"
      d="M12 1a5 5 0 00-5 5v2H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm3 7V6a3 3 0 10-6 0v2h6z"
      clipRule="evenodd"
    />
  </svg>
);

const SessionIndicator = ({ progress }: { progress: number }) => {
  if (progress === 100) {
    return (
      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 text-white">
        <CheckIcon />
      </div>
    );
  }
  if (progress === 0) {
    return (
      <div className="w-8 h-8 rounded-full border-2 border-gray-400 flex-shrink-0" />
    );
  }
  return (
    <div className="w-8 h-8 flex-shrink-0">
      <CircularProgressbar
        value={progress}
        text={`${progress}%`}
        styles={{
          path: { stroke: "#8204E7" },
          text: { fill: "#fff", fontSize: "28px" },
          trail: { stroke: "rgba(255,255,255,0.2)" },
        }}
      />
    </div>
  );
};

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  courseModules,
  courseEvaluation,
  onSelect,
  videoProgress = {},
}) => {
  const { user } = useAuth();
  const userId = (user as { id: number } | null)?.id ?? 0;
  const [lockedClickedId, setLockedClickedId] = useState<string | null>(null);

  const getSessionProgress = (
    session: UserSessionProgress[],
    sessionId: number,
  ) => {
    const dbProgress =
      session.find(
        (p) => p.session_id === sessionId && p.user_id === userId,
      )?.progress || 0;
    return Math.max(dbProgress, videoProgress[sessionId] || 0);
  };

  const calculateModuleProgress = (module: CourseModule) => {
    const total = module.moduleSessions.length;
    const sum = module.moduleSessions.reduce(
      (acc, s) => acc + getSessionProgress(s.usersessionprogress, s.session_id),
      0,
    );
    return Math.round(total > 0 ? sum / total : 0);
  };

  const countCompletedSessions = (module: CourseModule) =>
    module.moduleSessions.filter(
      (s) => getSessionProgress(s.usersessionprogress, s.session_id) === 100,
    ).length;

  const allModulesCompleted = courseModules.every(
    (module) => calculateModuleProgress(module) === 100,
  );

  const completedModulesCount = courseModules.filter(
    (m) => calculateModuleProgress(m) === 100,
  ).length;

  const handleLockedClick = (id: string) => {
    setLockedClickedId(id);
    setTimeout(() => setLockedClickedId(null), 2500);
  };

  return (
    <div className="bg-brand-500 text-white divide-y divide-neutral-100 h-full p-4 overflow-y-auto lg:w-96 lg:fixed lg:right-0 lg:top-16 pb-16 lg:h-full w-full">
      {courseModules.map((module, moduleIndex) => {
        const moduleProgress = calculateModuleProgress(module);
        const completedSessions = countCompletedSessions(module);
        const totalSessions = module.moduleSessions.length;
        const isModuleLocked = moduleProgress < 100;
        const evalLockId = `module-eval-${module.module_id}`;

        return (
          <div key={module.module_id} className="py-4">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 mr-3 flex-shrink-0">
                {moduleProgress === 100 ? (
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                    <CheckIcon />
                  </div>
                ) : (
                  <CircularProgressbar
                    value={moduleProgress}
                    text={`${moduleProgress}%`}
                    styles={{
                      path: { stroke: "#8204E7" },
                      text: { fill: "#fff", fontSize: "28px" },
                      trail: { stroke: "rgba(255,255,255,0.2)" },
                    }}
                  />
                )}
              </div>
              <h2 className="font-bold text-lg flex-1 leading-tight">
                Módulo {moduleIndex + 1}: {module.name}
              </h2>
            </div>

            {module.moduleSessions.map((session, sessionIndex) => {
              const sessionProgress = Math.round(
                getSessionProgress(
                  session.usersessionprogress,
                  session.session_id,
                ),
              );
              return (
                <div
                  key={session.session_id}
                  className="cursor-pointer py-2 flex items-center gap-2 hover:bg-white/10 rounded-lg px-2 transition-colors"
                  onClick={() =>
                    onSelect(session.name, undefined, module.module_id)
                  }
                >
                  <SessionIndicator progress={sessionProgress} />
                  <span
                    className={`flex-1 text-sm ${sessionProgress === 100 ? "text-green-300" : "text-white"}`}
                  >
                    Sesión {sessionIndex + 1}: {session.name}
                  </span>
                </div>
              );
            })}

            {module.moduleEvaluation && (
              <div className="mt-3">
                <div
                  className={`flex items-center gap-2 px-2 py-2 rounded-lg font-semibold text-sm transition-colors ${
                    isModuleLocked
                      ? "cursor-not-allowed text-gray-400"
                      : "cursor-pointer hover:bg-white/10 text-yellow-300"
                  }`}
                  onClick={() => {
                    if (isModuleLocked) {
                      handleLockedClick(evalLockId);
                    } else {
                      onSelect(
                        "",
                        module.moduleEvaluation.questions,
                        module.module_id,
                      );
                    }
                  }}
                >
                  {isModuleLocked ? (
                    <span className="text-gray-400">
                      <LockIcon />
                    </span>
                  ) : (
                    <span className="text-yellow-300">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4 flex-shrink-0"
                      >
                        <path d="M12 1a5 5 0 015 5h1a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h1a5 5 0 015-5zm0 2a3 3 0 00-3 3h6a3 3 0 00-3-3zm0 8a2 2 0 100 4 2 2 0 000-4z" />
                      </svg>
                    </span>
                  )}
                  <span>Evaluación: {module.moduleEvaluation.name}</span>
                </div>

                {isModuleLocked && (
                  <p className="text-xs text-gray-400 mt-1 px-2">
                    {completedSessions}/{totalSessions} sesiones completadas
                    para desbloquear
                  </p>
                )}

                {lockedClickedId === evalLockId && (
                  <p className="text-xs text-yellow-400 mt-1 px-2 animate-pulse">
                    Completa todas las sesiones del módulo para habilitar la
                    evaluación
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}

      <div className="mt-4 py-4">
        <div
          className={`flex items-center gap-2 px-2 py-2 rounded-lg font-bold text-base transition-colors ${
            allModulesCompleted
              ? "cursor-pointer hover:bg-white/10 text-yellow-300"
              : "cursor-not-allowed text-gray-400"
          }`}
          onClick={() => {
            if (allModulesCompleted) {
              onSelect("", courseEvaluation.questions);
            } else {
              handleLockedClick("final-eval");
            }
          }}
        >
          {allModulesCompleted ? (
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 flex-shrink-0 text-yellow-300"
            >
              <path d="M12 1a5 5 0 015 5h1a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h1a5 5 0 015-5zm0 2a3 3 0 00-3 3h6a3 3 0 00-3-3zm0 8a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          ) : (
            <span className="text-gray-400">
              <LockIcon />
            </span>
          )}
          <span>Evaluación Final: {courseEvaluation.name}</span>
        </div>

        {!allModulesCompleted && (
          <p className="text-xs text-gray-400 mt-1 px-2">
            {completedModulesCount}/{courseModules.length} módulos completados
            para desbloquear
          </p>
        )}

        {lockedClickedId === "final-eval" && (
          <p className="text-xs text-yellow-400 mt-1 px-2 animate-pulse">
            Completa todos los módulos del curso para habilitar la evaluación
            final
          </p>
        )}
      </div>
    </div>
  );
};

export default CourseSidebar;
