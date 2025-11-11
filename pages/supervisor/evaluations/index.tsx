import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/supervisor/SibebarSupervisor';
import { API_EVALUATIONMODULE } from '../../../utils/Endpoints';
import Modal from '../../../components/Admin/Modal';
import { useClassroomBySupervisor } from '../../../hooks/useClassroom';
import { useAuth } from '../../../context/AuthContext';
import {
  PlusIcon,
  AcademicCapIcon,
  ClockIcon,
  CalendarIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import '../../../app/globals.css';

interface Question {
  question_sche_id?: number;
  question_text: string;
  question_type:
    | 'multiple_choice'
    | 'single_choice'
    | 'true_false'
    | 'open_ended';
  points: number;
  order_index?: number;
  explanation?: string;
  options?: Option[];
}

interface Option {
  option_sche_id?: number;
  option_text: string;
  is_correct: boolean;
  order_index?: number;
}

interface Evaluation {
  evaluation_sche_id?: number;
  title: string;
  description: string;
  duration_minutes: number;
  total_points: number;
  passing_score: number;
  instructions: string;
  max_attempts: number;
  show_results_immediately: boolean;
  is_active: boolean;
  questions?: Question[];
  created_at?: string;
}

interface Profile {
  first_name: string;
  last_name: string;
}

interface User {
  user_id: number;
  userProfile: Profile;
}

interface Shift {
  shift_id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface Enterprise {
  enterprise_id: number;
  name: string;
}

interface Classroom {
  classroom_id: number;
  code: string;
  user_id: number;
  enterprise_id: number;
  shift_id: number;
  created_at: string;
  updated_at: string;
  Enterprise: Enterprise;
  Shift: Shift;
  User: User;
}

interface AssignmentFormData {
  evaluation_sche_id: number;
  classroom_ids: number[];
  start_date: string;
  due_date: string;
  status: 'assigned';
}

const Evaluations: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingEvaluation, setEditingEvaluation] = useState<Evaluation | null>(
    null
  );
  const { classrooms } = useClassroomBySupervisor();
  const [isSaving, setIsSaving] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [assignmentErrors, setAssignmentErrors] = useState<{
    [key: string]: string;
  }>({});

  const router = useRouter();
  const { user } = useAuth();
  const userInfo = user as { id: number; enterprise_id: number };

  // Estado del formulario de evaluación
  const [formData, setFormData] = useState<Evaluation>({
    title: '',
    description: '',
    duration_minutes: 60,
    total_points: 100,
    passing_score: 60,
    instructions: '',
    max_attempts: 1,
    show_results_immediately: true,
    is_active: true,
    questions: [],
  });

  // Estado del formulario de asignación
  const [assignmentFormData, setAssignmentFormData] =
    useState<AssignmentFormData>({
      evaluation_sche_id: 0,
      classroom_ids: [],
      start_date: '',
      due_date: '',
      status: 'assigned',
    });

  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    question_text: '',
    question_type: 'single_choice',
    points: 10,
    explanation: '',
    options: [
      { option_text: '', is_correct: false },
      { option_text: '', is_correct: false },
    ],
  });

  // Cargar evaluaciones
  useEffect(() => {
    if (userInfo?.id) {
      fetchEvaluations();
    }
  }, [userInfo]);

  // Inicializar fechas por defecto
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    setAssignmentFormData((prev) => ({
      ...prev,
      start_date: tomorrow.toISOString().slice(0, 16),
      due_date: nextWeek.toISOString().slice(0, 16),
    }));
  }, []);

  const fetchEvaluations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_EVALUATIONMODULE}/user/${userInfo.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Filter out invalid questions and ensure proper data structure
        const validEvaluations = (data.data || []).map((evaluation: any) => ({
          ...evaluation,
          questions: (evaluation.questions || []).filter(
            (question: any) =>
              question &&
              question.question_text &&
              typeof question.question_text === 'string'
          ),
        }));
        setEvaluations(validEvaluations);
      } else {
        console.error('Error fetching evaluations:', response.statusText);
        setEvaluations([]);
      }
    } catch (error) {
      console.error('Error fetching evaluations:', error);
      setEvaluations([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para navegar a la página de estudiantes asignados
  const handleViewStudents = (evaluationId: number) => {
    router.push(`/supervisor/evaluations/${evaluationId}/students`);
  };

  // Función para manejar el clic en la tarjeta de evaluación
  const handleEvaluationClick = (
    evaluation: Evaluation,
    event: React.MouseEvent
  ) => {
    // Verificar si el clic fue en un botón de acción
    const target = event.target as HTMLElement;
    const isActionButton = target.closest('button');

    if (!isActionButton && evaluation.evaluation_sche_id) {
      handleViewStudents(evaluation.evaluation_sche_id);
    }
  };

  // Validación del formulario de asignación
  const validateAssignmentForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!assignmentFormData.evaluation_sche_id) {
      newErrors.evaluation_sche_id = 'Debe seleccionar una evaluación';
    }

    if (assignmentFormData.classroom_ids.length === 0) {
      newErrors.classroom_ids = 'Debe seleccionar al menos un aula';
    }

    if (!assignmentFormData.start_date) {
      newErrors.start_date = 'La fecha de inicio es requerida';
    }

    if (!assignmentFormData.due_date) {
      newErrors.due_date = 'La fecha de fin es requerida';
    }

    if (
      assignmentFormData.start_date &&
      assignmentFormData.due_date &&
      new Date(assignmentFormData.start_date) >=
        new Date(assignmentFormData.due_date)
    ) {
      newErrors.due_date =
        'La fecha de fin debe ser posterior a la fecha de inicio';
    }

    setAssignmentErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Actualizar la función handleAssignEvaluation en el frontend:

  const handleAssignEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAssignmentForm()) {
      return;
    }

    try {
      setIsAssigning(true);
      setAssignmentErrors({});

      const assignmentData = {
        evaluation_sche_id: assignmentFormData.evaluation_sche_id,
        classroom_ids: assignmentFormData.classroom_ids,
        start_date: assignmentFormData.start_date,
        due_date: assignmentFormData.due_date,
        status: assignmentFormData.status,
      };

      console.log('Enviando datos de asignación:', assignmentData);

      const response = await fetch(
        `${API_EVALUATIONMODULE}/assignments/${userInfo.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(assignmentData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        handleCloseAssignModal();
        showNotification(
          `${result.message}. Total estudiantes: ${
            result.summary?.total_students_assigned || 0
          }`,
          'success'
        );
      } else {
        showNotification(
          result.message || 'Error al asignar la evaluación',
          'error'
        );
      }
    } catch (error) {
      console.error('Error assigning evaluation:', error);
      showNotification('Error al asignar la evaluación', 'error');
    } finally {
      setIsAssigning(false);
    }
  };
  // Abrir modal de asignación con una evaluación específica
  const handleOpenAssignModal = (evaluation: Evaluation) => {
    setAssignmentFormData((prev) => ({
      ...prev,
      evaluation_sche_id: evaluation.evaluation_sche_id || 0,
    }));
    setShowAssignModal(true);
  };

  // Cerrar modal de asignación
  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    setAssignmentFormData((prev) => ({
      ...prev,
      evaluation_sche_id: 0,
      classroom_ids: [],
    }));
    setAssignmentErrors({});
  };

  // Manejar selección de aulas
  const handleClassroomSelection = (classroomId: number, checked: boolean) => {
    setAssignmentFormData((prev) => ({
      ...prev,
      classroom_ids: checked
        ? [...prev.classroom_ids, classroomId]
        : prev.classroom_ids.filter((id) => id !== classroomId),
    }));
  };

  // Validación del formulario de evaluación
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (formData.duration_minutes < 1) {
      newErrors.duration_minutes = 'La duración debe ser mayor a 0';
    }

    if (
      formData.passing_score < 1 ||
      formData.passing_score > formData.total_points
    ) {
      newErrors.passing_score =
        'La puntuación mínima debe estar entre 1 y el total de puntos';
    }

    if (!formData.questions || formData.questions.length === 0) {
      newErrors.questions = 'Debe agregar al menos una pregunta';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);
      setErrors({});

      const url = editingEvaluation
        ? `${API_EVALUATIONMODULE}/${editingEvaluation.evaluation_sche_id}`
        : `${API_EVALUATIONMODULE}/profesor/${userInfo.id}/${userInfo.enterprise_id}`;

      const method = editingEvaluation ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchEvaluations();
        handleCloseModal();
        showNotification(
          editingEvaluation
            ? 'Evaluación actualizada exitosamente'
            : 'Evaluación creada exitosamente',
          'success'
        );
      } else {
        const error = await response.json();
        showNotification(
          `Error: ${error.message || 'Error al guardar la evaluación'}`,
          'error'
        );
      }
    } catch (error) {
      console.error('Error saving evaluation:', error);
      showNotification('Error al guardar la evaluación', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    alert(message);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta evaluación?')) {
      try {
        const response = await fetch(`${API_EVALUATIONMODULE}/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          await fetchEvaluations();
          showNotification('Evaluación eliminada exitosamente', 'success');
        } else {
          showNotification('Error al eliminar la evaluación', 'error');
        }
      } catch (error) {
        console.error('Error deleting evaluation:', error);
        showNotification('Error al eliminar la evaluación', 'error');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration_minutes: 60,
      total_points: 100,
      passing_score: 60,
      instructions: '',
      max_attempts: 1,
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
      question_type: 'single_choice',
      points: 10,
      explanation: '',
      options: [
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
      ],
    });
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingEvaluation(null);
    resetForm();
  };

  const handleEdit = (evaluation: Evaluation) => {
    setEditingEvaluation(evaluation);
    // Ensure questions array exists and is properly formatted
    const safeEvaluation = {
      ...evaluation,
      questions: (evaluation.questions || []).filter(
        (question) =>
          question &&
          question.question_text &&
          typeof question.question_text === 'string'
      ),
    };
    setFormData(safeEvaluation);
    setShowCreateModal(true);
  };

  const validateQuestion = (): boolean => {
    if (!currentQuestion.question_text.trim()) {
      showNotification('Por favor, ingresa el texto de la pregunta', 'error');
      return false;
    }

    if (currentQuestion.question_type !== 'open_ended') {
      const hasCorrectAnswer = currentQuestion.options?.some(
        (option) => option.is_correct
      );
      if (!hasCorrectAnswer) {
        showNotification(
          'Debe seleccionar al menos una opción correcta',
          'error'
        );
        return false;
      }

      if (currentQuestion.question_type === 'single_choice') {
        const correctCount =
          currentQuestion.options?.filter((option) => option.is_correct)
            .length || 0;
        if (correctCount > 1) {
          showNotification(
            'Para preguntas de selección única, solo puede haber una respuesta correcta',
            'error'
          );
          return false;
        }
      }

      const emptyOptions = currentQuestion.options?.filter(
        (option) => !option.option_text.trim()
      );
      if (emptyOptions && emptyOptions.length > 0) {
        showNotification('Todas las opciones deben tener texto', 'error');
        return false;
      }
    }

    return true;
  };

  const addQuestion = () => {
    if (!validateQuestion()) {
      return;
    }

    const newQuestions = [
      ...(formData.questions || []),
      {
        ...currentQuestion,
        order_index: (formData.questions?.length || 0) + 1,
      },
    ];
    const totalPoints = newQuestions.reduce((sum, q) => sum + q.points, 0);

    setFormData((prev) => ({
      ...prev,
      questions: newQuestions,
      total_points: totalPoints,
    }));

    resetCurrentQuestion();
  };

  const removeQuestion = (index: number) => {
    const newQuestions =
      formData.questions?.filter((_, i) => i !== index) || [];
    const totalPoints = newQuestions.reduce((sum, q) => sum + q.points, 0);

    const reindexedQuestions = newQuestions.map((q, i) => ({
      ...q,
      order_index: i + 1,
    }));

    setFormData((prev) => ({
      ...prev,
      questions: reindexedQuestions,
      total_points: totalPoints,
    }));
  };

  const addOption = () => {
    setCurrentQuestion((prev) => ({
      ...prev,
      options: [
        ...(prev.options || []),
        {
          option_text: '',
          is_correct: false,
          order_index: (prev.options?.length || 0) + 1,
        },
      ],
    }));
  };

  const updateOption = (index: number, field: keyof Option, value: any) => {
    const newOptions = [...(currentQuestion.options || [])];

    if (
      field === 'is_correct' &&
      value &&
      currentQuestion.question_type === 'single_choice'
    ) {
      newOptions.forEach((option, i) => {
        if (i !== index) {
          option.is_correct = false;
        }
      });
    }

    newOptions[index] = { ...newOptions[index], [field]: value };

    setCurrentQuestion((prev) => ({
      ...prev,
      options: newOptions,
    }));
  };

  const removeOption = (index: number) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      options:
        prev.options
          ?.filter((_, i) => i !== index)
          .map((option, i) => ({
            ...option,
            order_index: i + 1,
          })) || [],
    }));
  };

  const handleQuestionTypeChange = (type: Question['question_type']) => {
    let options = currentQuestion.options;

    if (type === 'true_false') {
      options = [
        { option_text: 'Verdadero', is_correct: false, order_index: 1 },
        { option_text: 'Falso', is_correct: false, order_index: 2 },
      ];
    } else if (type === 'open_ended') {
      options = [];
    } else if (type === 'single_choice' || type === 'multiple_choice') {
      if (type === 'single_choice' && options) {
        let foundCorrect = false;
        options = options.map((option) => ({
          ...option,
          is_correct:
            option.is_correct && !foundCorrect
              ? ((foundCorrect = true), true)
              : false,
        }));
      }

      if (!options || options.length < 2) {
        options = [
          { option_text: '', is_correct: false, order_index: 1 },
          { option_text: '', is_correct: false, order_index: 2 },
        ];
      }
    }

    setCurrentQuestion((prev) => ({
      ...prev,
      question_type: type,
      options,
    }));
  };

  const getQuestionTypeLabel = (type: Question['question_type']) => {
    switch (type) {
      case 'multiple_choice':
        return 'Opción Múltiple';
      case 'single_choice':
        return 'Selección Única';
      case 'true_false':
        return 'Verdadero/Falso';
      case 'open_ended':
        return 'Pregunta Abierta';
      default:
        return type;
    }
  };

  const renderFormField = (
    error: string | undefined,
    children: React.ReactNode
  ) => (
    <div className="space-y-1">
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );

  // Safe question text display with null checks
  const getQuestionDisplayText = (question: Question): string => {
    if (!question || !question.question_text) {
      return 'Pregunta sin texto';
    }
    const questionText = question.question_text.toString();
    return questionText.length > 60
      ? `${questionText.slice(0, 60)}...`
      : questionText;
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

        <main
          className={`flex-grow p-4 md:p-6 transition-all duration-300 ease-in-out ${
            showSidebar ? 'ml-20' : ''
          }`}
        >
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Evaluaciones Programadas
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Gestiona las evaluaciones para tus estudiantes. Haz clic en
                  una evaluación para ver estudiantes asignados.
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <ClipboardDocumentListIcon className="h-4 w-4 mr-2" />
                  Asignar Evaluación
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Nueva Evaluación
                </button>
              </div>
            </div>

            {/* Evaluations Grid */}
            <div className="bg-white rounded-lg shadow-md p-6">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : evaluations && evaluations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {evaluations.map((evaluation) => (
                    <div
                      key={evaluation.evaluation_sche_id}
                      onClick={(e) => handleEvaluationClick(evaluation, e)}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300 cursor-pointer relative group"
                    >
                      {/* Indicador visual de clickeable */}
                      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <EyeIcon className="h-4 w-4 text-blue-500" />
                      </div>

                      <div className="flex items-start justify-between mb-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenAssignModal(evaluation);
                            }}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors z-10 relative"
                            title="Asignar evaluación"
                          >
                            <UserGroupIcon className="h-4 w-4" />
                          </button>

                          {/*<button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(evaluation);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors z-10 relative"
                            title="Editar evaluación"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>*/}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(evaluation.evaluation_sche_id!);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors z-10 relative"
                            title="Eliminar evaluación"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                        {evaluation.title || 'Sin título'}
                      </h3>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {evaluation.description || 'Sin descripción'}
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <ClockIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>
                            {evaluation.duration_minutes || 0} minutos
                          </span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <StarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>
                            {evaluation.total_points || 0} puntos total
                          </span>
                        </div>

                        {evaluation.created_at && (
                          <div className="flex items-center text-sm text-gray-600">
                            <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">
                              Creada:{' '}
                              {new Date(
                                evaluation.created_at
                              ).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          {/*<span className="text-gray-600">
                            {evaluation.questions?.length || 0} pregunta(s)
                          </span>*/}
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              evaluation.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {evaluation.is_active ? 'Activa' : 'Inactiva'}
                          </span>
                        </div>
                      </div>

                      {/* Indicador de click en hover */}
                      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-blue-500 font-medium">
                          Click para ver estudiantes
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-500">
                    No hay evaluaciones creadas
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Crear Primera Evaluación
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal para Asignar Evaluación */}
      {showAssignModal && (
        <Modal
          isOpen={showAssignModal}
          onClose={handleCloseAssignModal}
          title="Asignar Evaluación"
          size="lg"
        >
          <form onSubmit={handleAssignEvaluation} className="space-y-6">
            <div className="space-y-4">
              {/* Selección de Evaluación */}
              {renderFormField(
                assignmentErrors.evaluation_sche_id,
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar Evaluación *
                  </label>
                  <select
                    value={assignmentFormData.evaluation_sche_id}
                    onChange={(e) =>
                      setAssignmentFormData((prev) => ({
                        ...prev,
                        evaluation_sche_id: parseInt(e.target.value) || 0,
                      }))
                    }
                    className={`block w-full rounded-md shadow-sm focus:ring-2 focus:ring-green-500 transition-colors ${
                      assignmentErrors.evaluation_sche_id
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-300 focus:border-green-500'
                    }`}
                  >
                    <option value={0}>Seleccione una evaluación</option>
                    {evaluations
                      .filter((evaluation) => evaluation.is_active) // ← Aquí está el cambio
                      .map((evaluation) => (
                        <option
                          key={evaluation.evaluation_sche_id}
                          value={evaluation.evaluation_sche_id}
                        >
                          {evaluation.title} (
                          {evaluation.questions?.length || 0} preguntas)
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Fechas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderFormField(
                  assignmentErrors.start_date,
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Inicio *
                    </label>
                    <input
                      type="datetime-local"
                      value={assignmentFormData.start_date}
                      onChange={(e) =>
                        setAssignmentFormData((prev) => ({
                          ...prev,
                          start_date: e.target.value,
                        }))
                      }
                      className={`block w-full rounded-md shadow-sm focus:ring-2 focus:ring-green-500 transition-colors ${
                        assignmentErrors.start_date
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-300 focus:border-green-500'
                      }`}
                    />
                  </div>
                )}

                {renderFormField(
                  assignmentErrors.due_date,
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Vencimiento *
                    </label>
                    <input
                      type="datetime-local"
                      value={assignmentFormData.due_date}
                      onChange={(e) =>
                        setAssignmentFormData((prev) => ({
                          ...prev,
                          due_date: e.target.value,
                        }))
                      }
                      className={`block w-full rounded-md shadow-sm focus:ring-2 focus:ring-green-500 transition-colors ${
                        assignmentErrors.due_date
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-300 focus:border-green-500'
                      }`}
                    />
                  </div>
                )}
              </div>

              {/* Selección de Aulas */}
              {renderFormField(
                assignmentErrors.classroom_ids,
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar Aulas *
                  </label>
                  <div className="border border-gray-300 rounded-md p-4 max-h-60 overflow-y-auto">
                    {classrooms && classrooms.length > 0 ? (
                      <div className="space-y-3">
                        {classrooms.map((classroom) => (
                          <div
                            key={classroom.classroom_id}
                            className="flex items-center p-3 hover:bg-gray-50 rounded-lg border border-gray-100"
                          >
                            <input
                              type="checkbox"
                              id={`classroom-${classroom.classroom_id}`}
                              checked={assignmentFormData.classroom_ids.includes(
                                classroom.classroom_id
                              )}
                              onChange={(e) =>
                                handleClassroomSelection(
                                  classroom.classroom_id,
                                  e.target.checked
                                )
                              }
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <label
                              htmlFor={`classroom-${classroom.classroom_id}`}
                              className="ml-3 flex-1 cursor-pointer"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    Aula: {classroom.code}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Turno: {classroom.Shift?.name} | Profesor:{' '}
                                    {classroom.User?.userProfile?.first_name}{' '}
                                    {classroom.User?.userProfile?.last_name}
                                  </p>
                                </div>
                                <div className="text-xs text-gray-400">
                                  {classroom.Enterprise?.name}
                                </div>
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No hay aulas disponibles
                      </p>
                    )}
                  </div>
                  {assignmentFormData.classroom_ids.length > 0 && (
                    <p className="mt-2 text-sm text-green-600">
                      {assignmentFormData.classroom_ids.length} aula(s)
                      seleccionada(s)
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCloseAssignModal}
                disabled={isAssigning}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={
                  isAssigning ||
                  assignmentFormData.classroom_ids.length === 0 ||
                  !assignmentFormData.evaluation_sche_id
                }
                className="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAssigning ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Asignando...
                  </span>
                ) : (
                  'Asignar Evaluación'
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal para Crear/Editar Evaluación */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={handleCloseModal}
          title={editingEvaluation ? 'Editar Evaluación' : 'Nueva Evaluación'}
          size="xl"
          closeOnBackdropClick={false}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Básica */}
            <div className="bg-gray-50 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                <CheckCircleIcon className="h-5 w-5 mr-2 text-blue-600" />
                Información Básica
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderFormField(
                  errors.title,
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className={`block w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.title
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder="Título de la evaluación"
                    />
                  </div>
                )}

                {renderFormField(
                  errors.duration_minutes,
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duración (minutos) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.duration_minutes}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          duration_minutes: parseInt(e.target.value) || 0,
                        }))
                      }
                      className={`block w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.duration_minutes
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                    />
                  </div>
                )}

                {renderFormField(
                  errors.passing_score,
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Puntuación Mínima *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max={formData.total_points}
                      value={formData.passing_score}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          passing_score: parseInt(e.target.value) || 0,
                        }))
                      }
                      className={`block w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.passing_score
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Intentos Máximos
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.max_attempts}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        max_attempts: parseInt(e.target.value) || 1,
                      }))
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                    placeholder="Descripción de la evaluación"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instrucciones
                  </label>
                  <textarea
                    rows={3}
                    value={formData.instructions}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        instructions: e.target.value,
                      }))
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                    placeholder="Instrucciones para los estudiantes"
                  />
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.show_results_immediately}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          show_results_immediately: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Mostrar resultados inmediatamente
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          is_active: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Evaluación activa
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección de Preguntas */}
            <div className="bg-gray-50 p-6 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <AcademicCapIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Preguntas ({formData.questions?.length || 0})
                </h3>
                <div className="text-sm text-gray-600">
                  Total:{' '}
                  <span className="font-semibold">{formData.total_points}</span>{' '}
                  puntos
                </div>
              </div>

              {errors.questions && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{errors.questions}</p>
                </div>
              )}

              {/* Lista de preguntas existentes */}
              {formData.questions && formData.questions.length > 0 && (
                <div className="mb-6 space-y-3">
                  <h4 className="font-medium text-gray-700">
                    Preguntas Agregadas:
                  </h4>
                  {formData.questions.map((question, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {getQuestionDisplayText(question)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {getQuestionTypeLabel(question.question_type)}
                          </span>
                          <span className="bg-blue-100 px-2 py-1 rounded text-blue-800">
                            {question.points || 0} pts
                          </span>
                          {question.question_type !== 'open_ended' && (
                            <span>
                              {question.options?.length || 0} opciones
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeQuestion(index)}
                        className="ml-3 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Eliminar pregunta"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Formulario para nueva pregunta */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium mb-4 text-gray-700">
                  Agregar Nueva Pregunta
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Texto de la pregunta *
                    </label>
                    <textarea
                      rows={3}
                      value={currentQuestion.question_text}
                      onChange={(e) =>
                        setCurrentQuestion((prev) => ({
                          ...prev,
                          question_text: e.target.value,
                        }))
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                      placeholder="Escribe aquí el texto de la pregunta"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de pregunta *
                      </label>
                      <select
                        value={currentQuestion.question_type}
                        onChange={(e) =>
                          handleQuestionTypeChange(
                            e.target.value as Question['question_type']
                          )
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                      >
                        <option value="single_choice">Selección Única</option>
                        {/*<option value="multiple_choice">Opción Múltiple</option> */}
                        <option value="true_false">Verdadero/Falso</option>
                        {/*<option value="open_ended">Pregunta Abierta</option>*/}
                      </select>
                      <p className="mt-1 text-xs text-gray-500">
                        {currentQuestion.question_type === 'single_choice' &&
                          'Solo una respuesta correcta'}
                        {currentQuestion.question_type === 'multiple_choice' &&
                          'Múltiples respuestas correctas'}
                        {currentQuestion.question_type === 'true_false' &&
                          'Solo verdadero o falso'}
                        {currentQuestion.question_type === 'open_ended' &&
                          'Respuesta de texto libre'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Puntos *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={currentQuestion.points}
                        onChange={(e) =>
                          setCurrentQuestion((prev) => ({
                            ...prev,
                            points: parseInt(e.target.value) || 1,
                          }))
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Opciones para preguntas con opciones */}
                  {currentQuestion.question_type !== 'open_ended' && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Opciones *
                        </label>
                        {(currentQuestion.question_type === 'multiple_choice' ||
                          currentQuestion.question_type ===
                            'single_choice') && (
                          <button
                            type="button"
                            onClick={addOption}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            + Agregar opción
                          </button>
                        )}
                      </div>

                      <div className="space-y-3">
                        {currentQuestion.options?.map((option, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200"
                          >
                            <div className="flex-shrink-0">
                              {currentQuestion.question_type ===
                              'single_choice' ? (
                                <input
                                  type="radio"
                                  name="correct_answer"
                                  checked={option.is_correct}
                                  onChange={(e) =>
                                    updateOption(
                                      index,
                                      'is_correct',
                                      e.target.checked
                                    )
                                  }
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                              ) : (
                                <input
                                  type="checkbox"
                                  checked={option.is_correct}
                                  onChange={(e) =>
                                    updateOption(
                                      index,
                                      'is_correct',
                                      e.target.checked
                                    )
                                  }
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                              )}
                            </div>
                            <input
                              type="text"
                              value={option.option_text}
                              onChange={(e) =>
                                updateOption(
                                  index,
                                  'option_text',
                                  e.target.value
                                )
                              }
                              placeholder={`Opción ${index + 1}`}
                              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                              disabled={
                                currentQuestion.question_type === 'true_false'
                              }
                            />
                            {(currentQuestion.question_type ===
                              'multiple_choice' ||
                              currentQuestion.question_type ===
                                'single_choice') &&
                              currentQuestion.options!.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => removeOption(index)}
                                  className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Eliminar opción"
                                >
                                  <XCircleIcon className="h-4 w-4" />
                                </button>
                              )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Explicación (opcional)
                    </label>
                    <textarea
                      rows={2}
                      value={currentQuestion.explanation}
                      onChange={(e) =>
                        setCurrentQuestion((prev) => ({
                          ...prev,
                          explanation: e.target.value,
                        }))
                      }
                      placeholder="Explicación que se mostrará después de responder"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addQuestion}
                    className="w-full bg-blue-50 text-blue-700 py-3 px-4 rounded-md hover:bg-blue-100 transition-colors border border-blue-200 font-medium"
                  >
                    <PlusIcon className="h-4 w-4 inline mr-2" />
                    Agregar Pregunta
                  </button>
                </div>
              </div>
            </div>

            {/* Botones del formulario */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isSaving}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </span>
                ) : (
                  `${editingEvaluation ? 'Actualizar' : 'Crear'} Evaluación`
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Evaluations;
