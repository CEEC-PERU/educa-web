import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useAuth } from '../../../context/AuthContext';
import SidebarDrawer from '../../../components/student/DrawerNavigation';
import Navbar from '../../../components/Navbar';
import { Profile } from '../../../interfaces/User/UserInterfaces';
import {
  Course,
  CourseResult,
  ModuleResultDetails,
  ModuleResult,
} from '../../../interfaces/Nota';
import { useCourseStudent } from '../../../hooks/useCourseStudents';
import { useNotas } from '../../../hooks/resultado/useNotasUserId';
import CourseCard from '../../../components/student/CourseCard';
import { XCircleIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import './../../../app/globals.css';
import ScreenSecurity from '../../../components/ScreenSecurity';
import Footter from '../../../components/Footter';

Modal.setAppElement('#__next');

// Corrección del tipo para courseNota que es un array de UserNota
const DetailNota: React.FC = () => {
  const { logout, user, profileInfo } = useAuth();
  const { courseStudent, isLoading } = useCourseStudent();
  const router = useRouter();
  const { course_id } = router.query;

  const courseIdNumber = Array.isArray(course_id)
    ? parseInt(course_id[0])
    : parseInt(course_id || '0');

  // Aquí courseNota es un array de UserNota[]
  const { courseNota } = useNotas(courseIdNumber);

  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [filters, setFilters] = useState<any>({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  let name = '';
  let uri_picture = '';

  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    uri_picture = profile.profile_picture!;
  }

  const openModal = (course: any) => {
    setSelectedCourse(course);
  };

  const closeModal = () => {
    setSelectedCourse(null);
  };

  const toggleSidebar = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Renderiza los resultados de módulos y cursos con diseño agradable
  const renderNotas = () => {
    if (!courseNota || courseNota.length === 0)
      return <p>No hay notas disponibles</p>;

    // Accedemos al primer UserNota del array
    const userNota = courseNota[0];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Iterar sobre los ModuleResults */}
        {userNota.ModuleResults?.map((moduleResult: ModuleResult) => (
          <div
            key={moduleResult.module_id}
            className="p-4 bg-white shadow-lg rounded-lg"
          >
            <h3 className="text-lg font-bold text-brand-500">
              Modulo: {moduleResult.module_name}
            </h3>
            {moduleResult.results.map(
              (result: ModuleResultDetails, index: number) => (
                <div key={index}>
                  <p className="text-sm text-gray-500">
                    Puntaje: {result.puntaje}
                  </p>
                  <p className="text-sm text-gray-400">
                    Fecha: {new Date(result.created_at).toLocaleDateString()}
                  </p>
                </div>
              )
            )}
          </div>
        ))}

        {/* Iterar sobre los CourseResults */}
        {userNota.CourseResults?.map((courseResult: CourseResult) => (
          <div
            key={courseResult.course_result_id}
            className="p-4 bg-white shadow-lg rounded-lg"
          >
            <h3 className="text-lg font-bold text-brand-500">
              Nota Final :{courseResult.Course.name}
            </h3>
            <p className="text-sm text-gray-500">
              Puntaje: {courseResult.puntaje}
            </p>
            <p className="text-sm text-gray-400">
              Fecha: {new Date(courseResult.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <ScreenSecurity />
      <div className="relative z-10">
        <Navbar
          bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
          borderColor="border border-stone-300"
          user={user ? { profilePicture: uri_picture } : undefined}
          toggleSidebar={toggleSidebar}
        />
        <SidebarDrawer
          isDrawerOpen={isDrawerOpen}
          toggleSidebar={toggleSidebar}
        />
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r pt-40 pb-10 from-brand-100 via-brand-200 to-brand-300 p-4">
        <h1 className="text-2xl font-bold mb-4 text-white">Notas del Curso</h1>
        <div className="w-full max-w-screen-lg mt-8">{renderNotas()}</div>
      </div>
    </div>
  );
};

export default DetailNota;
