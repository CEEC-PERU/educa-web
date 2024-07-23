import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { Profile } from '../../interfaces/UserInterfaces';
import SidebarDrawer from '../../components/student/DrawerNavigation';
import { useCourseDetail } from '../../hooks/useCourseDetail';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import React, { useState } from 'react';
import './../../app/globals.css';

//CourseDetails
const CourseDetails = () => {
  const { logout, user, profileInfo } = useAuth();
  const router = useRouter();
  const { course_id } = router.query;

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

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300 p-4">
        {courseDetail.map(courseDetails => (
          <div key={courseDetails.course_id} className="max-w-screen-lg mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 p-4">
            <div className="text-white">
              <h1 className="text-3xl lg:text-5xl font-bold mb-8">{courseDetails.name}</h1>
              <p className="text-sm lg:text-base mb-4">{courseDetails.description_short}</p>
              <div className="flex items-center">
                <img src={courseDetails.courseProfessor.image} className='rounded-full w-16 h-16 lg:w-20 lg:h-20 mr-4' alt={courseDetails.courseProfessor.full_name} />
                <div>
                  <p className="text-lg lg:text-xl text-brandrosa-500 font-bold">{courseDetails.courseProfessor.full_name}</p>
                  <p className="text-xs lg:text-sm">{courseDetails.courseProfessor.description}</p>
                </div>
              </div>
            </div>
            <div className="aspect-w-16 aspect-h-9">
              <video
                width="600"
                controls
                controlsList="nodownload"
                onContextMenu={(e) => e.preventDefault()}
                className="rounded-lg w-full"
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
              <p className="text-sm lg:text-base mb-4">{courseDetails.description_large}</p>
              <div>
                <h2 className="text-xl font-bold mb-4">Con este curso aprenderás a:</h2>
                {courseDetails.courseModules.map(module => (
                  <div key={module.module_id} className="flex items-center mb-2">
                    <img
                      src="https://res.cloudinary.com/dk2red18f/image/upload/v1720132228/WEB_EDUCA/WEB-IMAGENES/mfhd6gr1moprougfd1ig.png"
                      className="w-4 h-4 lg:w-6 lg:h-6 mr-2"
                      alt="Module icon"
                    />
                    <p className="text-sm lg:text-base">{module.name}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-transparent border border-gray-300 rounded p-4">
              <button
                className="bg-brandmora-500 text-white px-2 lg:px-4 py-1 lg:py-2 rounded hover:bg-brandmorado-700 border-4 border-brandborder-400 flex items-center"
                onClick={navigateToCourseDetails}
              >
                Empezar el curso
              </button>

              <div className="bg-gradient-to-r from-brand-300 via-brand-200 to-brandazul-200 border-gray-300 rounded p-4 mt-4">
                <img
                  src="https://res.cloudinary.com/dk2red18f/image/upload/v1720197722/WEB_EDUCA/ICONOS/gbm5c8g3wy1mzxncwany.png"
                  className="w-4 h-4 lg:w-6 lg:h-6 mr-2"
                  alt="Module icon"
                />
                <text className='text-white text-sm lg:text-base'>Gracias a nuestro cliente, accedes a todos los cursos y beneficios de nuestro catálogo.</text>
                <button
                  className="bg-brandmora-500 text-white px-2 lg:px-4 py-1 lg:py-2 rounded hover:bg-brandmorado-700 border-4 border-brandborder-400 flex items-center mt-4"
                  onClick={navigateToCourseDetails}
                >
                  Ver catálogo de cursos
                </button>
              </div>

              <div className="bg-transparent border border-gray-300 rounded p-4 mt-4">
                <div className="flex items-center mb-2">
                  <img
                    src="https://res.cloudinary.com/dk2red18f/image/upload/v1720197367/WEB_EDUCA/ICONOS/lrnfzdnkubtj6f6nonhi.png"
                    className="w-4 h-4 lg:w-6 lg:h-6 mr-2"
                    alt="Module icon"
                  />
                  <p className="text-sm lg:text-base text-white">10 Estudiantes</p>
                </div>
                <div className="flex items-center mb-2">
                  <img
                    src="https://res.cloudinary.com/dk2red18f/image/upload/v1720197367/WEB_EDUCA/ICONOS/aztzll0keyleiitexmex.png"
                    className="w-4 h-4 lg:w-6 lg:h-6 mr-2"
                    alt="Module icon"
                  />
                  <p className="text-sm lg:text-base text-white">Duración: 1h</p>
                </div>
                <div className="flex items-center mb-2">
                  <img
                    src="https://res.cloudinary.com/dk2red18f/image/upload/v1720197367/WEB_EDUCA/ICONOS/usna5kpyfkorticwhawp.png"
                    className="w-4 h-4 lg:w-6 lg:h-6 mr-2"
                    alt="Module icon"
                  />
                  <p className="text-sm lg:text-base text-white">20 Lecciones</p>
                </div>
                <div className="flex items-center mb-2">
                  <img
                    src="https://res.cloudinary.com/dk2red18f/image/upload/v1720197367/WEB_EDUCA/ICONOS/lvnniyn1pecmrvj98zi4.png"
                    className="w-4 h-4 lg:w-6 lg:h-6 mr-2"
                    alt="Module icon"
                  />
                  <p className="text-sm lg:text-base text-white">Nivel Intermedio</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="items-center justify-center bg-gradient-to-r px-4 lg:px-60 from-brand-100 via-brand-200 to-brand-300 pb-20">
        <h1 className="text-2xl lg:text-3xl font-bold mb-4 text-white pt-20">Temario</h1>
        {courseDetail.map(courseDetails => (
          <div key={courseDetails.course_id}>
            {courseDetails.courseModules.map(module => (
              <div key={module.module_id} className="items-center justify-center bg-brandazul-600 mb-4 p-4 border border-gray-300 rounded text-white">
                <div className="flex items-center">
                  <img
                    src="https://res.cloudinary.com/dk2red18f/image/upload/v1720197367/WEB_EDUCA/ICONOS/rp2dudec5uvmkpq2e9rw.png"
                    className="w-5 h-10 lg:w-5 lg:h-10 mr-2"
                    alt="Module icon"
                  />
                  <p className="text-sm lg:text-base mr-2">Módulo: {module.name}</p>
                </div>
                <div className="ml-8">
                  {module.moduleSessions.map(session => (
                    <div key={module.module_id} className="flex items-center mb-2">
                      <img
                        src="https://res.cloudinary.com/dk2red18f/image/upload/v1720200323/WEB_EDUCA/ICONOS/pxuankjrczkaks3sei4m.png"
                        className="w-4 h-4 lg:w-6 lg:h-6 mr-2"
                        alt="Session icon"
                      />
                      <p className="text-sm lg:text-base">Sesión: {session.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}

        <h1 className="text-2xl lg:text-3xl font-bold mb-4 text-white">Docente</h1>
        <div className="items-center justify-center bg-gradient-to-r border-2 border-brandblanco-200 rounded from-brand-100 via-brand-200 to-brand-300 p-4">
          {courseDetail.map(courseDetails => (
            <div key={courseDetails.course_id} className="max-w-screen-lg mx-auto grid grid-cols-1 lg:grid-cols-1 gap-8 p-4">
              <div className="text-white">
                <div className="flex items-center">
                  <img src={courseDetails.courseProfessor.image} className='rounded-full w-16 h-16 lg:w-20 lg:h-20 mr-4' alt={courseDetails.courseProfessor.full_name} />
                  <div>
                    <p className="text-lg lg:text-xl text-brandrosa-500 font-bold">{courseDetails.courseProfessor.full_name}</p>
                    <p className="text-xs lg:text-sm">{courseDetails.courseProfessor.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
