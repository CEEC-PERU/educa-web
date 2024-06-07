import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from '../../services/axios';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBar';
import Footter from '../../components/Footter';
import './../../app/globals.css';

interface Course {
  course_id: number;
  name: string;
  description_short: string;
  description_large: string;
  duracion_curso: string;
  intro_video?: string;
  image?: string;
}

const CourseDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [course, setCourse] = useState<Course | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    if (id) {
      axios.get(`/courses/${id}`)
        .then(response => {
          setCourse(response.data);
        })
        .catch(error => {
          console.error('Error fetching course details:', error);
        });
    }
  }, [id]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    localStorage.setItem('sidebarState', JSON.stringify(!showSidebar));
  };


  if (!course) {
    return <p>Loading...</p>;
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-100">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" toggleSidebar={toggleSidebar} />
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <main className={`p-6 flex-grow ${showSidebar ? 'ml-64' : ''} transition-all duration-300 ease-in-out pt-16`}>
        <h1 className="text-4xl font-bold">{course.name}</h1>
        <p className="mt-4">{course.description_large}</p>
        {/* Agrega más detalles según sea necesario */}
      </main>
      <Footter footerText="2024 EducaWeb. Todos los derechos reservados." />
    </div>
  );
};

export default CourseDetail;
