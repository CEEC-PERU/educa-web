import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getCourse, deleteCourse } from '../../services/courseService';
import { Course } from '../../interfaces/Course';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBar';
import Footter from '../../components/Footter';
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
