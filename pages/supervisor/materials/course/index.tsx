import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../../../components/Navbar';
import Sidebar from '../../../../components/supervisor/SibebarSupervisor';
import MediaUploadPreview from '../../../../components/MediaUploadPreview';
import FormField from '../../../../components/FormField';
import { getCategories } from '../../../../services/categoryService';
import { getProfessors } from '../../../../services/professorService';
import { getAvailableEvaluations } from '../../../../services/evaluationService';
import { addCourse2 } from '../../../../services/courseService';
import { Category } from '../../../../interfaces/Category';
import { Professor } from '../../../../interfaces/Professor';
import { Evaluation } from '../../../../interfaces/Evaluation';
import { Course } from '../../../../interfaces/Courses/Course';
import Loader from '../../../../components/Loader';
import ProtectedRoute from '../../../../components/Auth/ProtectedRoute';
import { useEvaluationWizard } from '../../../../components/Evaluation/hooks/LogicWizard';
import { EvaluationWizard } from '../../../../components/Evaluation/WizardEvaluation';
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import AlertComponent from '../../../../components/AlertComponent';

interface FormData
  extends Omit<Course, 'course_id' | 'created_at' | 'updated_at'> {
  [key: string]: string | boolean | number;
}

import './../../../../app/globals.css';

