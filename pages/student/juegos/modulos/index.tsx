import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import SidebarDrawer from '../../../../components/student/DrawerNavigation';
import Navbar from '../../../../components/Navbar';
import { Profile } from '../../../../interfaces/User/UserInterfaces';
import { useCourseStudent } from '../../../../hooks/useCourseStudents';
import { useRouter } from 'next/router';
import './../../../../app/globals.css';
import { Module } from '../../../../interfaces/Module';
import { getModulesByCourseId } from '../../../../services/courses/courseService';
import ProtectedRoute from '../../../../components/Auth/ProtectedRoute';
const ModuleIndex: React.FC = () => {
  const router = useRouter();
  const { courseid } = router.query;
  const [modules, setModules] = useState<Module[]>([]);
  const { logout, user, profileInfo } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const { courseStudent, isLoading } = useCourseStudent();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  let name = '';
  let uri_picture = '';

  useEffect(() => {
    if (courseid) {
      const fetchModulesAndEvaluations = async () => {
        try {
          const [modulesData] = await Promise.all([
            getModulesByCourseId(Number(courseid)),
          ]);
          setModules(modulesData);
        } catch (error) {
          setError('Error fetching modules and evaluations');
          console.error('Error fetching modules and evaluations:', error);
        }
      };
      fetchModulesAndEvaluations();
    }
  }, [courseid]);

  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    uri_picture = profile.profile_picture!;
  }

  const toggleSidebar = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const navigateToFlashcard = (module_id: number) => {
    router.push({
      pathname: '/student/juegos/modulos/flashcards',
      query: { module_id },
    });
  };

  return (
    <ProtectedRoute>
      <div>
        {/* Navbar and Sidebar */}
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

        {/* Main Content */}
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300 p-4 pt-40 pb-40">
          {/* Header Image */}
          <div className="flex flex-col lg:flex-row items-center p-8 rounded-lg shadow-md w-full max-w-screen-lg pb-20">
            <img
              src="https://res.cloudinary.com/dk2red18f/image/upload/v1721710871/WEB_EDUCA/fdlrrlouggyv3b7yvaag.gif"
              alt="Header Image"
              className="w-350 h-48 object-cover"
            />
          </div>

          {/* Module Cards */}
          <div className="w-full max-w-screen-lg mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <div
                key={module.module_id}
                className="bg-brandmorado-700 rounded-lg shadow-md p-6 flex flex-col justify-between transition-transform transform hover:scale-105"
              >
                <h3 className="text-lg font-semibold text-white">
                  {module.name}
                </h3>

                {/* Flashcard Button */}
                <button
                  onClick={() => navigateToFlashcard(module.module_id)}
                  className="mt-4 px-4 py-2 bg-white text-brand-300 font-bold rounded-full hover:bg-brand-200 transition-colors"
                >
                  Jugar Flashcards
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ModuleIndex;
