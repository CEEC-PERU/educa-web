import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { Profile } from '../../interfaces/UserInterfaces';
import SidebarDrawer from '../../components/student/DrawerNavigation';
import { useCourseDetail } from '../../hooks/useCourseDetail';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import React, { useState } from 'react';
const CourseDetails = () => {
  const { logout, user, profileInfo } = useAuth();
  const router = useRouter();
  const { course_id } = router.query;

  // Convertir course_id a número si es una cadena y no está indefinido
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
    <ProtectedRoute>
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
          <div key={courseDetails.course_id} className="max-w-screen-lg mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Texto de color blanco */}
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-4">{courseDetails.name}</h1>
              <p className="text-lg mb-4">{courseDetails.description_short}</p>
              <div>
                <img src={courseDetails.courseProfessor.image} className='rounded-full' alt={courseDetails.courseProfessor.full_name} />
                <p className="text-base">{courseDetails.courseProfessor.full_name}</p>
                <p className="text-base">{courseDetails.courseProfessor.description}</p>
              </div>
            </div>
            {/* Video */}
            <div className="aspect-w-16 aspect-h-9">
              {/* Aquí colocarías tu reproductor de video o el componente de video */}
              <video
              width="600"
               controls
        controlsList="nodownload"
                onContextMenu={(e) => e.preventDefault()}
              >
                  <source src={courseDetails.intro_video} type="video/mp4" />
                </video>
            </div>
          </div>
        ))}
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-100 p-4">
        {courseDetail.map(courseDetails => (
          <div key={courseDetails.courseCategory.name} className="max-w-screen-lg mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-4">Descripción del curso</h1>
              <p className="text-lg mb-4">{courseDetails.description_large}</p>
              <div>
                <h2 className="text-3xl font-bold mb-4">Con este curso aprenderás a:</h2>
                {courseDetails.courseModules.map(module => (
                  <p key={module.module_id} className="text-base">{module.name}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300 p-4">
        {courseDetail.map(courseDetails => (
          <div key={courseDetails.course_id} className="max-w-screen-lg mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Texto de color blanco */}
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-4">Temario</h1>
              <p className="text-lg mb-4">{courseDetails.description_short}</p>
              {courseDetails.courseModules.map(module => (
                 <div key={module.module_id} >
                 <p key={module.module_id} className="text-base">Modulo : {module.name}</p>
               
               </div>
                ))}
              <div className="flex justify-end mt-4">
                <button 
                  className="bg-brandmora-500 text-white px-4 rounded hover:bg-brandmorado-700 border-2 border-brandborder-400 flex items-center"
                  onClick={navigateToCourseDetails}
                >
                  Detalles del curso 
                </button>
              </div>
            </div>
           
          </div>
        ))}
      </div>
    </ProtectedRoute>
  );
}

export default CourseDetails;
