import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../../context/AuthContext';
import SidebarDrawer from '../../../../../components/student/DrawerNavigation';
import Navbar from '../../../../../components/Navbar';
import { Profile } from '../../../../../interfaces/User/UserInterfaces';
import { useCourseStudent } from '../../../../../hooks/useCourseStudents';
import CourseCard from '../../../../../components/student/CourseCard';
import FlashcardGame from '../../../../../components/student/FlashcardGame';
import ProtectedRoute from '../../../../../components/Auth/ProtectedRoute';
import { useRouter } from 'next/router';
import './../../../../../app/globals.css';

const Flashcard: React.FC = () => {
  const { logout, user, profileInfo } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const { courseStudent, isLoading } = useCourseStudent();
  const router = useRouter();
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

  const navigateToCourseDetails = () => {
    router.push({
      pathname: '/student/course-details',
      query: { course_id: selectedCourse.course_id },
    });
    console.log('selectedCourse:', selectedCourse);
    console.log('selectedCourse.course_id:', selectedCourse?.course_id);
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

        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r  pb-40 from-brand-100 via-brand-200 to-brand-300 p-4">
          <div className="container mx-auto">
            <FlashcardGame />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Flashcard;
