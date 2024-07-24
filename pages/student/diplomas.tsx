import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import SidebarDrawer from '../../components/student/DrawerNavigation';
import Navbar from '../../components/Navbar';
import { Profile } from '../../interfaces/UserInterfaces';
import { useCourseStudent } from '../../hooks/useCourseStudents';
import CourseCard from '../../components/student/CourseCard';
import { XCircleIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import './../../app/globals.css';

Modal.setAppElement('#__next'); 

const Diplomas: React.FC = () => {
  const { logout, user, profileInfo } = useAuth();
  const { courseStudent, isLoading } = useCourseStudent();
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const router = useRouter();
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

  const navigateToCourseDetails = () => {
    router.push({
      pathname: '/student/course-details',
      query: { course_id: selectedCourse.course_id }
    });
    console.log("selectedCourse:", selectedCourse); // Verifica el estado de selectedCourse
    console.log("selectedCourse.course_id:", selectedCourse?.course_id); // Verifica course_id
  };

  const toggleSidebar = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div>
      <div className="relative z-10">
        <Navbar
          bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
          borderColor="border border-stone-300"
          user={user ? { profilePicture: uri_picture } : undefined}
          toggleSidebar={toggleSidebar}
          />
           <SidebarDrawer isDrawerOpen={isDrawerOpen} toggleSidebar={toggleSidebar} />
      </div>
 
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300 ">
        <div className="max-w-screen-lg mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 ">
          <div className="text-white">
            <h1 className="text-2xl font-bold mb-4">Mis Diplomas</h1>
             
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <img
                src="https://res.cloudinary.com/dk2red18f/image/upload/v1721844303/WEB_EDUCA/DIPLOMA/zus1a1zbfsi5qstfslol.png"
                className="w-full h-48 object-cover rounded-md mb-4 border-4 border-brand-100"
                alt="Module icon"
              />
              <button 
                className="bg-brand-300 text-white px-4 py-2 rounded-lg hover:bg-brand-200"
                onClick={() => window.open('https://res.cloudinary.com/dk2red18f/image/upload/v1721844303/WEB_EDUCA/DIPLOMA/uzmb7q4f42vipmncvtht.pdf', '_blank')}
              >
                Descargar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Diplomas;
