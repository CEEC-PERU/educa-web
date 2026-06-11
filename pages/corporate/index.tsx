import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Corporate/CorporateSideBar';
import { useAuth } from '../../context/AuthContext';
import './../../app/globals.css';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import { useCourseStudent } from '../../hooks/useCourseStudents';
import { useCourseProgress } from '../../hooks/useProgressCurso';
import { useAverageCourse } from '../../hooks/courses/useCourseTime';
import {
  useTop,
  useAverageTime,
  useAUserActive,
  useNPS,
  useSatisfaccion,
} from '../../hooks/dashboard/useDashboardCorporative';
import {
  CourseProgressChart,
  CourseTimeChart,
  TopAdvisorsChart,
  AverageTimeChart,
  DailyParticipationChart,
  SatisfactionChart,
  NPSChart,
} from '../../components/dashboard/charts';

const CorporateDashboard: React.FC = () => {
  const { user } = useAuth();
  const { courseStudent } = useCourseStudent();
  const [selectedCourse, setSelectedCourse] = useState<number | undefined>(
    undefined,
  );
  const { courseProgressData } = useCourseProgress(selectedCourse);
  const { topRanking } = useTop(selectedCourse);
  const { averagetime } = useAverageTime();
  const { activeuser } = useAUserActive();
  const { npsData } = useNPS(1, selectedCourse);
  const { satisData } = useSatisfaccion(2, selectedCourse);
  const { coursetimeaverage } = useAverageCourse(selectedCourse);

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar
        bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90"
        borderColor="border border-stone-300"
      />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={true} setShowSidebar={() => {}} />
        <main className="p-6 flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pl-20">
          <div className="mr-2 col-span-full">
            <select
              value={selectedCourse ?? ""}
              onChange={(e) =>
                setSelectedCourse(Number(e.target.value) || undefined)
              }
              className="block border-4 p-2 mr-4"
              disabled={courseStudent.length === 0}
            >
              {courseStudent.length > 0 && (
                <option value="">Seleccione un curso...</option>
              )}
              {courseStudent.map((course) => (
                <option
                  key={course.course_id}
                  value={course.course_id}
                  className="text-gray-700"
                >
                  {course.Course.name}
                </option>
              ))}
              {courseStudent.length === 0 && (
                <option disabled className="text-gray-600">
                  No hay cursos asignados
                </option>
              )}
            </select>
          </div>

          <CourseProgressChart data={courseProgressData} />
          <CourseTimeChart data={coursetimeaverage} />
          <TopAdvisorsChart data={topRanking} />
          <AverageTimeChart data={averagetime} />
          <DailyParticipationChart data={activeuser} />
          <SatisfactionChart data={satisData} />
          <NPSChart data={npsData} />
        </main>
      </div>
    </div>
  );
};

export default CorporateDashboard;
