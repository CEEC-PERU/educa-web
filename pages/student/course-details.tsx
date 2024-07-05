import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { Profile } from '../../interfaces/UserInterfaces';
import SidebarDrawer from '../../components/student/DrawerNavigation';
import { useCourseDetail } from '../../hooks/useCourseDetail';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import React, { useState } from 'react';
import './../../app/globals.css';

const CourseDetails = () => {
  const { logout, user, profileInfo } = useAuth();
  const router = useRouter();
  const { course_id } = router.query;

  // Convert course_id to number if it's a string and not undefined
  const courseIdNumber = Array.isArray(course_id) ? parseInt(course_id[0]) : parseInt(course_id || '0');
  const { courseDetail, isLoading } = useCourseDetail(courseIdNumber);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  let name = '';
  let uri_picture = '';

  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    uri_picture = profile.profile_picture!;
  }

  const navigateToCourseDetails = () => {
    router.push({
      pathname: '/student/modulos/',
      query: { course_id: courseIdNumber }
    });
  };

  return (
    <div>
      <div className="relative z-10">
        <Navbar
          bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
          borderColor="border border-stone-300"
          user={user ? { profilePicture: uri_picture } : undefined}
        />
        <SidebarDrawer isDrawerOpen={isDrawerOpen} />
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300 p-4">
        {courseDetail.map(courseDetails => (
          <div key={courseDetails.course_id} className="max-w-screen-lg mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 p-4">
            <div className="text-white">
              <h1 className="text-5xl font-bold mb-8">{courseDetails.name}</h1>
              <p className="text-base mb-4">{courseDetails.description_short}</p>
              <div className="flex items-center">
                <img src={courseDetails.courseProfessor.image} className='rounded-full size-20 mr-4' alt={courseDetails.courseProfessor.full_name} />
                <div>
                  <p className="text-xl text-brandrosa-500 font-bold">{courseDetails.courseProfessor.full_name}</p>
                  <p className="text-sm">{courseDetails.courseProfessor.description}</p>
                </div>
              </div>
            </div>
            <div className="aspect-w-16 aspect-h-9">
              <video
                width="600"
                controls
                controlsList="nodownload"
                onContextMenu={(e) => e.preventDefault()}
                className="rounded-lg"
              >
                <source src={courseDetails.intro_video} type="video/mp4" />
              </video>
            </div>
          </div>
        ))}
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-100 p-4">
        {courseDetail.map(courseDetails => (
          <div key={courseDetails.courseCategory.name} className="max-w-screen-lg mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 p-4">
            <div className="text-white">
              <h1 className="text-2xl font-bold mb-4">Descripción del curso</h1>
              <p className="text-base mb-4">{courseDetails.description_large}</p>
              <div>
                <h2 className="text-xl font-bold mb-4">Con este curso aprenderás a:</h2>
                {courseDetails.courseModules.map(module => (
                  <div key={module.module_id} className='flex items-center'>
                    <img src="https://res.cloudinary.com/dk2red18f/image/upload/v1720132228/WEB_EDUCA/WEB-IMAGENES/mfhd6gr1moprougfd1ig.png" className="w-6 h-6 mr-2" alt="Module icon" />
                    <p key={module.module_id} className="text-base">{module.name}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-200 border border-gray-300 rounded p-4">
              <button
                className="bg-brandmora-500 text-white px-4 rounded hover:bg-brandmorado-700 border-2 border-brandborder-400 flex items-center"
                onClick={navigateToCourseDetails}
              >
                Detalles del curso
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300 p-4">
        {courseDetail.map(courseDetails => (
          <div key={courseDetails.course_id} className="max-w-screen-lg mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 p-4">
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-4">Temario</h1>
              {courseDetails.courseModules.map(module => (
                <div key={module.module_id} className="flex items-center">
                  <p key={module.module_id} className="text-base mr-2">Módulo: {module.name}</p>
                </div>
              ))}
              <div className="flex justify-end mt-4">
               
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseDetails;
