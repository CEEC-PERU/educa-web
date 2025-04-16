import React from 'react';
import CircularBar from '../../../components/Corporate/CircularBar';
import { useRouter } from 'next/router';

interface Student {
  profile_picture: string;
  name: string;
}
interface Percent {
  count: number;
  percent: string;
}

interface Course {
  course_id: number;
  image: string;
  name: string;
  description_short: string;
  studentCount: number;
  noProgress : {
    count: number;
    percent: string;
  };
  inProgress:  {
    count: number;
    percent: string;
  };
  completed: {
    count: number;
    percent: string
  };
  approved:  {
    count: number;
    percent: string;
  };
  students: Student[];
}

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const router = useRouter();


  if (!course) {
    return null;
  }

  const handleDetailsClick = (courseId: number) => {
    router.push({
      pathname: 'calidad/nota',
      query: { course_id: courseId   },
    });
  };


  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden p-4 mb-6">
      <h3 className="text-xl font-bold mb-4  text-black " >{course.name}</h3>
      <div className="flex flex-col md:flex-row">
        <div className="mr-4">
          
          <img
  src={course.image}
  alt={course.name}
  className="w-full h-auto md:w-70 md:h-32 object-cover rounded-lg"
/>

          <div className="flex items-center mt-4">
            <div className="flex -space-x-2">
              {course.students && course.students.slice(0, 4).map((student, index) => (
                <img key={index} src={student.profile_picture} alt={student.name} className="w-30 h-10 rounded-full border-2 border-white" />
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

    
      
 <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <div className="flex justify-center items-center">
    <CircularBar percentage={parseFloat(course.noProgress.percent)} label={`No inicia (${course.noProgress.count})`} />
  </div>
  <div className="flex justify-center items-center">
    <CircularBar percentage={parseFloat(course.inProgress.percent)} label={`Progreso (${course.inProgress.count})`} />
  </div>
  <div className="flex justify-center items-center">
    <CircularBar percentage={parseFloat(course.completed.percent)} label={`Finalizado (${course.completed.count})`} />
  </div>
  <div className="flex justify-center items-center">
    <CircularBar percentage={parseFloat(course.approved.percent)} label={`Aprobado (${course.approved.count})`} />
  </div>
</div>


        </div>


        
    
    </div>
  );
};

export default CourseCard;



