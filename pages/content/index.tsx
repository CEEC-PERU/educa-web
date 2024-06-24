import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBar';
import CardImage from '../../components/CardImage';
import ButtonComponent from '../../components/ButtonDelete';
import { getCourses } from '../../services/courseService';
import { Course } from '../../interfaces/Course';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import './../../app/globals.css';

const Home: React.FC = () => {
  const { logout } = useAuth();
  const [showSidebar, setShowSidebar] = useState(true);
  const [cursos, setCursos] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);

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


  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`p-6 flex-grow ${showSidebar ? 'ml-64' : ''} transition-all duration-300 ease-in-out`}>
          <div className="flex justify-between items-center mb-4">
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex justify-between items-center mb-4 mt-4">
            <Link href="/content/addCourse">
                <ButtonComponent
                  buttonLabel="Añadir Curso"
                  backgroundColor="bg-gradient-to-r from-blue-500 to-blue-400"
                  textColor="text-white"
                  fontSize="text-xs"
                  buttonSize="py-2 px-7"
                />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {cursos.map((curso) => (
              <CardImage
                key={curso.course_id}
                id={curso.course_id}
                image={curso.image}
                name={curso.name}
                description_short={curso.description_short}
                duration_course={curso.duration_course}
                rating={4.9}
                buttonLabel="Ver detalles"
                textColor="text-blue-gray-900"
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
