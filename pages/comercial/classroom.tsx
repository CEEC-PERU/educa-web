import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/comercial/ComercialSidebar';
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
    <div className="relative min-h-screen bg-gray-50">
      <Navbar bgColor="bg-gradient-to-r from-blue-600 to-indigo-700" />
      <div className="flex flex-1 pt-16">
        <Sidebar
          showSidebar={showSidebar}
          setShowSidebar={() => setShowSidebar(!showSidebar)}
        />

        <main
          className={`flex-grow p-6 transition-all duration-300 ease-in-out ${
            showSidebar ? 'ml-20' : 'ml-0'
          }`}
        >
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800">
                Gestión de Aulas
              </h1>
              <p className="text-gray-600">
                Administra profesores, aulas y cursos
              </p>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Teachers Column */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Profesores
                  </h2>
                  <button
                    onClick={handleAddUser}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
                  >
                    Añadir
                  </button>
                </div>
                <div className="space-y-3">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <div
                        key={user.user_id}
                        className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors border border-gray-100"
                      >
                        <img
                          src={
                            user.userProfile?.profile_picture ||
                            '/default-avatar.png'
                          }
                          alt="profile"
                          className="h-10 w-10 mr-3 rounded-full object-cover"
                        />
                        <div>
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

              {/* Classrooms Column */}
              <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <UserGroupIcon className="h-5 w-5 mr-2 text-indigo-600" />
                    Aulas
                  </h2>
                  <button
                    onClick={handleAddClassroom}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
                  >
                    Añadir
                  </button>
                </div>
                <div className="space-y-4">
                  {!isLoading && classrooms && classrooms.length > 0 ? (
                    classrooms.map((classroom) => (
                      <div
                        key={classroom.classroom_id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start">
                          <div className="bg-indigo-100 p-3 rounded-full mr-4">
                            <UserGroupIcon className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-bold text-gray-800">
                                {classroom.code}
                              </h3>
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {classroom.Shift.name}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Empresa: {classroom.Enterprise.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Profesor: {classroom.User.userProfile.first_name}{' '}
                              {classroom.User.userProfile.last_name}
                            </p>
                            <div className="mt-2 flex justify-between items-center">
                              <p className="text-xs text-gray-500">
                                Creado el:{' '}
                                {new Date(
                                  classroom.created_at
                                ).toLocaleDateString()}
                              </p>
                              <button className="text-xs text-blue-600 hover:text-blue-800">
                                Ver detalles
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500">No hay aulas disponibles</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Courses Section */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <AcademicCapIcon className="h-5 w-5 mr-2 text-purple-600" />
                  Cursos Asignados
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {courseStudent.length > 0 ? (
                  courseStudent.map((course) => (
                    <div
                      key={course.course_id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <img
                          src={
                            course.Course.image || '/default-course-image.jpg'
                          }
                          alt={course.Course.name}
                          className="h-12 w-12 mr-3 rounded-md object-cover"
                        />
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {course.Course.name}
                          </h3>
                        </div>
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
        </main>
      </div>

      {/* Modal */}
      <Modal
        show={isModalOpen}
        onClose={handleModalClose}
        title={
          modalType === 'supervisor'
            ? 'Registrar Nuevo Profesor'
            : modalType === 'classroom'
            ? 'Crear Nueva Aula'
            : 'Completar Perfil'
        }
      >
        {modalType === 'profile' && newUserId ? (
          profileLoading ? (
            <div className="flex justify-center py-8">
              <Loader />
            </div>
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
