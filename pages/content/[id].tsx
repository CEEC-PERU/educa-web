// pages/content/courseDetail.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getCourse, deleteCourse } from '../../services/courseService';
import { Course } from '../../interfaces/Course';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBar';
import DetailView from '../../components/DetailView';
import ActionButtons from '../../components/ActionButtons';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import './../../app/globals.css';

const CourseDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [course, setCourse] = useState<Course | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchCourse = async () => {
        try {
          const courseData = await getCourse(id);
          setCourse(courseData);
        } catch (error) {
          console.error('Error fetching course details:', error);
        }
      };

      fetchCourse();
    }
  }, [id]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    localStorage.setItem('sidebarState', JSON.stringify(!showSidebar));
  };

  const handleEdit = () => {
    if (course) {
      router.push(`/content/editCourse?id=${course.course_id}`);
    }
  };

  const handleDelete = async () => {
    if (course) {
      try {
        await deleteCourse(course.course_id.toString());
        router.push('/content');
      } catch (error) {
        console.error('Error eliminando el curso:', error);
      }
    }
  };

  if (!course) {
    return <p>Loading...</p>;
  }

  const courseDetails = [
    { value: course.description_short },
    { value: course.description_large },
    { label: 'Duración del curso:', value: course.duration_course },
    { label: 'Activo:', value: course.is_active ? 'Sí' : 'No' },
  ];

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90"/>
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`p-6 flex-grow ${showSidebar ? 'ml-64' : ''} transition-all duration-300 ease-in-out`}>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center text-purple-600 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Volver
          </button>
          <div className="flex p-10">
            <DetailView
              title={course.name}
              imageUrl={course.image}
              details={courseDetails}
              videoUrl={course.intro_video}
            />
            <div className="ml-8 bg-white rounded-md">
              <ActionButtons
                onEdit={handleEdit}
                onCancel={() => router.push('/content')}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseDetail;
