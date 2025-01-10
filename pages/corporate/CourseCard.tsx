import React from 'react';
import CircularBar from '../../components/Corporate/CircularBar';
import { useRouter } from 'next/router';

interface Student {
  profile_picture: string;
  name: string;
}

interface Course {
  course_id: number;
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
  const router = useRouter();

  const getStatusButton = (progress: number) => {
    if (progress === 100) {
      return <div className="bg-green-500 text-white px-3 py-1 rounded-full mt-4 text-center">Finalizado</div>;
    } else if (progress > 0) {
      return <div className="bg-yellow-500 text-white px-3 py-1 rounded-full mt-4 text-center">En progreso</div>;
    }
    return null;
  };

  if (!course) {
    return null;
  }

  const handleDetailsClick = (courseId: number) => {
    router.push({
      pathname: 'nota/',
      query: { course_id: courseId }
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden p-4 mb-6">
      <h3 className="text-xl font-bold mb-4  text-black " >{course.name}</h3>
      <div className="flex flex-col md:flex-row">
        <div className="mr-4">
          <img src={course.image} alt={course.name} className="w-32 h-32 object-cover" />
          {getStatusButton(course.progressPercentage)}
          <div className="flex items-center mt-4">
            <div className="flex -space-x-2">
              {course.students && course.students.slice(0, 4).map((student, index) => (
                <img key={index} src={student.profile_picture} alt={student.name} className="w-10 h-10 rounded-full border-2 border-white" />
              ))}
            </div>
            <span className="text-gray-600 ml-3 pr-10 text-center">{course.studentCount} estudiantes</span>
          </div>
          <button
            className="bg-blue-600 p-4 rounded-md text-white w-full mt-4"
            onClick={() => handleDetailsClick(course.course_id)}
          >
            Detalle de nota
          </button>
        </div>

        <div className="flex-grow">
          <div className="flex justify-between items-center">
            <div className="flex justify-center items-center w-1/3 ">
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
