import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from '../../services/axios';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBar';
import ButtonComponent from '../../components/ButtonComponent';
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

interface Category {
  category_id: number;
  name: string;
}

interface Professor {
  professor_id: number;
  full_name: string;
}

const EditCurso: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [course, setCourse] = useState<Course | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const courseResponse = await axios.get(`/courses/${id}`);
          setCourse(courseResponse.data);
        }
        const categoriesResponse = await axios.get('/categories');
        setCategories(categoriesResponse.data);

        const professorsResponse = await axios.get('/professors');
        setProfessors(professorsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      }
    };

    fetchData();
  }, [id]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    localStorage.setItem('sidebarState', JSON.stringify(!showSidebar));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setCourse(prevCourse => prevCourse ? { ...prevCourse, [name]: checked } : null);
    } else {
      setCourse(prevCourse => prevCourse ? { ...prevCourse, [name]: value } : null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (course) {
      try {
        await axios.put(`/courses/${id}`, course);
        router.push(`/contenido/${id}`);
      } catch (error) {
        console.error('Error updating course:', error);
        setError('Error updating course');
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
          <h1 className="text-4xl font-bold mb-4">Editar Curso</h1>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Nombre del curso</label>
              <input
                type="text"
                id="name"
                name="name"
                value={course.name}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description_short">Descripción corta</label>
              <textarea
                id="description_short"
                name="description_short"
                value={course.description_short}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description_large">Descripción larga</label>
              <textarea
                id="description_large"
                name="description_large"
                value={course.description_large}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duracion_curso">Duración del curso</label>
              <input
                type="text"
                id="duracion_curso"
                name="duracion_curso"
                value={course.duracion_curso}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="intro_video">Video de introducción</label>
              <input
                type="text"
                id="intro_video"
                name="intro_video"
                value={course.intro_video}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">Imagen</label>
              <input
                type="text"
                id="image"
                name="image"
                value={course.image}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category_id">Categoría</label>
              <select
                id="category_id"
                name="category_id"
                value={course.category_id || ''}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Seleccionar Categoría</option>
                {categories.map(category => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="professor_id">Profesor</label>
              <select
                id="professor_id"
                name="professor_id"
                value={course.professor_id || ''}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Seleccionar Profesor</option>
                {professors.map(professor => (
                  <option key={professor.professor_id} value={professor.professor_id}>
                    {professor.full_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="is_active">Activo</label>
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={course.is_active}
                onChange={handleChange}
                className="mr-2 leading-tight"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="is_finish">Finalizado</label>
              <input
                type="checkbox"
                id="is_finish"
                name="is_finish"
                checked={course.is_finish}
                onChange={handleChange}
                className="mr-2 leading-tight"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="limit_date">Fecha límite</label>
              <input
                type="date"
                id="limit_date"
                name="limit_date"
                value={course.limit_date ? course.limit_date.split('T')[0] : ''}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded">Guardar</button>
          </form>
        </div>
      </main>
      <Footter footerText="2024 EducaWeb. Todos los derechos reservados." />
    </div>
  );
};

export default EditCurso;
