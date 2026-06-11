import React from "react";

interface CoursesCount {
  data?: {
    totalCourses?: number;
    completedCourses?: number;
  };
}

interface StudentHeroProps {
  name: string;
  coursescount: CoursesCount | null | undefined;
}

const STAT_ICONS = [
  "https://res.cloudinary.com/dk2red18f/image/upload/v1721713563/WEB_EDUCA/ICONOS/jbfxiscml6nrazyi1gda.png",
  "https://res.cloudinary.com/dk2red18f/image/upload/v1721713562/WEB_EDUCA/ICONOS/fsqde4gvrdhejt02t9xq.png",
  "https://res.cloudinary.com/dk2red18f/image/upload/v1721713512/WEB_EDUCA/ICONOS/ake0tmixpx9wnbzvessc.png",
];

export default function StudentHero({ name, coursescount }: StudentHeroProps) {
  const statValues = [
    coursescount?.data?.totalCourses,
    coursescount?.data?.completedCourses,
    1,
  ];

  const statLabels = [
    "Curso inscritos",
    "Curso completado",
    "Diploma Obtenido",
  ];

  return (
    <div className="relative flex flex-col lg:flex-row items-center text-left w-full text-white px-4 lg:px-40">
      <div className="lg:w-1/2 lg:pr-8 mb-8 lg:mb-0 p-10">
        <p className="text-5xl lg:text-7xl font-bold mb-4 text-brandrosado-800">
          Hola, {name}
        </p>
        <p className="mb-4 text-5xl lg:text-7xl text-white font-bold">
          ¡Qué bueno verte!
        </p>
        <p className="mb-4 text-lg lg:text-base text-white py-8">
          Este es tu portal de aprendizaje, explora tus cursos y potencia tu
          desarrollo profesional.
        </p>
      </div>

      <div className="lg:w-1/2 px-20">
        <div className="bg-brandazul-600 border-2 border-white p-4 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4">
          {statValues.map((value, i) => (
            <div
              key={statLabels[i]}
              className="bg-brandazul-700 p-2 rounded-lg text-center flex items-center justify-center flex-col"
            >
              <div className="flex items-center justify-center">
                <p className="text-brandfucsia-900 text-4xl lg:text-7xl">
                  {value}
                </p>
                <img
                  src={STAT_ICONS[i]}
                  className="h-12 w-12 ml-2"
                  alt="Icon"
                />
              </div>
              <p className="text-white p-3">{statLabels[i]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
