import React from 'react';
import CircularBar from '../../../components/Corporate/CircularBar';

interface Course {
  image: string;
  name: string;
  description_short: string;
  progress: number | null;
  completed: number | null;
  approved: number | null;
}

interface StudentCourseCardProps {
  course: Course;
}

const StudentCourseCard: React.FC<StudentCourseCardProps> = ({ course }) => {
  const getStatusButton = (progress: number | null) => {
    if (progress === 100) {
      return <div className="bg-green-500 text-white px-8 py-1 rounded-full mt-4 text-center">Finalizado</div>;
    } else if (progress !== null && progress > 0) {
      return <div className="bg-yellow-500 text-white px-8 py-1 rounded-full mt-4 text-center">En progreso</div>;
    }
    return <div className="bg-gray-500 text-white px-8 py-1 rounded-full mt-4 text-center">No Iniciado</div>;
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden p-4 mb-6">
      <h3 className="text-xl font-bold mb-4">{course.name}</h3>
      <div className="flex flex-col md:flex-row">
        <div className="mr-4">
        <img src={course.image} alt={course.name} className="w-32 h-32 object-cover" />
          {getStatusButton(course.progress)}
        </div>
        <div className="flex-grow">
          <p className="text-gray-700 mb-4">{course.description_short}</p>
          <div className="flex justify-between items-center">
            <div className="flex justify-center items-center w-1/3">
              <CircularBar percentage={course.progress ?? 0} label="Progreso" />
            </div>
            <div className="flex justify-center items-center w-1/3">
              <CircularBar percentage={course.completed ?? 0} label="Finalizado" />
            </div>
            <div className="flex justify-center items-center w-1/3">
              <CircularBar percentage={course.approved ?? 0} label="Aprobado" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCourseCard;
