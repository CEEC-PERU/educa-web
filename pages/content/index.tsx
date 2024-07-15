import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Content/SideBar';
import CardImage from '../../components/Content/CardImage';
import ButtonComponent from '../../components/ButtonDelete';
import { getCourses } from '../../services/courseService';
import { Course } from '../../interfaces/Course';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import './../../app/globals.css';
import { useRouter } from 'next/router';
import Loader from '../../components/Loader'; // Importar el componente Loader

const Home: React.FC = () => {
  const { logout } = useAuth();
  const [showSidebar, setShowSidebar] = useState(true);
  const [cursos, setCursos] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true); // Estado de carga
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

  const fetchData = async () => {
    try {
      const data = await getCourses();
      setCursos(data);
      setLoading(false); // Finaliza la carga
    } catch (error) {
      setError('Error fetching courses');
      console.error('Error fetching courses:', error);
      setLoading(false); // Finaliza la carga en caso de error
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleButtonClick = (id?: number) => {
    if (id) {
      router.push(`/content/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90"/>
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`p-6 flex-grow transition-all duration-300 ease-in-out ${showSidebar ? 'ml-20' : ''}`}>
          <div className="flex justify-between items-center mb-4">
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
          {error && <p className="text-red-500">{error}</p>}
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
                onButtonClick={handleButtonClick} // Añadir el manejador de clic
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
