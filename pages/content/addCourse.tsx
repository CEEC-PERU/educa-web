import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBar';
import MediaUploadPreview from '../../components/MediaUploadPreview';
import FormField from '../../components/FormField';
import ActionButtons from '../../components/ActionButtons';
import { getCategories } from '../../services/categoryService';
import { getProfessors } from '../../services/professorService';
import { getAvailableEvaluations } from '../../services/evaluationService'; // Importa el servicio adecuado
import { addCourse } from '../../services/courseService';
import { uploadVideo } from '../../services/videoService';
import { uploadImage } from '../../services/imageService';
import { Category } from '../../interfaces/Category';
import { Professor } from '../../interfaces/Professor';
import { Evaluation } from '../../interfaces/Evaluation';
import { Course } from '../../interfaces/Course';
import './../../app/globals.css';
import ButtonComponent from '../../components/ButtonDelete'; // Importa el componente ButtonComponent
import { ArrowLeftIcon } from '@heroicons/react/24/outline'; // Importa el ícono de flecha

const AddCourse: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]); // Estado para evaluaciones
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
    evaluation_id: 0, // Agrega evaluation_id al estado inicial
    intro_video: '',
    duration_video: '',
    image: '',
    duration_course: '',
    is_active: true,
  });

  const router = useRouter();

  useEffect(() => {
    const fetchCategoriesProfessorsEvaluations = async () => {
      try {
        const [categoriesRes, professorsRes, evaluationsRes] = await Promise.all([
          getCategories(),
          getProfessors(),
          getAvailableEvaluations() // Obtén las evaluaciones disponibles
        ]);
        setCategories(categoriesRes);
        setProfessors(professorsRes);
        setEvaluations(evaluationsRes);
        setLoading(false);
      } catch (error) {
        setError('Error fetching categories, professors, or evaluations');
        setLoading(false);
      }
    };
    fetchCategoriesProfessorsEvaluations();
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
      evaluation_id: 0, // Restablecer evaluation_id en el estado inicial
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
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`p-6 flex-grow ${showSidebar ? 'ml-64' : ''} transition-all duration-300 ease-in-out flex`}>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl rounded-lg flex-grow mr-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center text-purple-600 mb-6"
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
                options={[{ value: '', label: 'Seleccionar Categoría' }, ...categories.map(category => ({ value: category.category_id.toString(), label: category.name }))]}
              />
              <FormField
                id="professor_id"
                label="Profesor"
                type="select"
                value={formData.professor_id.toString()}
                onChange={handleChange}
                options={[{ value: '', label: 'Seleccionar Profesor' }, ...professors.map(professor => ({ value: professor.professor_id.toString(), label: professor.full_name }))]}
              />
              <FormField
                id="evaluation_id"
                label="Evaluación"
                type="select"
                value={formData.evaluation_id.toString()}
                onChange={handleChange}
                options={[{ value: '', label: 'Seleccionar Evaluación' }, ...evaluations.map(evaluation => ({ value: evaluation.evaluation_id.toString(), label: evaluation.name }))]}
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
          </form>
          <div className="ml-4">
            <ActionButtons
              onSave={handleSubmit}
              onCancel={handleCancel}
              isEditing={true} // Para asegurarse de que el botón "Guardar" aparezca
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddCourse;

