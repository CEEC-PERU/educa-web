import React, { useState } from 'react';
import Modal from 'react-modal';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import SidebarDrawer from '../../components/student/DrawerNavigation';
import Navbar from '../../components/Navbar';
import { Profile } from '../../interfaces/User/UserInterfaces';
import { useCourseStudent } from '../../hooks/useCourseStudents';
import CourseCard from '../../components/student/CourseCard';
import { useRouter } from 'next/router';

import './../../app/globals.css';

Modal.setAppElement('#__next');

const Diplomas: React.FC = () => {
  const { logout, user, profileInfo } = useAuth();
  const { courseStudent, isLoading } = useCourseStudent();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  let name = '';
  let uri_picture = '';

  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    uri_picture = profile.profile_picture!;
  }

  const toggleSidebar = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <ProtectedRoute>
      <div>
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

        <div className="min-h-screen bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-60">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Columna 1: Contenido principal */}
              <div className="text-white">
                <h1 className="text-2xl font-bold mb-4 text-center lg:text-left">
                  Mis Diplomas
                </h1>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <img
                    src="https://res.cloudinary.com/dk2red18f/image/upload/v1721844303/WEB_EDUCA/DIPLOMA/zus1a1zbfsi5qstfslol.png"
                    className="w-full h-auto object-contain rounded-md mb-4 border-4 border-brand-100"
                    alt="Diploma"
                  />
                  <button
                    className="w-full bg-brand-300 text-white px-4 py-2 rounded-lg hover:bg-brand-200"
                    onClick={() =>
                      window.open(
                        'https://res.cloudinary.com/dk2red18f/image/upload/v1721844303/WEB_EDUCA/DIPLOMA/uzmb7q4f42vipmncvtht.pdf',
                        '_blank',
                      )
                    }
                  >
                    Descargar Diploma
                  </button>
                </div>
              </div>

              {/* Columna 2: Imagen descriptiva */}
              <div className="flex justify-center lg:justify-end">
                <img
                  src="https://res.cloudinary.com/dk2red18f/image/upload/v1724273141/WEB_EDUCA/gy7xwx0d7banshaqmitz.png"
                  className="w-full max-w-xs h-auto object-contain"
                  alt="Imagen descriptiva"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Diplomas;
