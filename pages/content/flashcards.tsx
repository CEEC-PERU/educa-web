import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Content/SideBar';
import { useRouter } from 'next/router';
//import ButtonComponent from '@/components/ButtonComponent';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import { Course } from '@/interfaces/Courses/Course';
import { getCourses } from '@/services/courses/courseService';
import CardCourses from '@/components/Content/CardCourses';
import './../../app/globals.css';

const Flashcards: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [cursos, setCursos] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const savedState = localStorage.getItem('sidebarState');
    if (savedState !== null) {
      setShowSidebar(JSON.parse(savedState));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCourses();
        setCursos(data);
      } catch (error) {
        setError('Error fetching courses');
        console.error('Error fetching courses:', error);
      }
    };

    fetchData();
  }, []);

  const handleViewModulesClick = (courseId?: number) => {
    if (courseId) {
      router.push(`/content/detailFlashcard?id=${courseId}`);
    }
  };
  return (
    <ProtectedRoute>
      <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
        <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
        <div className="flex flex-1 pt-16">
          <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
          <main
            className={`p-6 flex-grow ${showSidebar ? 'ml-20' : ''} transition-all duration-300 ease-in-out`}
          >
            <div className="flex justify-between items-center mb-4"></div>
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* lista de módulos */}
              {cursos.map((curso) => (
                <CardCourses
                  key={curso.course_id}
                  id={curso.course_id}
                  image={curso.image}
                  name={curso.name}
                  description_short={curso.description_short}
                  duration_course={curso.duration_course}
                  rating={4.9}
                  buttonLabel="Ver Módulos"
                  textColor="text-blue-gray-900"
                  onButtonClick={() => handleViewModulesClick(curso.course_id)}
                />
              ))}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Flashcards;
