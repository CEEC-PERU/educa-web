import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Content/SideBar';
import MediaUploadPreview from '../../components/MediaUploadPreview';
import FormField from '../../components/FormField';
import ActionButtons from '../../components/Content/ActionButtons';
import { getCategories } from '../../services/categoryService';
import { getProfessors } from '../../services/professorService';
import { getAvailableEvaluations } from '../../services/evaluationService';
import { addCourse } from '../../services/courseService';
import { uploadVideo } from '../../services/videoService';
import { uploadImage } from '../../services/imageService';
import { Category } from '../../interfaces/Category';
import { Professor } from '../../interfaces/Professor';
import { Evaluation } from '../../interfaces/Evaluation';
import { Course } from '../../interfaces/Course';
import Loader from '../../components/Loader';
import './../../app/globals.css';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import AlertComponent from '../../components/AlertComponent';

interface FormData extends Omit<Course, 'course_id' | 'created_at' | 'updated_at'> {
  [key: string]: string | boolean | number;
}

const AddCourse: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [clearMediaPreview, setClearMediaPreview] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description_short: '',
    description_large: '',
    category_id: 0,
    professor_id: 0,
    evaluation_id: 0,
    intro_video: '',
    duration_video: '',
    image: '',
    duration_course: '',
    is_active: true,
  });
  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
  const [showAlert, setShowAlert] = useState(false);

  const router = useRouter();
  const imageUploadRef = useRef<{ clear: () => void }>(null);
  const videoUploadRef = useRef<{ clear: () => void }>(null);

  useEffect(() => {
    const fetchCategoriesProfessorsEvaluations = async () => {
      try {
        const [categoriesRes, professorsRes, evaluationsRes] = await Promise.all([
          getCategories(),
          getProfessors(),
          getAvailableEvaluations()
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

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id } = e.target;
    setTouchedFields(prevState => ({
      ...prevState,
      [id]: true,
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
    setFormLoading(true);

    const requiredFields = [
      'name',
      'description_short',
      'description_large',
      'category_id',
      'professor_id',
      'evaluation_id',
      'duration_video',
      'duration_course',
    ];

    const newTouchedFields: { [key: string]: boolean } = {};
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newTouchedFields[field] = true;
      }
    });

    const hasEmptyFields = requiredFields.some((field) => !formData[field]);

    if (hasEmptyFields) {
      setTouchedFields(prev => ({ ...prev, ...newTouchedFields }));
      setError('Por favor, complete todos los campos requeridos.');
      setShowAlert(true);
      setFormLoading(false);
      return;
    }

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
      setShowAlert(true);
      setError(null);
      setTimeout(() => {
        setShowAlert(false);
        setFormData({
          name: '',
          description_short: '',
          description_large: '',
          category_id: 0,
          professor_id: 0,
          evaluation_id: 0,
          intro_video: '',
          duration_video: '',
          image: '',
          duration_course: '',
          is_active: true,
        });
        setVideoFile(null);
        setImageFile(null);
        setClearMediaPreview(true);
        if (imageUploadRef.current) imageUploadRef.current.clear();
        if (videoUploadRef.current) videoUploadRef.current.clear();
        setTimeout(() => setClearMediaPreview(false), 500);
      }, 3000);
    } catch (error) {
      setError('Error creating course');
      console.error('Error creating course:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description_short: '',
      description_large: '',
      category_id: 0,
      professor_id: 0,
      evaluation_id: 0,
      intro_video: '',
      duration_video: '',
      image: '',
      duration_course: '',
      is_active: true,
    });
    setVideoFile(null);
    setImageFile(null);
    setClearMediaPreview(true);
    if (imageUploadRef.current) imageUploadRef.current.clear();
    if (videoUploadRef.current) videoUploadRef.current.clear();
    setTimeout(() => setClearMediaPreview(false), 500);
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
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`p-6 flex-grow ${showSidebar ? 'ml-20' : ''} transition-all duration-300 ease-in-out flex`}>
          <div className="max-w-6xl bg-white rounded-lg w-full">
            {showAlert && (
              <AlertComponent
                type="danger"
                message={error || "Curso creado exitosamente."}
                onClose={() => setShowAlert(false)}
              />
            )}
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center text-purple-600 mb-4"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Volver
            </button>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="space-y-4">
                <FormField
                  id="name"
                  label="Nombre del Curso"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!formData.name && touchedFields['name']}
                  touched={touchedFields['name']}
                  required
                />
                <FormField
                  id="description_short"
                  label="Descripción Corta"
                  type="textarea"
                  value={formData.description_short}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={4}
                  error={!formData.description_short && touchedFields['description_short']}
                  touched={touchedFields['description_short']}
                  required
                />
                <FormField
                  id="description_large"
                  label="Descripción Larga"
                  type="textarea"
                  value={formData.description_large}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={4}
                  error={!formData.description_large && touchedFields['description_large']}
                  touched={touchedFields['description_large']}
                  required
                />
                <FormField
                  id="category_id"
                  label="Categoría"
                  type="select"
                  value={formData.category_id.toString()}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={[{ value: '', label: 'Seleccionar Categoría' }, ...categories.map(category => ({ value: category.category_id.toString(), label: category.name }))]}
                  error={formData.category_id === 0 && touchedFields['category_id']}
                  touched={touchedFields['category_id']}
                  required
                />
                <div>
                  <label htmlFor="image" className="block text-sm font-medium mb-6 text-gray-700">
                    Imagen
                  </label>
                  <MediaUploadPreview ref={imageUploadRef} onMediaUpload={handleImageUpload} accept="image/*" label="Subir imagen" clearMediaPreview={clearMediaPreview} />
                </div>
              </div>
              <div className="space-y-4">
                <FormField
                  id="professor_id"
                  label="Profesor"
                  type="select"
                  value={formData.professor_id.toString()}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={[{ value: '', label: 'Seleccionar Profesor' }, ...professors.map(professor => ({ value: professor.professor_id.toString(), label: professor.full_name }))]}
                  error={formData.professor_id === 0 && touchedFields['professor_id']}
                  touched={touchedFields['professor_id']}
                  required
                />
                <FormField
                  id="evaluation_id"
                  label="Evaluación"
                  type="select"
                  value={formData.evaluation_id.toString()}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={[{ value: '', label: 'Seleccionar Evaluación' }, ...evaluations.map(evaluation => ({ value: evaluation.evaluation_id.toString(), label: evaluation.name }))]}
                  error={formData.evaluation_id === 0 && touchedFields['evaluation_id']}
                  touched={touchedFields['evaluation_id']}
                  required
                />
                <FormField
                  id="duration_video"
                  label="Duración del Video"
                  type="text"
                  value={formData.duration_video}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!formData.duration_video && touchedFields['duration_video']}
                  touched={touchedFields['duration_video']}
                  required
                />
                <div>
                  <label htmlFor="intro_video" className="block text-sm font-medium mb-6 text-gray-700">
                    Video de Introducción
                  </label>
                  <MediaUploadPreview ref={videoUploadRef} onMediaUpload={handleVideoUpload} accept="video/*" label="Subir video" clearMediaPreview={clearMediaPreview} />
                </div>
                <FormField
                  id="duration_course"
                  label="Duración del Curso"
                  type="text"
                  value={formData.duration_course}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!formData.duration_course && touchedFields['duration_course']}
                  touched={touchedFields['duration_course']}
                  required
                />
              </div>
            </form>
          </div>
          <div className="ml-4 flex-shrink-0 hidden md:block">
            <ActionButtons
              onSave={handleSubmit}
              onCancel={handleCancel}
              isEditing={true}
            />
          </div>
        </main>
      </div>
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg">
        <ActionButtons
          onSave={handleSubmit}
          onCancel={handleCancel}
          isEditing={true}
        />
      </div>
      {formLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default AddCourse;
