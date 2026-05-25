import React from "react";
import type { Course } from "@/interfaces/Courses/Course";
import ButtonContent from "@/components/Content/ButtonContent";
import { ClockIcon } from "@heroicons/react/24/outline";

interface CourseCardProps {
  course: Course;
  buttonLabel?: string;
  onButtonClick: (courseId: number) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  buttonLabel = "Ver detalles",
  onButtonClick,
}) => {
  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Imagen flush con badges superpuestos */}
      <div className="relative w-full aspect-video overflow-hidden">
        <img
          src={course.image}
          alt={course.name}
          className="w-full h-full object-cover"
        />
        {/* Gradiente inferior para legibilidad de badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Badge duración */}
        {course.duration_course && (
          <span className="absolute bottom-2 left-3 flex items-center gap-1 bg-black/50 text-white text-xs font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">
            <ClockIcon className="w-3 h-3" />
            {course.duration_course}
          </span>
        )}

        {/* Badge estado */}
        <span
          className={`absolute top-2 right-3 text-xs font-semibold px-2 py-0.5 rounded-full ${
            course.is_active
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {course.is_active ? "Activo" : "Inactivo"}
        </span>
      </div>

      {/* Cuerpo */}
      <div className="flex flex-col flex-1 px-4 pt-4 pb-0">
        <h5 className="text-base font-semibold text-gray-900 leading-snug line-clamp-1 mb-1">
          {course.name}
        </h5>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
          {course.description_short}
        </p>
      </div>

      {/* Footer con divisor y CTA */}
      <div className="px-4 pt-3 pb-4 mt-3 border-t border-gray-100">
        <ButtonContent
          buttonLabel={`${buttonLabel} →`}
          backgroundColor="bg-gradient-to-r from-blue-600 to-blue-500"
          textColor="text-white"
          fontSize="text-sm"
          buttonSize="py-2 px-4"
          onClick={() => onButtonClick(course.course_id)}
        />
      </div>
    </div>
  );
};

export default CourseCard;
