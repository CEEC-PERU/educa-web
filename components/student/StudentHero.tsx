import React, { useEffect, useState } from "react";
import { BookOpen, CheckCircle2, Award, GraduationCap } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

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

  // Anillo decorativo: arranca en 0 y se llena al montar, sin representar
  // ningún porcentaje real (solo efecto de entrada).
  const [ringValue, setRingValue] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setRingValue(100), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full px-4 lg:px-40 pt-4 pb-16">
      <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div className="text-left text-white">
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
            <p className="text-sm uppercase tracking-wide text-white/70">
              Portal del estudiante
            </p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold mb-3">
            Hola, <span className="text-brandrosado-800">{name}</span>
          </h1>
          <p className="text-lg lg:text-xl font-semibold mb-3">
            ¡Qué bueno verte de nuevo!
          </p>
          <p className="text-white/80 max-w-md mb-6">
            Este es tu portal de aprendizaje, explora tus cursos y potencia tu
            desarrollo profesional.
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
          <div className="rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm">
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

            <div className="border-t border-white/15 px-6 py-5">
              <p className="mb-4 text-center text-sm text-white/70">
                Tiempo dedicado a tu formación
              </p>
              <div className="flex items-center justify-center gap-6">
                <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
                  <svg width="0" height="0" className="absolute">
                    <defs>
                      <linearGradient
                        id="learningTimeRingGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#C084FC" />
                        <stop offset="100%" stopColor="#6017AF" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute inset-1 rounded-full bg-brandrosado-800/25 blur-xl" />
                  <CircularProgressbar
                    value={ringValue}
                    strokeWidth={9}
                    styles={buildStyles({
                      pathTransitionDuration: 1.4,
                      pathColor: "url(#learningTimeRingGradient)",
                      trailColor: "rgba(255,255,255,0.12)",
                      strokeLinecap: "round",
                    })}
                  />
                  <GraduationCap
                    className="absolute h-12 w-12 text-white"
                    strokeWidth={1.6}
                  />
                </div>
                <div className="flex flex-col gap-2.5">
                  {[
                    { value: clockHours, label: "horas" },
                    { value: clockMinutes, label: "minutos" },
                    { value: clockSeconds, label: "segundos" },
                  ].map(({ value, label }) => (
                    <div
                      key={label}
                      className="flex items-baseline justify-between gap-5"
                    >
                      <span className="text-2xl font-bold text-white tabular-nums">
                        {(isLearningTimeLoading ? 0 : value)
                          .toString()
                          .padStart(2, "0")}
                      </span>
                      <span className="text-sm text-white/70">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
