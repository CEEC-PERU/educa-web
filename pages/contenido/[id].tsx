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
  category_id?: number;
  professor_id?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  is_finish: boolean;
  limit_date?: string;
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

  const handleEdit = () => {
    if (course) {
      router.push(`/contenido/editCurso?id=${course.course_id}`);
    }
  };

  const handleDelete = () => {
    if (course) {
      axios.delete(`/courses/${course.course_id}`)
        .then(() => {
          console.log('Curso eliminado');
          router.push('/contenido');
        })
        .catch(error => {
          console.error('Error eliminando el curso:', error);
        });
    }
  };

  if (!course) {
    return <p>Loading...</p>;
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-100">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" toggleSidebar={toggleSidebar} />
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <main className={`p-6 flex-grow ${showSidebar ? 'ml-64' : ''} transition-all duration-300 ease-in-out pt-16`}>
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold mb-4">{course.name}</h1>
          {course.image && (
            <div className="mb-4">
              <img src={course.image} alt={course.name} className="w-full rounded-lg" />
            </div>
          )}
          <p className="mb-4 text-lg"><strong>Descripción corta:</strong> {course.description_short}</p>
          <p className="mb-4 text-lg"><strong>Descripción larga:</strong> {course.description_large}</p>
          <p className="mb-4 text-lg"><strong>Duración:</strong> {course.duracion_curso}</p>
          {course.intro_video && (
            <div className="mb-4">
              <strong>Video de introducción:</strong>
              <div className="mt-2">
                <video src={course.intro_video} controls className="w-full rounded-lg" />
              </div>
            </div>
          )}
          <p className="mb-4 text-lg"><strong>Activo:</strong> {course.is_active ? 'Sí' : 'No'}</p>
          <p className="mb-4 text-lg"><strong>Finalizado:</strong> {course.is_finish ? 'Sí' : 'No'}</p>
          {course.limit_date && (
            <p className="mb-4 text-lg"><strong>Fecha límite:</strong> {new Date(course.limit_date).toLocaleDateString()}</p>
          )}
          <p className="mb-4 text-lg"><strong>Creado el:</strong> {new Date(course.created_at).toLocaleDateString()}</p>
          <p className="mb-4 text-lg"><strong>Actualizado el:</strong> {new Date(course.updated_at).toLocaleDateString()}</p>
          <div className="flex justify-end space-x-4 mt-6">
            <button onClick={handleEdit} className="bg-blue-500 text-white py-2 px-4 rounded-lg">Editar</button>
            <button onClick={handleDelete} className="bg-red-500 text-white py-2 px-4 rounded-lg">Eliminar</button>
          </div>
        </div>
      </main>
      <Footter footerText="2024 EducaWeb. Todos los derechos reservados." />
    </div>
  );
};

export default CourseDetail;
