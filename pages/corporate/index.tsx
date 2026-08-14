import React, { useState } from 'react';
import type { NextPageWithLayout } from '../../types/next';
import AppLayout from "@/components/layouts/AppLayout";
import { useAuth } from '../../context/AuthContext';
import './../../app/globals.css';
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

const CorporateDashboard: NextPageWithLayout = () => {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
    </div>
  );
};

CorporateDashboard.getLayout = (page: React.ReactNode) => (
  <AppLayout>{page}</AppLayout>
);

export default CorporateDashboard;
