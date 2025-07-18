import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Corporate/CorporateSideBar';
import ButtonContent from '../../components/Content/ButtonContent';
import Modal from '../../components/Admin/Modal';
import Loader from '../../components/Loader';
import ClassroomForm from '../../components/Corporate/ClassromForm';
import SupervisorForm from '../../components/Corporate/SupervisorForm';
import { useAuth } from '../../context/AuthContext';
import { useProfesor } from '../../hooks/useProfesores';
import { useClassroom } from '../../hooks/useClassroom';
import FloatingButton from '../../components/FloatingButton';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import './../../app/globals.css';
import {
  UserGroupIcon,
  UserIcon,
  AcademicCapIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { useCourseStudent } from '../../hooks/useCourseStudents';
import ProfileForm from '../../components/Corporate/ProfileForm';

const Classroom: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    'supervisor' | 'classroom' | 'profile' | null
  >(null);
  const { classrooms, isLoading, fetchClassrooms } = useClassroom();
  const { users } = useProfesor();
  const router = useRouter();
  const { user, profileInfo } = useAuth();
  const { courseStudent } = useCourseStudent();
  const userInfo = user as { enterprise_id: number };
  const [newUserId, setNewUserId] = useState<number | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const handleAddUser = () => {
    setModalType('supervisor');
    setIsModalOpen(true);
  };

  const handleAddClassroom = () => {
    setModalType('classroom');
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalType(null);
    setNewUserId(null);
    fetchClassrooms();
  };

  const handleUserCreateSuccess = (createdUserId: number) => {
    setNewUserId(createdUserId);
    setModalType('profile');
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar
          showSidebar={showSidebar}
          setShowSidebar={() => setShowSidebar(!showSidebar)}
        />

        <main
          className={`flex-grow p-4 md:p-6 transition-all duration-300 ease-in-out ${
            showSidebar ? 'ml-20' : ''
          }`}
        >
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Gestión de Aulas
              </h1>
              <p className="text-gray-600">
                Administra profesores, aulas y cursos de tu institución
              </p>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Teachers Column */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <UserIcon className="h-5 w-5 mr-2 text-blue-500" />
                    Profesores
                  </h2>
                  <FloatingButton
                    onClick={handleAddUser}
                    label="Añadir Profesor"
                  />
                </div>

                <div className="space-y-3">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <div
                        key={user.user_id}
                        className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                      >
                        <img
                          src={
                            user.userProfile?.profile_picture ||
                            '/default-profile.png'
                          }
                          alt="profile"
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="ml-3">
                          <p className="font-medium text-gray-800">
                            {user.userProfile?.first_name}{' '}
                            {user.userProfile?.last_name}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500">
                        No hay profesores asignados
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Classrooms Column - Takes more space */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                      <UserGroupIcon className="h-5 w-5 mr-2 text-blue-500" />
                      Aulas
                    </h2>
                    <FloatingButton
                      onClick={handleAddClassroom}
                      label="Añadir Aula"
                    />
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader />
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
                                  <AcademicCapIcon className="h-4 w-4 mr-2" />
                                  <span>
                                    Empresa: {classroom.Enterprise.name}
                                  </span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <CalendarIcon className="h-4 w-4 mr-2" />
                                  <span>Turno: {classroom.Shift.name}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <UserIcon className="h-4 w-4 mr-2" />
                                  <span>
                                    Profesor:{' '}
                                    {classroom.User.userProfile?.first_name}{' '}
                                    {classroom.User.userProfile?.last_name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500">No hay aulas disponibles</p>
                    </div>
                  )}
                </div>

                {/* Courses Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                    <AcademicCapIcon className="h-5 w-5 mr-2 text-blue-500" />
                    Cursos Asignados
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {courseStudent.length > 0 ? (
                      courseStudent.map((course) => (
                        <div
                          key={course.course_id}
                          className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
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
                      ))
                    ) : (
                      <div className="col-span-full text-center py-4">
                        <p className="text-gray-500">No hay cursos asignados</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      <Modal
        show={isModalOpen}
        onClose={handleModalClose}
        title={
          modalType === 'supervisor'
            ? 'Registrar Profesor'
            : modalType === 'classroom'
            ? 'Registrar nueva aula'
            : 'Completar perfil'
        }
      >
        {modalType === 'profile' && newUserId ? (
          profileLoading ? (
            <Loader />
          ) : (
            <ProfileForm userId={newUserId} onSuccess={handleModalClose} />
          )
        ) : modalType === 'supervisor' ? (
          <SupervisorForm
            roleId={6}
            initialEnterpriseId={userInfo.enterprise_id}
            onClose={handleModalClose}
            onSuccess={handleUserCreateSuccess}
          />
        ) : modalType === 'classroom' ? (
          <ClassroomForm
            onClose={handleModalClose}
            onSuccess={handleModalClose}
          />
        ) : null}
      </Modal>
    </div>
  );
};

export default Classroom;
