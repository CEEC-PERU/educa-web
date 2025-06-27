import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/supervisor/SibebarSupervisor';
import ButtonContent from '../../../components/Content/ButtonContent';
import ClassroomForm from '../../../components/supervisor/ClassromForm';
import Modal from '../../../components/Admin/Modal';
import { useAuth } from '../../../context/AuthContext';
import {
  UserGroupIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  ClockIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { useClassroomBySupervisor } from '../../../hooks/useClassroom';
import { useCourseStudent } from '../../../hooks/useCourseStudents';
import './../../../app/globals.css';

const Classroom: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const router = useRouter();
  const { classrooms, isLoading } = useClassroomBySupervisor();
  const { courseStudent } = useCourseStudent();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddClassroom = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleClassroomCreateSuccess = () => {
    setIsModalOpen(false);
    router.reload();
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

        <main
          className={`flex-grow p-4 md:p-6 transition-all duration-300 ease-in-out ${
            showSidebar ? 'ml-20' : ''
          }`}
        >
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Gestión de Aulas
                </h1>
                <p className="text-gray-600">
                  Administra las aulas asignadas a tu supervisión
                </p>
              </div>
              <ButtonContent
                buttonLabel="Registrar Nueva Aula"
                backgroundColor="bg-yellow-500 hover:bg-yellow-600"
                textColor="text-white"
                fontSize="text-sm"
                buttonSize="py-2 px-4"
                onClick={handleAddClassroom}
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Classrooms Section - Takes 2/3 space */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <UserGroupIcon className="h-5 w-5 mr-2 text-blue-500" />
                    Aulas Asignadas
                  </h2>

                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : classrooms && classrooms.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {classrooms.map((classroom) => (
                        <div
                          key={classroom.classroom_id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start">
                            <div className="bg-blue-100 p-3 rounded-full mr-4">
                              <UserGroupIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-gray-800">
                                {classroom.code}
                              </h3>
                              <div className="mt-2 space-y-1">
                                <div className="flex items-center text-sm text-gray-600">
                                  <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                                  <span>
                                    Empresa: {classroom.Enterprise.name}
                                  </span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <ClockIcon className="h-4 w-4 mr-2" />
                                  <span>Turno: {classroom.Shift.name}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <CalendarIcon className="h-4 w-4 mr-2" />
                                  <span>
                                    Creado:{' '}
                                    {new Date(
                                      classroom.created_at
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-gray-500">
                        No hay aulas disponibles
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Courses Section - Takes 1/3 space */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <AcademicCapIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Cursos Asociados
                </h2>

                {courseStudent.length > 0 ? (
                  <div className="space-y-3">
                    {courseStudent.map((course) => (
                      <div
                        key={course.course_id}
                        className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <img
                          src={
                            course.Course.image || '/default-course-image.jpg'
                          }
                          alt={course.Course.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                        <div className="ml-3">
                          <p className="font-medium text-gray-800">
                            {course.Course.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-500">
                      No hay cursos asignados
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Classroom Registration Modal */}
      <Modal
        show={isModalOpen}
        onClose={handleModalClose}
        title="Registrar Nueva Aula"
      >
        <ClassroomForm
          onClose={handleModalClose}
          onSuccess={handleClassroomCreateSuccess}
        />
      </Modal>
    </div>
  );
};

export default Classroom;