const AddCourse: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'danger' | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [clearMediaPreview, setClearMediaPreview] = useState(false);
  const [createdEvaluationId, setCreatedEvaluationId] = useState<number | null>(
    null
  );
  const [currentStep, setCurrentStep] = useState<
    'form' | 'evaluation' | 'processing' | 'success'
  >('form');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description_short: '',
    description_large: '',
    category_id: 64,
    professor_id: 33,
    evaluation_id: 0,
    intro_video: '',
    duration_video: '',
    image: '',
    duration_course: '',
    is_active: true,
  });
  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({});
  const [showAlert, setShowAlert] = useState(false);

  const router = useRouter();
  const imageUploadRef = useRef<{ clear: () => void }>(null);
  const videoUploadRef = useRef<{ clear: () => void }>(null);
  const wizard = useEvaluationWizard();

  useEffect(() => {
    const fetchCategoriesProfessorsEvaluations = async () => {
      try {
        const [categoriesRes, professorsRes, evaluationsRes] =
          await Promise.all([
            getCategories(),
            getProfessors(),
            getAvailableEvaluations(),
          ]);
        setCategories(categoriesRes);
        setProfessors(professorsRes);
        setEvaluations(evaluationsRes);
        setLoading(false);
      } catch (error) {
        setAlertMessage(
          'Error fetching categories, professors, or evaluations'
        );
        setAlertType('danger');
        setShowAlert(true);
        setLoading(false);
      }
    };
    fetchCategoriesProfessorsEvaluations();
  }, []);

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

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id } = e.target;
    setTouchedFields((prevState) => ({
      ...prevState,
      [id]: true,
    }));
  };

  const handleVideoUpload = (file: File) => {
    setVideoFile(file);
    setTouchedFields((prevState) => ({ ...prevState, intro_video: true }));
  };

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    setTouchedFields((prevState) => ({ ...prevState, image: true }));
  };

  const handleGoToEvaluationWizard = (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = [
      'name',
      'description_short',
      'description_large',
      'duration_video',
      'duration_course',
    ];

    const newTouchedFields: { [key: string]: boolean } = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newTouchedFields[field] = true;
      }
    });

    if (!imageFile) {
      newTouchedFields['image'] = true;
    }
    if (!videoFile) {
      newTouchedFields['intro_video'] = true;
    }

    const hasEmptyFields =
      requiredFields.some((field) => !formData[field]) ||
      !imageFile ||
      !videoFile;

    if (hasEmptyFields) {
      setTouchedFields((prev) => ({ ...prev, ...newTouchedFields }));
      setAlertMessage('Por favor, complete todos los campos requeridos.');
      setAlertType('danger');
      setShowAlert(true);
      return;
    }

    setCurrentStep('evaluation');
  };

  const handleCompleteEvaluation = async () => {
    try {
      setCurrentStep('processing');

      // 1. Crear evaluación
      const evaluationId = await wizard.completeForm();
      setCreatedEvaluationId(evaluationId);

      // 2. Actualizar formData con el ID de evaluación
      const updatedFormData = {
        ...formData,
        evaluation_id: evaluationId,
      };
      setFormData(updatedFormData);

      // 3. Crear curso
      await addCourse2(updatedFormData, videoFile!, imageFile!);

      // 4. Mostrar éxito
      setCurrentStep('success');
    } catch (error) {
      console.error('Error:', error);
      setCurrentStep('form');
      setAlertMessage('Error al completar el proceso');
      setAlertType('danger');
      setShowAlert(true);
    }
  };

  const handleSuccessClose = () => {
    // Resetear el formulario
    setFormData({
      name: '',
      description_short: '',
      description_large: '',
      category_id: 64,
      professor_id: 33,
      evaluation_id: 0,
      intro_video: '',
      duration_video: '',
      image: '',
      duration_course: '',
      is_active: true,
    });
    // Limpiar archivos
    setVideoFile(null);
    setImageFile(null);
    setClearMediaPreview(true);
    if (imageUploadRef.current) imageUploadRef.current.clear();
    if (videoUploadRef.current) videoUploadRef.current.clear();
    setTimeout(() => setClearMediaPreview(false), 500);

    // Volver al formulario inicial
    setCurrentStep('form');
    setShowAlert(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Renderizado condicional basado en currentStep
  switch (currentStep) {
    case 'evaluation':
      return (
        <ProtectedRoute>
          <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
            <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
            <div className="flex flex-1 pt-16">
              <Sidebar
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
              />
              <main
                className={`flex-grow p-6 transition-all duration-300 ease-in-out ${
                  showSidebar ? 'ml-20' : 'ml-0'
                }`}
              >
                <EvaluationWizard
                  {...wizard}
                  completeForm={handleCompleteEvaluation}
                />
              </main>
            </div>
          </div>
        </ProtectedRoute>
      );

    case 'processing':
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900">
                Procesando registro...
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Guardando evaluación , curso y asignando usuarios , por favor
                espere.
              </p>
            </div>
          </div>
        </div>
      );

    case 'success':
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex flex-col items-center">
              <CheckCircleIcon className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                ¡Registro completado!
              </h3>
              <p className="mt-2 text-sm text-gray-600 text-center">
                El curso y la evaluación han sido registrados exitosamente.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleSuccessClose}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        </div>
      );

    case 'form':
    default:
      return (
        <ProtectedRoute>
          <div className="relative min-h-screen flex flex-col bg-gradient-to-b ">
            <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
            <div className="flex flex-1 pt-16">
              <Sidebar
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
              />
              <main
                className={`p-6 flex-grow ${
                  showSidebar ? 'ml-20' : ''
                } transition-all duration-300 ease-in-out flex flex-col md:flex-row md:space-x-4`}
              >
                <div className="max-w-6xl bg-white rounded-lg w-full p-20 justify-center items-center shadow-md">
                  {showAlert && (
                    <AlertComponent
                      type={alertType || 'info'}
                      message={alertMessage || ''}
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
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
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
                        error={
                          !formData.description_short &&
                          touchedFields['description_short']
                        }
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
                        error={
                          !formData.description_large &&
                          touchedFields['description_large']
                        }
                        touched={touchedFields['description_large']}
                        required
                      />

                      <div className="relative z-0 w-full mb-5 group">
                        <label className="block text-sm font-medium text-black dark:text-gray-300 mb-1">
                          Categoria
                        </label>
                        <div className="text-black py-3 px-0 w-full text-lg bg-gray-100 border-b-2 border-gray-300">
                          {categories.find(
                            (p) => p.category_id === formData.category_id
                          )?.name || 'Categoria no seleccionado'}
                        </div>
                        {formData.category_id === 0 &&
                          touchedFields['category_id'] && (
                            <p className="mt-1 text-sm text-red-600">
                              Debe seleccionar una categoria
                            </p>
                          )}
                      </div>
                      <div>
                        <label
                          htmlFor="image"
                          className="block text-sm font-medium mb-6 text-gray-700"
                        >
                          Portada
                        </label>
                        <MediaUploadPreview
                          ref={imageUploadRef}
                          onMediaUpload={handleImageUpload}
                          accept="image/*"
                          label="Subir imagen"
                          clearMediaPreview={clearMediaPreview}
                          error={!imageFile && touchedFields['image']}
                          touched={touchedFields['image']}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="relative z-0 w-full mb-5 group">
                        <label className="block text-sm font-medium text-black dark:text-gray-300 mb-1">
                          Profesor
                        </label>
                        <div className="text-black py-3 px-0 w-full text-lg bg-gray-100 border-b-2 border-gray-300">
                          {professors.find(
                            (p) => p.professor_id === formData.professor_id
                          )?.full_name || 'Profesor no seleccionado'}
                        </div>
                        {formData.professor_id === 0 &&
                          touchedFields['professor_id'] && (
                            <p className="mt-1 text-sm text-red-600">
                              Debe seleccionar un profesor
                            </p>
                          )}
                      </div>
                      <FormField
                        id="duration_video"
                        label="Duración del Video"
                        type="text"
                        value={formData.duration_video}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          !formData.duration_video &&
                          touchedFields['duration_video']
                        }
                        touched={touchedFields['duration_video']}
                        required
                      />
                      <div>
                        <label
                          htmlFor="intro_video"
                          className="block text-sm font-medium mb-6 text-gray-700"
                        >
                          Video de Introducción
                        </label>
                        <MediaUploadPreview
                          ref={videoUploadRef}
                          onMediaUpload={handleVideoUpload}
                          accept="video/*"
                          label="Subir video"
                          clearMediaPreview={clearMediaPreview}
                          error={!videoFile && touchedFields['intro_video']}
                          touched={touchedFields['intro_video']}
                        />
                      </div>
                      <FormField
                        id="duration_course"
                        label="Duración del Curso"
                        type="text"
                        value={formData.duration_course}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          !formData.duration_course &&
                          touchedFields['duration_course']
                        }
                        touched={touchedFields['duration_course']}
                        required
                      />
                    </div>
                  </form>
                  <div className="col-span-2 flex justify-between mt-6">
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={handleGoToEvaluationWizard}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </ProtectedRoute>
      );
  }
};

export default AddCourse;
