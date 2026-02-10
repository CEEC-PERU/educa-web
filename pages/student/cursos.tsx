import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useAuth } from '../../context/AuthContext';
import SidebarDrawer from '../../components/student/DrawerNavigation';
import Navbar from '../../components/Navbar';
import { Profile } from '../../interfaces/User/UserInterfaces';
import { useCourseStudent } from '../../hooks/useCourseStudents';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import { useCourseStudentCategory } from '../../hooks/useCourseStudents';
import { useCategoriesl } from '../../hooks/courses/useCategories';
import CourseCard from '../../components/student/CourseCard';
import { XCircleIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

import { useRouter } from 'next/router';
import './../../app/globals.css';
import ScreenSecurity from '../../components/ScreenSecurity';
import Footer from '@/components/student/Footer';
Modal.setAppElement('#__next');

const StudentIndex: React.FC = () => {
  const { logout, user, profileInfo } = useAuth();
  const { courseStudent, isLoading } = useCourseStudent();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>();
  const { categories } = useCategoriesl();
  const [showAllCategories, setShowAllCategories] = useState(false);
  const ALLOWED_CATEGORIES = [66, 67, 68, 87, 88, 89, 90, 91];
  const filteredCategories = categories.filter((category) =>
    ALLOWED_CATEGORIES.includes(category.category_id),
  );

  const categoriesToShow = showAllCategories
    ? filteredCategories
    : filteredCategories.slice(0, 5);
  const hasMoreCategories = filteredCategories.length > 5;

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

        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-10 pb-10 p-4">
          <div className="w-full max-w-screen-lg mt-8">
            <div className="flex flex-wrap gap-2 mb-6">
              {/* Todos */}
              <button
                className={`bg-gray-950/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 flex items-center space-x-1.5 hover:bg-gray-800/30 transition-all duration-300 text-sm ${
                  !selectedCategoryId ? 'bg-white/40 ring-2 ring-white' : ''
                }`}
                onClick={() => handleCategorySelect(undefined)}
              >
                <span className="text-white font-medium">Todos</span>
              </button>

              {/* Categorías */}
              {categoriesToShow.map((category) => (
                <button
                  key={category.category_id}
                  className={`bg-gray-500/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 flex items-center space-x-1.5 hover:bg-gray-800/30 transition-all duration-300 text-sm ${
                    selectedCategoryId === category.category_id
                      ? 'bg-white/40 ring-2 ring-white'
                      : ''
                  }`}
                  onClick={() => handleCategorySelect(category.category_id)}
                >
                  <img
                    src={category.logo}
                    alt={category.name}
                    className="w-4 h-4 object-contain"
                  />
                  <span className="text-white font-medium">
                    {category.name}
                  </span>
                </button>
              ))}
              {hasMoreCategories && (
                <button
                  className="bg-gray-500/30 backdrop-blur-sm border border-white/40 rounded-full px-4 py-2 hover:bg-gray-800/40 transition-all duration-300 text-sm"
                  onClick={() => setShowAllCategories(!showAllCategories)}
                >
                  <span className="text-white font-medium">
                    {showAllCategories
                      ? 'Ver menos ↑'
                      : `+${filteredCategories.length - 5} más ↓`}
                  </span>
                </button>
              )}
            </div>
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
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default StudentIndex;
