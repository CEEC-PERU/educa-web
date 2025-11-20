import Navbar from '@/components/Navbar';
import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/supervisor/SibebarSupervisor';
import './../../../app/globals.css';
import { PlusCircleIcon } from 'lucide-react';
import {
  ClipboardDocumentListIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import Modal from '../../../components/Admin/Modal';
import { API_CERTIFICATES } from '../../../utils/Endpoints';
import { useAuth } from '../../../context/AuthContext';
import CertificationForm from '../../../components/supervisor/CertificationForm';
import { CertificationFormData, Question, Certification, UserInfo } from '../../../interfaces/Certification';

const CertificatesPage: React.FC = () => {
  const [showSideBar, setShowSidebar] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState<CertificationFormData>({
    title: '',
    description: '',
    instructions: '',
    duration_in_minutes: 60,
    max_attempts: 1,
    passing_percentage: 70,
    show_results_immediately: true,
    is_active: true,
    questions: []
  });
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    question_text: '',
    type_id: 4,
    points_value: 1,
    options: []
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [editingCertificate, setEditingCertificate] = useState<Certification | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();
  const userInfo = user as UserInfo;
  console.log('userInfo en certificates:', userInfo);

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      instructions: '',
      duration_in_minutes: 60,
      max_attempts: 1,
      passing_percentage: 70,
      show_results_immediately: true,
      is_active: true,
      questions: [],
    });
    resetCurrentQuestion();
    setErrors({});
  };

  const resetCurrentQuestion = () => {
    setCurrentQuestion({
      question_text: '',
      type_id: 1,
      points_value: 1,
      options: []
    });
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingCertificate(null);
    resetForm();
  };

  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
  };

  const handleAssignCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    // implementar lógica de petición
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      if (formData.questions.length === 0) {
        setErrors({ questions: 'Debe agregar al menos una pregunta' });
        setIsSubmitting(false);
        return;
      }

      if (!userInfo || !userInfo.enterprise_id || !userInfo.id) {
        throw new Error('Información de usuario no disponible');
      }

      const requestData = {
        ...formData,
        enterprise_id: userInfo.enterprise_id,
        created_by: userInfo.id
      };

      const response = await fetch(
        `${API_CERTIFICATES}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al crear certificación');
      }

      console.log('Certificación creada:', result.data);
      handleCloseModal();
      alert('Certificación creada exitosamente');
      
    } catch (error: any) {
      console.error('Error:', error);
      if (error.message.includes('Title is required')) {
        setErrors({ title: 'El título es requerido' });
      } else if (error.message.includes('already exists')) {
        setErrors({ title: 'Ya existe una certificación con este título' });
      } else if (error.message.includes('At least one question is required')) {
        setErrors({ questions: 'Debe agregar al menos una pregunta' });
      } else {
        setErrors({ general: error.message });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const addQuestion = () => {
    const newErrors: { [key: string]: string } = {};

    if (!currentQuestion.question_text.trim()) {
      newErrors.questions = 'El texto de la pregunta es requerido';
    }

    if ([1, 2].includes(currentQuestion.type_id) && currentQuestion.options.length < 2) {
      newErrors.questions = 'Las preguntas de opción deben tener al menos 2 opciones';
    }

    if ([1, 2].includes(currentQuestion.type_id) && 
        !currentQuestion.options.some(opt => opt.is_correct)) {
      newErrors.questions = 'Debe haber al menos una opción correcta';
    }

    if (currentQuestion.options.some(opt => !opt.option_text.trim())) {
      newErrors.questions = 'Todas las opciones deben tener texto';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors({ ...errors, ...newErrors });
      return;
    }

    const newQuestion: Question = {
      ...currentQuestion,
      question_text: currentQuestion.question_text.trim(),
      options: currentQuestion.options.map(opt => ({
        ...opt,
        option_text: opt.option_text.trim()
      }))
    };

    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion]
    });

    resetCurrentQuestion();
    setErrors({ ...errors, questions: '' });
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleDownloadTemplate = () => {
    alert('descarga de plantilla');
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSideBar} setShowSidebar={setShowSidebar} />
        <main className={`flex-grow p-4 md:p-6 transition-all duration-300 ease-in-out`}>
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Gestión de Certificados
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Administra los certificados para tus estudiantes desde esta sección.
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <button
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center px-4 py-2 text-white bg-purple-500 rounded-md hover:bg-purple-600 transition-colors"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  <span className="ml-2">Descargar Plantilla</span>
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <PlusCircleIcon className="h-4 w-4 mr-2" />
                  Crear Certificado
                </button>
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <ClipboardDocumentListIcon className="h-4 w-4 mr-2" />
                  Asignar Certificado
                </button>
              </div>
            </div>
            
            {/* contenido de certificados */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-center py-12">
                <p className="text-gray-500">Lista de certificados aparecerá aquí</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal para crear/editar certificados */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={handleCloseModal}
          title={editingCertificate ? 'Editar Certificado' : 'Crear Certificado'}
          size="xl"
          closeOnBackdropClick={false}
        >
          <CertificationForm
            formData={formData}
            onFormDataChange={setFormData}
            currentQuestion={currentQuestion}
            onCurrentQuestionChange={setCurrentQuestion}
            onAddQuestion={addQuestion}
            onRemoveQuestion={removeQuestion}
            errors={errors}
            isSubmitting={isSubmitting}
            editingCertificate={editingCertificate}
            onSubmit={handleSubmit}
            onClose={handleCloseModal}
          />
        </Modal>
      )}

      
    </div>
  );
};

export default CertificatesPage;