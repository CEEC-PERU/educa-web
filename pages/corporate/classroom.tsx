import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Corporate/CorporateSideBar';
import Modal from '../../components/Admin/Modal';
import Loader from '../../components/Loader';
import ClassroomForm from '../../components/Corporate/ClassromForm';
import SupervisorForm from '../../components/Corporate/SupervisorForm';
import { useAuth } from '../../context/AuthContext';
import { useProfesor } from '../../hooks/useProfesores';
import { useClassroom } from '../../hooks/useClassroom';
import FloatingButton from '../../components/FloatingButton';
import './../../app/globals.css';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { useCourseStudent } from '../../hooks/useCourseStudents';
import ProfileForm from '../../components/Corporate/ProfileForm';

const Classroom: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'supervisor' | 'classroom' | 'profile' | null>(null);
  const { classrooms, isLoading } = useClassroom();
  const { users } = useProfesor();
  const { courseStudent } = useCourseStudent();
  const { user } = useAuth();
  const userInfo = user as { enterprise_id: number };
  const [newUserId, setNewUserId] = useState<number | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<number | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [showClassroomForm, setShowClassroomForm] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);

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
  };

  const handleUserCreateSuccess = (createdUserId: number) => {
    setNewUserId(createdUserId);
    setModalType('profile');
  };

  const handleClassroomSelect = (classroomId: number) => {
    setSelectedClassroom(classroomId);
  };

  const handleCourseSelect = (courseId: number) => {
    setSelectedCourses((prevSelected) =>
      prevSelected.includes(courseId)
        ? prevSelected.filter((id) => id !== courseId)
        : [...prevSelected, courseId]
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={() => setShowSidebar(!showSidebar)} />
        <main className={`flex-grow p-6 transition-all duration-300 ease-in-out ${showSidebar ? 'ml-20' : ''}`}>
          <div className="pb-4"></div>

          {/* Professors Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <div className="flex justify-left items-center mb-6">
                <FloatingButton onClick={handleAddUser} label="Añadir Profesor" />
                <h2 className="text-xl font-bold ml-3">Profesores</h2>
              </div>
              {users.length > 0 ? (
                users.map((user) => (
                  <div key={user.user_id} className="flex items-center mt-2 border-2 border-e-cyan-800 p-5">
                    <img
                      src={user.userProfile?.profile_picture || '/default-course-image.jpg'}
                      alt="profile"
                      className="h-12 w-12 mr-4 rounded-full"
                    />
                    <p className="text-gray-700">{user.userProfile?.first_name} {user.userProfile?.last_name}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No hay profesores asignados</p>
              )}
            </div>

            {/* Classroom Section */}
            <div className="grid grid-cols-1 gap-6 w-full max-w-4xl">
              <div className="flex justify-left items-center mb-6">
                <FloatingButton onClick={() => setShowClassroomForm((prev) => !prev)} label="Asignar Aula" />
                <h2 className="text-xl font-bold ml-3">Aulas</h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {!isLoading && classrooms && classrooms.length > 0 ? (
                  classrooms.map((classroom) => (
                    <div key={classroom.classroom_id} className="flex items-center p-4 bg-white shadow rounded-md">
                      <div className="mr-4">
                        <UserGroupIcon className="h-10 w-10 text-blue-500" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-bold text-lg">{classroom.code}</h3>
                        <p className="text-gray-600">Empresa: {classroom.Enterprise.name}</p>
                        <p className="text-gray-600">Turno: {classroom.Shift.name}</p>
                        <p className="text-black">Profesor: {classroom.User.userProfile.first_name} {classroom.User.userProfile.last_name}</p>
                        <p className="text-gray-600">Creado el: {new Date(classroom.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No hay aulas disponibles</p>
                )}
              </div>

              {/* Classroom Assignment Form */}
              {showClassroomForm && (
                <div className="mt-4 p-4 border rounded-md bg-white">
                  <h3 className="font-bold mb-2">Seleccionar Aula</h3>
                  <select
                    value={selectedClassroom || ''}
                    onChange={(e) => handleClassroomSelect(Number(e.target.value))}
                    className="p-2 border rounded w-full"
                  >
                    <option value="">Seleccione un aula</option>
                    {classrooms.map((classroom) => (
                      <option key={classroom.classroom_id} value={classroom.classroom_id}>
                        {classroom.code}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Courses Section */}
            <div>
              <h4 className="font-bold text-md">Cursos</h4>
              <button onClick={() => setShowCourseForm((prev) => !prev)} className="mt-2 mb-4 p-2 bg-green-500 text-white rounded">
                Asignar Cursos
              </button>
              {courseStudent.length > 0 ? (
                courseStudent.map((course) => (
                  <div
                    key={course.course_id}
                    onClick={() => handleCourseSelect(course.course_id)}
                    className={`flex items-center mt-2 border-2 p-5 rounded-md ${
                      selectedCourses.includes(course.course_id) ? 'bg-green-100 border-green-500' : 'border-e-cyan-800'
                    }`}
                  >
                    <img
                      src={course.Course.image || '/default-course-image.jpg'}
                      alt={course.Course.name}
                      className="h-12 w-12 mr-4 rounded-full"
                    />
                    <p className="text-gray-700">{course.Course.name}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No hay cursos asignados</p>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal that loads form based on modalType */}
      <Modal show={isModalOpen} onClose={handleModalClose} title={modalType === 'supervisor' ? 'Registrar Profesor' : 'Registrar nuevo aula'}>
        {modalType === 'profile' && newUserId ? (
          profileLoading ? (
            <Loader />
          ) : (
            <ProfileForm userId={newUserId} onSuccess={handleModalClose} />
          )
        ) : modalType === 'supervisor' ? (
          <SupervisorForm roleId={6} initialEnterpriseId={userInfo.enterprise_id} onClose={handleModalClose} onSuccess={handleUserCreateSuccess} />
        ) : modalType === 'classroom' ? (
          <ClassroomForm onClose={handleModalClose} onSuccess={handleModalClose} />
        ) : null}
      </Modal>
    </div>
  );
};

export default Classroom;
