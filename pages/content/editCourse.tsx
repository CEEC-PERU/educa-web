import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Content/SideBar';
import { getCategories } from '../../services/categoryService';
import { getProfessors } from '../../services/professorService';
import { getCourse, updateCourse } from '../../services/courses/courseService';
import { uploadVideo } from '../../services/videoService';
import { uploadImage } from '../../services/imageService';
import { getAvailableEvaluations } from '../../services/evaluationService';
import { Category } from '../../interfaces/Category';
import { Professor } from '../../interfaces/Professor';
import { Evaluation } from '../../interfaces/Evaluation';
import { Course } from '../../interfaces/Courses/Course';
import MediaUploadPreview from '../../components/MediaUploadPreview';
import FormField from '../../components/FormField';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import ActionButtons from '../../components/Content/ActionButtons';
import './../../app/globals.css';
import AlertComponent from '../../components/AlertComponent';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import Loader from '../../components/Loader';

const EditCourse: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<
    Omit<Course, 'course_id' | 'created_at' | 'updated_at'>
  >({
    name: '',
    description_short: '',
    description_large: '',
    category_id: 0,
    professor_id: 0,
    intro_video: '',
    duration_video: '',
    image: '',
    duration_course: '',
    evaluation_id: 0,
    is_active: true,
  });

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, professorsRes, availableEvaluations, courseRes] =
          await Promise.all([
            getCategories(),
            getProfessors(),
            getAvailableEvaluations(),
            getCourse(id as string),
          ]);
        setCategories(categoriesRes);
        setProfessors(professorsRes);

        const currentEvaluation = availableEvaluations.find(
          (evaluation) => evaluation.evaluation_id === courseRes.evaluation_id
        );
        const updatedEvaluations = currentEvaluation
          ? [
              currentEvaluation,
              ...availableEvaluations.filter(
                (evaluation) =>
                  evaluation.evaluation_id !== courseRes.evaluation_id
              ),
            ]
          : availableEvaluations;

        setEvaluations(updatedEvaluations);

        setFormData({
          name: courseRes.name,
          description_short: courseRes.description_short,
          description_large: courseRes.description_large,
          category_id: courseRes.category_id,
          professor_id: courseRes.professor_id,
          intro_video: courseRes.intro_video,
          duration_video: courseRes.duration_video,
          image: courseRes.image,
          duration_course: courseRes.duration_course,
          evaluation_id: courseRes.evaluation_id,
          is_active: courseRes.is_active,
        });
        setLoading(false);
      } catch (error) {
        setError('Error fetching data');
        setLoading(false);
      }
    };
    if (id) {
      fetchData();
    }
  }, [id]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    localStorage.setItem('sidebarState', JSON.stringify(!showSidebar));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prevState) => ({
      ...prevState,
      [id]: type === 'checkbox' ? checked : value,
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
    try {
      let videoUrl = formData.intro_video;
      let imageUrl = formData.image;

      if (videoFile) {
        videoUrl = await uploadVideo(videoFile, 'Cursos/Videos');
      }

      if (imageFile) {
        imageUrl = await uploadImage(imageFile, 'Cursos/Images');
      }

      await updateCourse(id as string, {
        ...formData,
        intro_video: videoUrl,
        image: imageUrl,
      });
      setSuccess('Curso actualizado exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Error updating course');
      console.error('Error updating course:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      // Lógica para eliminar el curso
      // await deleteCourse(id as string);
      router.push('/content');
    } catch (error) {
      setError('Error deleting course');
      console.error('Error deleting course:', error);
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
    <ProtectedRoute>
      <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
        <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
        <div className="flex flex-1 pt-16">
          <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
          <main
            className={`p-6 flex-grow ${
              showSidebar ? 'ml-20' : ''
            } transition-all duration-300 ease-in-out flex flex-col md:flex-row md:space-x-4`}
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-4 max-w-2xl rounded-lg flex-grow"
            >
              {success && (
                <AlertComponent
                  type="info"
                  message="Curso actualizado correctamente."
                  onClose={() => setSuccess(null)}
                />
              )}
              {error && <p className="text-red-500">{error}</p>}

              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center text-purple-600 mb-6"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Volver
              </button>
              <FormField
                id="name"
                label="Nombre del Curso"
                type="text"
                value={formData.name}
                onChange={handleChange}
              />
              <FormField
                id="description_short"
                label="Descripción Corta"
                type="textarea"
                value={formData.description_short}
                onChange={handleChange}
              />
              <FormField
                id="description_large"
                label="Descripción Larga"
                type="textarea"
                value={formData.description_large}
                onChange={handleChange}
              />
              <FormField
                id="category_id"
                label="Categoría"
                type="select"
                value={formData.category_id.toString()}
                onChange={handleChange}
                options={categories.map((category) => ({
                  value: category.category_id.toString(),
                  label: category.name,
                }))}
              />
              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium mb-4 text-blue-400"
                >
                  Imagen del Curso
                </label>
                <MediaUploadPreview
                  onMediaUpload={handleImageUpload}
                  accept="image/*"
                  label="Subir Imagen"
                  initialPreview={formData.image}
                />
              </div>
            </form>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 max-w-2xl rounded-lg flex-grow"
            >
              <FormField
                id="professor_id"
                label="Profesor"
                type="select"
                value={formData.professor_id.toString()}
                onChange={handleChange}
                options={[
                  { value: '', label: 'Seleccionar Profesor' },
                  ...professors.map((professor) => ({
                    value: professor.professor_id.toString(),
                    label: professor.full_name,
                  })),
                ]}
              />
              <FormField
                id="evaluation_id"
                label="Evaluación"
                type="select"
                value={formData.evaluation_id.toString()}
                onChange={handleChange}
                options={[
                  { value: '', label: 'Seleccionar Evaluación' },
                  ...evaluations.map((evaluation) => ({
                    value: evaluation.evaluation_id.toString(),
                    label: evaluation.name,
                  })),
                ]}
              />
              <FormField
                id="duration_video"
                label="Duración del Video"
                type="text"
                value={formData.duration_video}
                onChange={handleChange}
              />
              <div>
                <label
                  htmlFor="intro_video"
                  className="block text-sm font-medium mb-4 text-blue-400"
                >
                  Video de Introducción
                </label>
                <MediaUploadPreview
                  onMediaUpload={handleVideoUpload}
                  accept="video/*"
                  label="Subir Video"
                  initialPreview={formData.intro_video}
                />
              </div>
              <FormField
                id="duration_course"
                label="Duración del Curso"
                type="text"
                value={formData.duration_course}
                onChange={handleChange}
              />
              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label
                  htmlFor="is_active"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Activo
                </label>
              </div>
            </form>
            <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0">
              <ActionButtons
                onSave={handleSubmit}
                onCancel={() => router.back()}
                isEditing={true}
                customSize={true}
              />
            </div>
          </main>
        </div>
        {formLoading && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <Loader />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default EditCourse;
