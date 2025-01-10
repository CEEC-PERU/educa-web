import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/supervisor/SibebarSupervisor';
import {  getUsersByCompanyAndRole} from '../../../services/userService';
import ButtonContent from '../../../components/Content/ButtonContent';
import ClassroomForm from '../../../components/supervisor/ClassromForm';
import Modal from '../../../components/Admin/Modal';
import { useAuth } from '../../../context/AuthContext';
import {  UserGroupIcon} from '@heroicons/react/24/outline';

import { useClassroomBySupervisor} from '../../../hooks/useClassroom';
import { useCourseStudent} from '../../../hooks/useCourseStudents';
import './../../../app/globals.css';


const Classroom: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const router = useRouter();
  const { classrooms, isLoading } = useClassroomBySupervisor();
  const { logout, user, profileInfo } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { courseStudent } = useCourseStudent(); // Fetch the courses for the student
  
  const handleAddUser = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleUserCreateSuccess = () => {
    setIsModalOpen(false);
    router.reload();
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={true} setShowSidebar={() => {}} />
        <main className={`flex-grow p-6 transition-all duration-300 ease-in-out ${showSidebar ? 'ml-20' : ''}`}>
          <div className='pb-4'></div>
          <div className="flex space-x-4 mb-4">
            <div>
              <ButtonContent
                buttonLabel="Registrar Aula"
                backgroundColor="bg-yellow-500"
                textColor="text-white"
                fontSize="text-xs"
                buttonSize="py-2 px-7"
                onClick={handleAddUser}
              />
            </div>


          </div>
          <div className='grid grid-cols-2 '>
          <div className="grid grid-cols-1 gap-6 w-full max-w-4xl">
            <h2 className="text-lg font-semibold mb-2 text-black">Aulas</h2>
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
                      <p className="text-gray-600">Creado el: {new Date(classroom.created_at).toLocaleDateString()}</p>
                    </div>

                    {/* Courses Section */}
                   
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No hay aulas disponibles</p>
              )}
            </div>
          
          </div>
          <div className=" pl-20  flex-grow  grid-cols-2" >
            
                      <h4 className="font-bold text-md">Courses</h4>
                      {courseStudent.length > 0 ? (
                        courseStudent.map((course) => (
                          <div key={course.course_id} className="flex items-center mt-2  border-2 border-e-cyan-800 p-5">
                            <img
                              src={course.Course.image || '/default-course-image.jpg'}
                              alt={course.Course.name}
                              className="h-12 w-12 mr-4"
                            />
                            <p className="text-gray-700">{course.Course.name}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600">No courses assigned</p>
                      )}
                    </div>

                    </div>

          <div>
         
          </div>
        </main>
      </div>
      <Modal show={isModalOpen} onClose={handleModalClose} title="Registrar nuevo usuario">
        <ClassroomForm onClose={handleModalClose} onSuccess={handleUserCreateSuccess} />
      </Modal>
    </div>
  );
};

export default Classroom;
