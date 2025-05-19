import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useAuth } from '../../context/AuthContext';
import SidebarDrawer from '../../components/student/DrawerNavigation';
import Navbar from '../../components/Navbar';
import { Profile } from '../../interfaces/UserInterfaces';
import { useCourseStudent } from '../../hooks/useCourseStudents';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import { useCourseStudentCategory } from '../../hooks/useCourseStudents';
import { useCategoriesl } from '../../hooks/courses/useCategories';
import CourseCard from '../../components/student/CourseCard';
import { XCircleIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

import { useRouter } from 'next/router';
import './../../app/globals.css';
import ScreenSecurity from '../../components/ScreenSecurity';
import Footter from '../../components/Footter';
Modal.setAppElement('#__next');

const StudentIndex: React.FC = () => {
  const { logout, user, profileInfo } = useAuth();
  const { courseStudent, isLoading } = useCourseStudent();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>();
  const { categories } = useCategoriesl();
  console.log(courseStudent);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [filters, setFilters] = useState<any>({});
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  let name = '';
  let uri_picture = '';

  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    uri_picture = profile.profile_picture!;
  }

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    // You can add more logic here to filter courseStudent based on the filters
  };

  const openModal = (course: any) => {
    setSelectedCourse(course);
  };

  const closeModal = () => {
    setSelectedCourse(null);
  };

  useEffect(() => {
    const handleNotificationPermission = async () => {
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          notify();
        } else {
          Notification.requestPermission().then((res) => {
            if (res === 'granted') {
              notify();
            } else {
              console.error('Did not receive permission for notifications');
            }
          });
        }
      } else {
        console.error('Browser does not support notifications');
      }

      function notify() {
        const notification = new Notification('MentorMind', {
          body: `Bienvenido a MentorMind`,
          icon: 'https://res.cloudinary.com/dk2red18f/image/upload/v1724273141/WEB_EDUCA/gy7xwx0d7banshaqmitz.png',
        });

        notification.addEventListener('click', function () {
          window.open('https://www.openjavascript.com');
        });

        setTimeout(() => notification.close(), 5 * 1000);
        navigator.vibrate([300, 200, 300]);
      }
    };

    handleNotificationPermission();
  }, []);

  const navigateToCourseDetails = () => {
    router.push({
      pathname: '/student/course-details',
      query: { course_id: selectedCourse.course_id },
    });
    console.log('selectedCourse:', selectedCourse);
    console.log('selectedCourse.course_id:', selectedCourse?.course_id);
  };

  // Handle category selection

  const handleCategorySelect = (categoryId: number | undefined) => {
    console.log('Category selected:', categoryId); // Log for debugging
    setSelectedCategoryId(categoryId);
  };

  console.log('Selected Category ID:', selectedCategoryId);
  const {
    courseStudentCategory,
    error: categoryError,
    isLoading: categoryLoading,
  } = useCourseStudentCategory(selectedCategoryId!);

  const toggleSidebar = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <ProtectedRoute>
      <div>
        <ScreenSecurity />
        <div className="relative z-10 ">
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

        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r pt-10 pb-10 from-brand-100 via-brand-200 to-brand-300 p-4">
          <div className="w-full max-w-screen-lg mt-8 flex gap-4 overflow-x-auto scrollbar-hide overflow-auto">
            <button
              className="text-white whitespace-nowrap p-4 rounded-lg flex-shrink-0 cursor-pointer"
              onClick={() => handleCategorySelect(undefined)} // Mostrar todos los cursos cuando se hace clic en "TODOS"
            >
              Todos
            </button>

            {categories.map((category) => (
              <div
                key={category.category_id}
                className="flex items-center space-x-2"
              >
                {/* Mostrar el logo junto con el nombre de la categoría */}
                <img
                  src={category.logo}
                  alt={category.name}
                  className="h-6 w-6"
                />
                <button
                  className="text-white whitespace-nowrap pr-8 rounded-lg flex-shrink-0 cursor-pointer"
                  onClick={() => handleCategorySelect(category.category_id)} // Filtrar cursos por categoría
                >
                  {category.name}
                </button>
              </div>
            ))}
          </div>

          <div className="w-full max-w-screen-lg mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {selectedCategoryId
              ? courseStudentCategory?.map((courseStudent) => (
                  <CourseCard
                    key={courseStudent.Course?.course_id}
                    name={courseStudent.Course?.name}
                    description={courseStudent.Course?.description_short}
                    image={courseStudent.Course?.image}
                    profesor={courseStudent.Course?.courseProfessor?.full_name}
                    categoria={courseStudent.Course?.courseCategory?.name}
                    course_id={courseStudent.Course?.course_id}
                    onClick={() => openModal(courseStudent.Course)}
                  />
                ))
              : courseStudent?.map((courseStudent) => (
                  <CourseCard
                    key={courseStudent.Course?.course_id}
                    name={courseStudent.Course?.name}
                    description={courseStudent.Course?.description_short}
                    image={courseStudent.Course?.image}
                    profesor={courseStudent.Course?.courseProfessor?.full_name}
                    categoria={courseStudent.Course?.courseCategory?.name}
                    course_id={courseStudent.Course?.course_id}
                    onClick={() => openModal(courseStudent.Course)}
                  />
                ))}
          </div>
        </div>

        {selectedCourse && (
          <Modal
            key={selectedCourse.course_id}
            isOpen={!!selectedCourse}
            onRequestClose={closeModal}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <div className="relative bg-white rounded-lg overflow-hidden shadow-lg max-w-lg w-full">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-black"
              >
                <XCircleIcon className="h-8 w-8" />
              </button>
              <img
                className="w-full h-64 object-cover mb-4"
                src={selectedCourse.image}
                alt={selectedCourse.name}
              />
              <div className="px-6 py-4">
                <div className="bg-brandmorad-600 rounded font-bold text-md mb-2 text-white p-4">
                  {selectedCourse.courseCategory.name}
                </div>
                <div className="font-bold text-md mb-2 text-black">
                  {selectedCourse.name}
                </div>
                <p className="text-brandrosado-800 text-base mb-4">
                  Por: {selectedCourse.courseProfessor.full_name}
                </p>
                <p className="text-black text-sm mb-4">
                  {selectedCourse.description_short}
                </p>
                <div className="flex justify-end mt-4">
                  <button
                    className="bg-brandmora-500 text-white px-4 rounded hover:bg-brandmorado-700 border-2 border-brandborder-400 flex items-center"
                    onClick={navigateToCourseDetails}
                  >
                    Detalles del curso{' '}
                    <ChevronRightIcon className="h-5 w-5 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* Footer Section */}
        <div
          className="bg-no-repeat bg-cover bg-brand-100"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/dk2red18f/image/upload/v1724349813/WEB_EDUCA/icddbyrq4uovlhf6332o.png')",
            height: '500px',
          }}
        >
          <div className="container mx-auto grid grid-cols-4 gap-4 pt-60 pl-40 text-white">
            <div className="flex justify-center ">
              <img
                src="https://res.cloudinary.com/dk2red18f/image/upload/v1724350020/WEB_EDUCA/fcnjkq9hugpf6zo6pubs.png"
                alt="Logo"
                className="h-30"
              />
            </div>
            <div className="pl-40">
              <h3 className="font-semibold text-lg ">PÁGINAS</h3>
              <ul>
                <li>INICIO</li>
                <li>RECURSOS</li>
                <li>BENEFICIOS</li>
                <li>SUSCRÍBETE</li>
              </ul>
            </div>
            <div className="pl-20">
              <h3 className="font-semibold text-lg ">LINKS</h3>
              <ul>
                <li>TÉRMINOS Y CONDICIONES</li>
                <li>POLÍTICA DE PRIVACIDAD</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg">CONTÁCTANOS</h3>
              <ul>
                <li>+51 9912785156</li>
                <li>administrador.app@ceec.com.pe</li>
                <li>MAGDALENA DEL MAR - LIMA</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default StudentIndex;
