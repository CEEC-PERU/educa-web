import React from "react";
import { BookOpen, CheckCircle2, Award } from "lucide-react";

interface CoursesCount {
  data?: {
    totalCourses?: number;
    completedCourses?: number;
  };
}

interface StudentHeroProps {
  name: string;
  avatar?: string | null;
  coursescount: CoursesCount | null | undefined;
  learningTimeSeconds?: number;
  isLearningTimeLoading?: boolean;
}

const STATS = [
  { key: "enrolled", label: "Cursos inscritos", icon: BookOpen },
  { key: "completed", label: "Cursos completados", icon: CheckCircle2 },
  { key: "diplomas", label: "Diplomas obtenidos", icon: Award },
];

export default function StudentHero({
  name,
  avatar,
  coursescount,
  learningTimeSeconds = 0,
  isLearningTimeLoading = false,
}: StudentHeroProps) {
  const initial = name?.charAt(0)?.toUpperCase() || "?";

  const statValues = [
    coursescount?.data?.totalCourses ?? 0,
    coursescount?.data?.completedCourses ?? 0,
    0,
  ];

  const safeLearningSeconds = Math.max(0, Math.floor(learningTimeSeconds));
  const clockHours = Math.floor(safeLearningSeconds / 3600);
  const clockMinutes = Math.floor((safeLearningSeconds % 3600) / 60);
  const clockSeconds = safeLearningSeconds % 60;

  return (
    <div className="relative w-full px-4 lg:px-40 pt-4 pb-16">
      <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div className="text-left text-black">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10 ring-2 ring-brandrosado-800">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xl font-semibold text-brandrosado-800">
                  {initial}
                </span>
              )}
            </div>
            <p className="text-sm uppercase tracking-wide text-black/70">
              Portal del estudiante
            </p>
          </div>
          <h1 className="font-space-grotesk text-6xl lg:text-7xl font-bold mb-3">
            Hola, <span className="text-brandrosado-800">{name}</span>
          </h1>
          <p className="text-2xl lg:text-3xl font-semibold mb-3">
            <strong>¡Qué bueno verte de nuevo!</strong>
          </p>
          <div className="w-full max-w-md h-1 rounded-full bg-brandrosado-800 mb-4" />
          <p className="text-lg lg:text-xl text-black/80 max-w-md mb-6">
            <strong>
              Este es tu espacio para aprender, descubrir nuevos cursos y seguir
              creciendo profesionalmente.
            </strong>
          </p>
        </div>

        <div
          aria-hidden="true"
          className="hidden flex-shrink-0 items-center justify-center lg:flex"
        >
          <img
            src="/cerebrito_transparent.gif"
            alt=""
            className="w-[720px] h-auto object-contain drop-shadow-[0_0_35px_rgba(255,255,255,0.6)]"
          />
        </div>

        <div className="w-full lg:w-auto">
          <div className="relative pb-2.5 pr-2.5">
            <div className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-2xl bg-[#626fa6]" />
            <div className="relative rounded-2xl border border-white/10 bg-[#38226d] shadow-xl backdrop-blur-sm">
              <div className="flex divide-x divide-white/15">
                {STATS.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.key}
                      className="flex min-w-[120px] flex-1 flex-col items-center gap-2 px-6 py-6"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brandrosado-800/20 text-brandrosado-800">
                        <Icon className="h-5 w-5" />
                      </span>
                      <p className="text-3xl font-bold text-white">
                        {statValues[i]}
                      </p>
                      <p className="text-center text-sm text-white/70">
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 flex w-full flex-col items-center gap-4 rounded-2xl bg-gradient-to-r from-brandmorado-700 to-brandrosa-800 p-5 shadow-xl ring-1 ring-white/10 sm:p-6">
            <p className="text-center text-sm font-bold uppercase tracking-wide text-white sm:text-base">
              Tiempo dedicado a tu formación
            </p>

            <div className="flex justify-center">
              <div className="flex flex-nowrap items-center divide-x divide-white/25 rounded-full bg-black/20 px-1">
                <div className="flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2">
                  <svg viewBox="0 0 24 24" className="h-7 w-7 sm:h-9 sm:w-9">
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      fill="none"
                      stroke="white"
                      strokeOpacity="0.45"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="12"
                      y1="12"
                      x2="12"
                      y2="7.5"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    >
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 12 12"
                        to="360 12 12"
                        dur="9s"
                        repeatCount="indefinite"
                      />
                    </line>
                    <line
                      x1="12"
                      y1="12"
                      x2="15.5"
                      y2="12"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    >
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 12 12"
                        to="360 12 12"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </line>
                    <circle cx="12" cy="12" r="1" fill="white" />
                  </svg>
                </div>

                {[
                  { value: clockHours, label: "horas" },
                  { value: clockMinutes, label: "minutos" },
                  { value: clockSeconds, label: "segundos" },
                ].map(({ value, label }) => (
                  <div
                    key={label}
                    className="flex items-baseline gap-1 px-2.5 py-1.5 sm:gap-1.5 sm:px-4 sm:py-2"
                  >
                    <span className="text-base font-bold text-white tabular-nums sm:text-xl lg:text-2xl">
                      {(isLearningTimeLoading ? 0 : value)
                        .toString()
                        .padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-white/80 sm:text-xs">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
