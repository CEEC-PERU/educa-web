import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBar';
import MediaUploadPreview from '../../components/MediaUploadPreview';
import FormField from '../../components/FormField';
import ActionButtons from '../../components/ActionButtons';
import { getCategories } from '../../services/categoryService';
import { getProfessors } from '../../services/professorService';
import { addCourse } from '../../services/courseService';
import { uploadVideo } from '../../services/videoService';
import { uploadImage } from '../../services/imageService';
import { Category } from '../../interfaces/Category';
import { Professor } from '../../interfaces/Professor';
import { Course } from '../../interfaces/Course';
import './../../app/globals.css';
import ButtonComponent from '../../components/ButtonDelete'; // Importa el componente ButtonComponent
import { ArrowLeftIcon } from '@heroicons/react/24/outline'; // Importa el ícono de flecha

const AddCourse: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<Omit<Course, 'course_id' | 'created_at' | 'updated_at'>>({
    name: '',
    description_short: '',
    description_large: '',
    category_id: 0,
    professor_id: 0,
    intro_video: '',
    duration_video: '',
    image: '',
    duration_course: '',
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

  const handleVideoUpload = (file: File) => {
    setVideoFile(file);
  };

  const handleImageUpload = (file: File) => {
    setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let videoUrl = '';
      let imageUrl = '';

      if (videoFile) {
        videoUrl = await uploadVideo(videoFile, 'Cursos/Videos');
      }

      if (imageFile) {
        imageUrl = await uploadImage(imageFile, 'Cursos/Images');
      }

      await addCourse({
        ...formData,
        intro_video: videoUrl,
        image: imageUrl
      });
      router.push('/content');
    } catch (error) {
      setError('Error creating course');
      console.error('Error creating course:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description_short: '',
      description_large: '',
      category_id: 0,
      professor_id: 0,
      intro_video: '',
      duration_video: '',
      image: '',
      duration_course: '',
      is_active: true,
    });
    setVideoFile(null);
    setImageFile(null);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" toggleSidebar={toggleSidebar} />
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <main className={`p-10 flex-grow ${showSidebar ? 'ml-64' : ''} transition-all duration-300 ease-in-out pt-16 flex`}>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl p-6 rounded-lg flex-grow mr-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center text-purple-600 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Volver
          </button>
          {error && <p className="text-red-500">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField id="name" label="Nombre del Curso" type="text" value={formData.name} onChange={handleChange} />
            <FormField
              id="category_id"
              label="Categoría"
              type="select"
              value={formData.category_id.toString()}
              onChange={handleChange}
              options={categories.map(category => ({ value: category.category_id.toString(), label: category.name }))}
            />
            <FormField
              id="professor_id"
              label="Profesor"
              type="select"
              value={formData.professor_id.toString()}
              onChange={handleChange}
              options={professors.map(professor => ({ value: professor.professor_id.toString(), label: professor.full_name }))}
            />
            <FormField id="duration_course" label="Duración del Curso" type="text" value={formData.duration_course} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-1">
            <FormField id="description_short" label="Descripción Corta" type="textarea" value={formData.description_short} onChange={handleChange} rows={4} />
            <FormField id="description_large" label="Descripción Larga" type="textarea" value={formData.description_large} onChange={handleChange} rows={4} />
          </div>
          <div>
            <label htmlFor="intro_video" className="block text-sm font-medium mb-6 text-gray-700">
              Video de Introducción
            </label>
            <MediaUploadPreview onMediaUpload={handleVideoUpload} accept="video/*" label="Subir video" />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium mb-6 text-gray-700">
              Imagen
            </label>
            <MediaUploadPreview onMediaUpload={handleImageUpload} accept="image/*" label="Subir imagen" />
          </div>
          <FormField id="duration_video" label="Duración del Video" type="text" value={formData.duration_video} onChange={handleChange} />
          <div className="flex items-center mt-6">
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
          <div className="flex justify-end space-x-2 mt-4">
            <ButtonComponent buttonLabel="Guardar" onClick={handleSubmit} backgroundColor="bg-blue-600" textColor="text-white" fontSize="text-sm" buttonSize="py-2 px-4" />
          </div>
        </form>
        <div className="ml-4 mt-6">
          <ActionButtons
            onSave={handleSubmit}
            onCancel={handleCancel}
            isEditing={true} // Para asegurarse de que el botón "Guardar" aparezca
          />
        </div>
      </main>
    </div>
  );
};

export default AddCourse;
