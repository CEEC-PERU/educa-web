import React from 'react';
import CircularBar from '../../components/Corporate/CircularBar';

interface Student {
  profile_picture: string;
  name: string;
}

interface Course {
  image: string;
  name: string;
  description_short: string;
  studentCount: number;
  progressPercentage: number;
  completedPercentage: number;
  approvedPercentage: number;
  students: Student[];
}

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const getStatusButton = (progress: number) => {
    if (progress === 100) {
      return <div className="bg-green-500 text-white px-3 py-1 rounded-full mt-4 text-center">Finalizado</div>;
    } else if (progress > 0) {
      return <div className="bg-yellow-500 text-white px-3 py-1 rounded-full mt-4 text-center">En progreso</div>;
    }
    return null;
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden p-4 mb-6">
      <h3 className="text-xl font-bold mb-4">{course.name}</h3>
      <div className="flex">
        <div className="mr-4">
          <img src={course.image} alt={course.name} className="w-32 h-32 object-cover" />
          {getStatusButton(course.progressPercentage)}
          <div className="flex items-center mt-4">
            <div className="flex -space-x-2">
              {course.students && course.students.slice(0, 4).map((student, index) => (
                <img key={index} src={student.profile_picture} alt={student.name} className="w-10 h-10 rounded-full border-2 border-white" />
              ))}
              {course.studentCount > 4 && (
                <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full text-gray-600 text-sm">
                  +{course.studentCount - 4}
                </div>
              )}
            </div>
            <span className="text-gray-600 ml-3 text-center">{course.studentCount} estudiantes</span>
          </div>
        </div>
        <div className="flex-grow">
          <p className="text-gray-700 mb-4">{course.description_short}</p>
          <div className="flex justify-between items-center">
            <div className="flex justify-center items-center w-1/3">
              <CircularBar percentage={course.progressPercentage} label="Progreso" />
            </div>
            <div className="flex justify-center items-center w-1/3">
              <CircularBar percentage={course.completedPercentage} label="Finalizado" />
            </div>
            <div className="flex justify-center items-center w-1/3">
              <CircularBar percentage={course.approvedPercentage} label="Aprobado" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
