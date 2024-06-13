import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBar';
import Footer from '../../components/Footter';
import { getCategories } from '../../services/categoryService';
import { getProfessors } from '../../services/professorService';
import { addCourse } from '../../services/courseService';
import { uploadVideo } from '../../services/videoService';
import { Category } from '../../interfaces/Category';
import { Professor } from '../../interfaces/Professor';
import { Course } from '../../interfaces/Course';
import './../../app/globals.css';

const AddCourse: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<Omit<Course, 'course_id' | 'created_at' | 'updated_at'>>({
    name: '',
    description_short: '',
    description_large: '',
    category_id: 0,
    professor_id: 0,
    intro_video: '',
    duracion_video: '',
    image: '',
    duracion_curso: '',
    is_active: true,
  });

  const router = useRouter();

  useEffect(() => {
    const fetchCategoriesAndProfessors = async () => {
      try {
        const [categoriesRes, professorsRes] = await Promise.all([
          getCategories(),
          getProfessors()
        ]);
        setCategories(categoriesRes);
        setProfessors(professorsRes);
        setLoading(false);
      } catch (error) {
        setError('Error fetching categories or professors');
        setLoading(false);
      }
    };
    fetchCategoriesAndProfessors();
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    localStorage.setItem('sidebarState', JSON.stringify(!showSidebar));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prevState => ({
      ...prevState,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (videoFile) {
        const videoUrl = await uploadVideo(videoFile);
        await addCourse({
          ...formData,
          intro_video: videoUrl
        });
        router.push('/content');
      } else {
        setError('Video file is required');
      }
    } catch (error) {
      setError('Error creating course');
      console.error('Error creating course:', error);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-100">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" toggleSidebar={toggleSidebar} />
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <main className={`p-6 flex-grow ${showSidebar ? 'ml-64' : ''} transition-all duration-300 ease-in-out pt-16`}>
        <h1 className="text-4xl font-bold mb-6">Añadir Nuevo Curso</h1>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
          {error && <p className="text-red-500">{error}</p>}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nombre del Curso
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="description_short" className="block text-sm font-medium text-gray-700">
              Descripción Corta
            </label>
            <textarea
              id="description_short"
              value={formData.description_short}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="description_large" className="block text-sm font-medium text-gray-700">
              Descripción Larga
            </label>
            <textarea
              id="description_large"
              value={formData.description_large}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
              Categoría
            </label>
            <select
              id="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
            >
              <option value="">Seleccione una categoría</option>
              {categories.map(category => (
                <option key={category.category_id} value={category.category_id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="professor_id" className="block text-sm font-medium text-gray-700">
              Profesor
            </label>
            <select
              id="professor_id"
              value={formData.professor_id}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
            >
              <option value="">Seleccione un profesor</option>
              {professors.map(professor => (
                <option key={professor.professor_id} value={professor.professor_id}>
                  {professor.full_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="intro_video" className="block text-sm font-medium text-gray-700">
              Video de Introducción
            </label>
            <input
              type="file"
              id="intro_video"
              accept="video/*"
              onChange={handleFileChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="duracion_video" className="block text-sm font-medium text-gray-700">
              Duración del Video
            </label>
            <input
              type="text"
              id="duracion_video"
              value={formData.duracion_video}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              URL de la Imagen
            </label>
            <input
              type="text"
              id="image"
              value={formData.image}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="duracion_curso" className="block text-sm font-medium text-gray-700">
              Duración del Curso
            </label>
            <input
              type="text"
              id="duracion_curso"
              value={formData.duracion_curso}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
              Activo
            </label>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded">Guardar</button>
        </form>
      </main>
      <Footer footerText="2024 EducaWeb. Todos los derechos reservados." />
    </div>
  );
};

export default AddCourse;
