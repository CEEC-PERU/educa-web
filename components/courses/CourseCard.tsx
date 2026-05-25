import React from "react";
import type { Course } from "@/interfaces/Courses/Course";
import ButtonContent from "@/components/Content/ButtonContent";

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
    <div className="relative flex flex-col w-full max-w-sm sm:max-w-md lg:max-w-lg bg-violet-200 rounded-xl bg-clip-border text-gray-700 shadow-lg mx-2 my-4">
      <div className="relative mx-4 mt-4 overflow-hidden text-white shadow-lg rounded-xl bg-blue-gray-500 bg-clip-border shadow-blue-gray-500/40">
        <img
          src={course.image}
          alt={course.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-transparent to-black/60" />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h5 className="block font-sans text-xl antialiased font-medium leading-snug tracking-normal text-blue-gray-900 truncate">
            {course.name}
          </h5>
        </div>
        <p className="block font-sans text-base antialiased font-light leading-relaxed text-gray-700 text-center break-words">
          {course.description_short}
        </p>
        <div className="pt-4 flex justify-center">
          <ButtonContent
            buttonLabel={buttonLabel}
            backgroundColor="bg-gradient-to-r from-blue-500 to-blue-400"
            textColor="text-white"
            fontSize="text-xs"
            buttonSize="py-2 px-7"
            onClick={() => onButtonClick(course.course_id)}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
