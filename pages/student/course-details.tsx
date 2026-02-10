import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import CourseMaterials from '../../components/student/CourseMaterials';
import { useAuth } from '../../context/AuthContext';
import { Profile } from '../../interfaces/User/UserInterfaces';
import SidebarDrawer from '../../components/student/DrawerNavigation';
import { useCourseDetail } from '../../hooks/courses/useCourseDetail';
import { useCoursesMaterials } from '../../hooks/courses/courseMaterial';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import React, { useState } from 'react';
import './../../app/globals.css';

//datos
const CourseDetails = () => {
  const { logout, user, profileInfo } = useAuth();
  const router = useRouter();
  const { course_id } = router.query;

  const courseIdNumber = Array.isArray(course_id)
    ? parseInt(course_id[0])
    : parseInt(course_id || '0');
  const { coursesMaterials } = useCoursesMaterials(courseIdNumber);
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
      query: { course_id: courseIdNumber },
    });
  };

  const toggleSidebar = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const npsScore = formData.get('nps-score');
    const feedback = formData.get('feedback');

    // Handle form submission logic here, such as sending data to an API.
    console.log({ npsScore, feedback });

    // Reset form after submission
    e.currentTarget.reset();
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

        {/* Hero Section - Mobile First Design */}
        <div className="min-h-screen flex flex-col items-center justify-center p-2 sm:p-4">
          {courseDetail.map((courseDetails) => (
            <div
              key={courseDetails.course_id}
              className="w-full max-w-screen-lg mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 p-2 sm:p-4"
            >
              {/* Text Content */}
              <div className="text-black order-2 lg:order-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 lg:mb-8 leading-tight">
                  {courseDetails.name}
                </h1>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg mb-4 sm:mb-6 leading-relaxed">
                  {courseDetails.description_short}
                </p>
                <div className="flex items-center">
                  <img
                    src={courseDetails.courseProfessor.image}
                    className="rounded-full w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 mr-3 sm:mr-4 flex-shrink-0"
                    alt={courseDetails.courseProfessor.full_name}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-brandtext365-100 font-bold break-words">
                      {courseDetails.courseProfessor.full_name}
                    </p>
                    <p className="text-xs sm:text-sm md:text-base leading-relaxed">
                      {courseDetails.courseProfessor.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Video Container - Mobile Responsive */}
              <div className="order-1 lg:order-2 w-full flex justify-center">
                {/* Mobile: Vertical video like reel */}
                <div className="block sm:hidden w-full max-w-sm">
                  <div
                    className="relative w-full bg-black rounded-lg overflow-hidden"
                    style={{ aspectRatio: '9/16' }}
                  >
                    <video
                      controls
                      controlsList="nodownload"
                      onContextMenu={(e) => e.preventDefault()}
                      className="w-full h-full object-contain"
                      playsInline
                    >
                      <source
                        src={courseDetails.intro_video}
                        type="video/mp4"
                      />
                    </video>
                  </div>
                </div>

                {/* Tablet and Desktop: Horizontal video */}
                <div className="hidden sm:block w-full">
                  <div
                    className="relative w-full bg-black rounded-lg overflow-hidden"
                    style={{ aspectRatio: '16/9' }}
                  >
                    <video
                      controls
                      controlsList="nodownload"
                      onContextMenu={(e) => e.preventDefault()}
                      className="w-full h-full object-contain"
                      playsInline
                    >
                      <source
                        src={courseDetails.intro_video}
                        type="video/mp4"
                      />
                    </video>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Course Description Section */}
        <div className="min-h-screen flex flex-col items-center justify-center p-2 sm:p-4">
          {courseDetail.map((courseDetails) => (
            <div
              key={courseDetails.courseCategory.name}
              className="w-full max-w-screen-lg mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 p-2 sm:p-4"
            >
              {/* Course Description */}
              <div className="text-black">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
                  Descripción del curso
                </h1>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg mb-4 sm:mb-6 leading-relaxed">
                  {courseDetails.description_large}
                </p>
                <div>
                  <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-3 sm:mb-4">
                    Con este curso aprenderás a:
                  </h2>
                  {courseDetails.courseModules.map((module) => (
                    <div
                      key={module.module_id}
                      className="flex items-start mb-2 sm:mb-3"
                    >
                      {/*
                      <img
                        src="https://res.cloudinary.com/dk2red18f/image/upload/v1720132228/WEB_EDUCA/WEB-IMAGENES/mfhd6gr1moprougfd1ig.png"
                        className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3 mt-1 flex-shrink-0"
                        alt="Module icon"
                      />*/}
                      <p className="text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed">
                        - {module.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Info Cards */}
              <div className="space-y-3 sm:space-y-4">
                {/* Start Course Button with Arrow */}
                <div className="bg-transparent border border-gray-300 rounded-lg p-3 sm:p-4">
                  <button
                    className="w-full sm:w-auto bg-brandm365-100 text-blue px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg hover:bg-brandazul-600 hover:text-white border-2 sm:border-4 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base lg:text-lg font-medium transition-all duration-300 hover:scale-105 group"
                    onClick={navigateToCourseDetails}
                  >
                    <span>Empezar el curso</span>
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </div>

                {/* Catalog Access Card */}
                <div className="bg-brandazul-600 border-gray-300 rounded-lg p-3 sm:p-4">
                  <div className="flex items-start mb-3">
                    <img
                      src="https://res.cloudinary.com/dk2red18f/image/upload/v1720197722/WEB_EDUCA/ICONOS/gbm5c8g3wy1mzxncwany.png"
                      className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3 mt-1 flex-shrink-0"
                      alt="Catalog icon"
                    />
                    <p className="text-white text-xs sm:text-sm md:text-base leading-relaxed">
                      Gracias a nuestro cliente, accedes a todos los cursos y
                      beneficios de nuestro catálogo.
                    </p>
                  </div>
                  <button
                    className="w-full sm:w-auto bg-brandm365-100 text-blue px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg hover:bg-brandazul-600 hover:text-white border-2 sm:border-4 flex items-center justify-center gap-2 text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105 group"
                    onClick={navigateToCourseDetails}
                  >
                    <span>Ver catálogo de cursos</span>
                    <svg
                      className="w-4 h-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </div>

                {/* Course Stats */}
                <div className="bg-transparent border border-gray-300 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <div className="flex items-center">
                    <img
                      src="https://res.cloudinary.com/dk2red18f/image/upload/v1720197367/WEB_EDUCA/ICONOS/lrnfzdnkubtj6f6nonhi.png"
                      className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3 flex-shrink-0"
                      alt="Students icon"
                    />
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-black">
                      10 Estudiantes
                    </p>
                  </div>
                  <div className="flex items-center">
                    <img
                      src="https://res.cloudinary.com/dk2red18f/image/upload/v1720197367/WEB_EDUCA/ICONOS/aztzll0keyleiitexmex.png"
                      className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3 flex-shrink-0"
                      alt="Duration icon"
                    />
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-black">
                      Duración: 1h
                    </p>
                  </div>
                  <div className="flex items-center">
                    <img
                      src="https://res.cloudinary.com/dk2red18f/image/upload/v1720197367/WEB_EDUCA/ICONOS/usna5kpyfkorticwhawp.png"
                      className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3 flex-shrink-0"
                      alt="Lessons icon"
                    />
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-black">
                      4 Lecciones
                    </p>
                  </div>
                  <div className="flex items-center">
                    <img
                      src="https://res.cloudinary.com/dk2red18f/image/upload/v1720197367/WEB_EDUCA/ICONOS/lvnniyn1pecmrvj98zi4.png"
                      className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3 flex-shrink-0"
                      alt="Level icon"
                    />
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-black">
                      Nivel Intermedio
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Course Materials Section */}
          {Array.isArray(coursesMaterials) && coursesMaterials.length > 0 ? (
            <div className="py-8 sm:py-12 md:py-16 lg:py-20 bg-brand-100 w-full">
              <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 bg-brand-100">
                <CourseMaterials materials={coursesMaterials} />
              </div>
            </div>
          ) : coursesMaterials && coursesMaterials.material ? (
            <div className="py-8 sm:py-12 md:py-16 lg:py-20 bg-brand-100 w-full">
              <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
                <CourseMaterials materials={[coursesMaterials]} />
              </div>
            </div>
          ) : null}

          {/* Course Curriculum Section */}
          <div className="w-full bg-gradient-to-r pb-12 sm:pb-16 lg:pb-20 px-2 sm:px-4 lg:px-8 xl:px-60">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 sm:mb-6 text-black pt-12 sm:pt-16 lg:pt-20">
              Temario
            </h1>
            {courseDetail.map((courseDetails) => (
              <div
                key={courseDetails.course_id}
                className="space-y-3 sm:space-y-4"
              >
                {courseDetails.courseModules.map((module) => (
                  <div
                    key={module.module_id}
                    className="bg-brandazul-600 p-3 sm:p-4 lg:p-6 border border-gray-300 rounded-lg text-white"
                  >
                    <div className="flex items-start mb-3 sm:mb-4">
                      {/*
                      <img
                        src="https://res.cloudinary.com/dk2red18f/image/upload/v1720197367/WEB_EDUCA/ICONOS/rp2dudec5uvmkpq2e9rw.png"
                        className="w-4 h-6 sm:w-5 sm:h-8 lg:w-6 lg:h-10 mr-2 sm:mr-3 flex-shrink-0"
                        alt="Module icon"
                      />*/}
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium">
                        Módulo: {module.name}
                      </p>
                    </div>
                    <div className="ml-6 sm:ml-8 space-y-2">
                      {module.moduleSessions.map((session) => (
                        <div
                          key={module.module_id}
                          className="flex items-start"
                        >
                          {/*
                          <img
                            src="https://res.cloudinary.com/dk2red18f/image/upload/v1720200323/WEB_EDUCA/ICONOS/pxuankjrczkaks3sei4m.png"
                            className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3 mt-1 flex-shrink-0"
                            alt="Session icon"
                          />*/}

                          <p className="text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed">
                            - Sesión: {session.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* Professor Section */}
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 sm:mb-6 text-black mt-8 sm:mt-12">
              Docente
            </h1>
            <div className="bg-brandazul-600 border-2 border-brandblanco-200 rounded-lg p-3 sm:p-4 lg:p-6">
              {courseDetail.map((courseDetails) => (
                <div key={courseDetails.course_id} className="w-full">
                  <div className="text-white">
                    <div className="flex items-start">
                      <img
                        src={courseDetails.courseProfessor.image}
                        className="rounded-full w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 mr-3 sm:mr-4 flex-shrink-0"
                        alt={courseDetails.courseProfessor.full_name}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-brandtext365-100 font-bold mb-1 sm:mb-2 break-words">
                          {courseDetails.courseProfessor.full_name}
                        </p>
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed">
                          {courseDetails.courseProfessor.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CourseDetails;
