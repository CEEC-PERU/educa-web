import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Content/SideBar';
import CardCourses from '../../components/Content/CardCourses';
import { getCourses } from '../../services/courseService';
import { Course } from '../../interfaces/Course';
import { useAuth } from '../../context/AuthContext';
import './../../app/globals.css';
import { useRouter } from 'next/router';

const ModulePage: React.FC = () => {
  const { logout } = useAuth();
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

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    localStorage.setItem('sidebarState', JSON.stringify(!showSidebar));
  };

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
      router.push(`/content/detailModule?id=${courseId}`);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90"/>
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`p-6 flex-grow transition-all duration-300 ease-in-out ${showSidebar ? 'ml-20' : ''}`}>
          {error && <p className="text-red-500">{error}</p>}
          <div className="w-full bg-white rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModulePage;
