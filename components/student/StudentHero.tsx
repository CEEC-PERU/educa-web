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
}: StudentHeroProps) {
  const initial = name?.charAt(0)?.toUpperCase() || "?";

  const statValues = [
    coursescount?.data?.totalCourses ?? 0,
    coursescount?.data?.completedCourses ?? 0,
    0,
  ];

  return (
    <div className="relative w-full px-4 lg:px-40 pt-10 pb-16">
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-6">
        <div className="flex-1 text-left text-white">
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
          <a
            href="#cursos"
            className="inline-flex items-center rounded-lg bg-brandrosado-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brandfucsia-900"
          >
            Continuar aprendiendo
          </a>
        </div>

        <div className="relative flex-shrink-0 flex items-center justify-center">
          <div className="absolute inset-0 m-auto h-20 w-20 lg:h-32 lg:w-32 rounded-full bg-brandrosado-800/40 blur-2xl" />
          <img
            src="https://res.cloudinary.com/dk2red18f/image/upload/v1724273464/WEB_EDUCA/smxqc1j66tbr0dkrxbdt.png"
            alt="MentorMind"
            className="relative h-20 w-20 lg:h-32 lg:w-32 object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.35)]"
          />
        </div>

        <div className="w-full lg:w-auto">
          <div className="flex divide-x divide-white/15 rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm">
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
    </div>
  );
}
