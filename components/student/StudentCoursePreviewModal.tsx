import React from "react";
import Modal from "react-modal";
import { XCircleIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

export interface CoursePreview {
  course_id: number;
  name: string;
  image: string;
  description_short: string;
  courseProfessor: { full_name: string };
  courseCategory: { name: string };
}

interface StudentCoursePreviewModalProps {
  course: CoursePreview;
  onClose: () => void;
  onViewDetails: () => void;
}

export default function StudentCoursePreviewModal({
  course,
  onClose,
  onViewDetails,
}: StudentCoursePreviewModalProps) {
  return (
    <Modal
      key={course.course_id}
      isOpen={true}
      onRequestClose={onClose}
      className="fixed inset-0 flex items-center justify-center p-4"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[200]"
    >
      <div className="relative bg-white rounded-lg overflow-hidden shadow-lg max-w-lg w-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black"
          aria-label="Cerrar"
        >
          <XCircleIcon className="h-8 w-8" />
        </button>
        <img
          className="w-full h-64 object-cover"
          src={course.image}
          alt={course.name}
        />
        <div className="px-6 py-4">
          <div className="bg-brandmorad-600 rounded font-bold text-md mb-2 text-white p-4">
            {course.courseCategory.name}
          </div>
          <div className="font-bold text-md mb-2 text-black">{course.name}</div>
          <p className="text-brandrosado-800 text-base mb-4">
            Por: {course.courseProfessor.full_name}
          </p>
          <p className="text-black text-sm mb-4">{course.description_short}</p>
          <div className="flex justify-end mt-4">
            <button
              className="bg-brandmora-500 text-white px-4 rounded hover:bg-brandmorado-700 border-2 border-brandborder-400 flex items-center"
              onClick={onViewDetails}
            >
              Detalles del curso <ChevronRightIcon className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
