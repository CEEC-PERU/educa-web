// src/pages/home.tsx
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBar';
import Footer from '../../components/Footter';
import CardImage from '../../components/CardImage';
import ButtonComponent from '../../components/ButtonComponent';
import axios from '../../services/axios';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import './../../app/globals.css';
import ProtectedRoute from '../../components/Auth/ProtectedRoute'; //agregado para proteger ruta

interface Course {
  course_id: number;
  image: string;
  name: string;
  description_short: string;
  duracion_curso: string;
}

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
        const response = await axios.get('/courses');
        setCursos(response.data);
      } catch (error) {
        setError('Error fetching courses');
        console.error('Error fetching courses:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen flex flex-col bg-gray-100 pt-16">
        <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" toggleSidebar={toggleSidebar} />
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`p-6 flex-grow ${showSidebar ? 'ml-64' : ''} transition-all duration-300 ease-in-out`}>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold">Bienvenido a EducaWeb</h1>
          </div>
          <p className="mt-4">Selecciona una opción en el menú para continuar.</p>
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex justify-between items-center mb-4 mt-4">
            <Link href="/contenido/agregarCurso">
              <ButtonComponent 
                buttonLabel="Añadir Curso" 
                backgroundColor="bg-gradient-to-r from-blue-500 to-blue-400" 
                textColor="text-yellow-200" 
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
                duracion_curso={curso.duracion_curso}
                rating={4.9} 
                buttonLabel="Ver detalles"
                textColor="text-blue-gray-900"
              />
            ))}
          </div>
          <button 
            onClick={logout} 
            className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Cerrar Sesión
          </button>
        </main>
        <Footer footerText="2024 EducaWeb. Todos los derechos reservados." />
      </div>
    </ProtectedRoute>
  );
};

export default Home;
