import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import Sidebar from "../../../components/supervisor/SibebarSupervisor";
import "./../../../app/globals.css";
import {
  CalendarIcon,
  ClockIcon,
  PlusCircleIcon,
  StarIcon,
} from "lucide-react";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import Modal from "../../../components/Admin/Modal";
import { API_CERTIFICATES } from "../../../utils/Endpoints";
import { useAuth } from "../../../context/AuthContext";
import CertificationForm from "../../../components/supervisor/CertificationForm";
import {
  CertificationFormData,
  Question,
  Certification,
  UserInfo,
} from "../../../interfaces/Certification";
import { useCertifications } from "@/hooks/useCertification";
import { AcademicCapIcon, TrashIcon } from "@heroicons/react/24/solid";
import { AssignmentFormData } from "../../../interfaces/Certification";
import AssignmentForm from "../../../components/supervisor/AssignmentForm";
import {
  fetchWithTimeout,
  handleApiResponse,
  ApiError,
} from "../../../utils/apiHelpers";

const getDate = (date: Date) => {
  const now = new Date(date);
  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);
  return { now, nextWeek };
};

const CertificatesPage: React.FC = () => {
  const [showSideBar, setShowSidebar] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignmentFormData, setAssignmentFormData] =
    useState<AssignmentFormData>({
      certification_id: 0,
      classroom_ids: [],
      start_date: getDate(new Date()).now.toISOString().slice(0, 16),
      due_date: getDate(new Date()).nextWeek.toISOString().slice(0, 16),
      assigned_by: 0,
      is_randomized: true,
      questions_count: 0,
    });
  const [assignmentErrors, setAssignmentErrors] = useState<{
    [key: string]: string;
  }>({});
  const [isAssigningCertificate, setIsAssigningCertificate] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState<CertificationFormData>({
    title: "",
    description: "",
    instructions: "",
    duration_in_minutes: 60,
    max_attempts: 1,
    passing_percentage: 70,
    show_results_immediately: true,
    is_active: true,
    questions: [],
  });
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    question_text: "",
    type_id: 4,
    points_value: 1,
    options: [],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [editingCertificate, setEditingCertificate] =
    useState<Certification | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const userInfo = user as UserInfo;

  const { certifications, loading, error, reload } = useCertifications(
    userInfo?.id
  );

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      instructions: "",
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

  const resetAssignmentForm = () => {
    const now = new Date();
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 7);

    setAssignmentFormData({
      certification_id: 0,
      classroom_ids: [],
      start_date: now.toISOString().slice(0, 16),
      due_date: nextWeek.toISOString().slice(0, 16),
      assigned_by: 0,
      is_randomized: true,
      questions_count: undefined,
    });
    setAssignmentErrors({});
  };

  const resetCurrentQuestion = () => {
    setCurrentQuestion({
      question_text: "",
      type_id: 1,
      points_value: 1,
      options: [],
    });
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingCertificate(null);
    resetForm();
  };

  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    resetAssignmentForm();
  };

  const handleAssignCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssignmentErrors({});
    setIsAssigningCertificate(true);

    try {
      // Validaciones básicas del frontend
      if (!assignmentFormData.certification_id) {
        throw new Error("Debe seleccionar un certificado");
      }

      if (assignmentFormData.classroom_ids.length === 0) {
        throw new Error("Debe seleccionar al menos una aula");
      }

      if (!userInfo?.id) {
        throw new Error("Información de usuario no disponible");
      }

      const requestData = {
        certification_id: assignmentFormData.certification_id,
        classroom_ids: assignmentFormData.classroom_ids,
        assigned_by: userInfo.id,
        start_date: assignmentFormData.start_date,
        due_date: assignmentFormData.due_date,
        questions_count: assignmentFormData.questions_count || null,
        is_randomized: assignmentFormData.is_randomized,
      };

      console.log("Enviando asignación:", requestData);

      //peticion con timeout
      const response = await fetchWithTimeout(
        `${API_CERTIFICATES}/assign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          body: JSON.stringify(requestData),
        },
        10000 // 10 segundos timeout
      );

      //MANEJO DE RESPUESTA
      const result = await handleApiResponse(response);

      console.log("Certificado asignado exitosamente:", result);
      handleCloseAssignModal();

      showNotification(
        `Certificado asignado a ${
          result.data?.total_assigned ||
          result.total_assigned ||
          assignmentFormData.classroom_ids.length
        } aula(s)`,
        "success"
      );
    } catch (error: any) {
      console.error("Error en asignación:", error);

      //MANEJO ESPECÍFICO DE ERRORES
      let errorMessage = error.message || "Error al asignar el certificado";

      if (error instanceof ApiError) {
        // Ya viene con un mensaje descriptivo del utility
      } else if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")
      ) {
        errorMessage =
          "Error de conexión. Verifique su internet e intente nuevamente.";
      } else if (
        error.message.includes("timeout") ||
        error.message.includes("tardó demasiado")
      ) {
        errorMessage =
          "La solicitud tardó demasiado tiempo. Por favor, intente nuevamente.";
      } else if (error.message.includes("500")) {
        errorMessage =
          "Error interno del servidor. El equipo técnico ha sido notificado.";
      }

      setAssignmentErrors({ general: errorMessage });
    } finally {
      setIsAssigningCertificate(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      if (formData.questions.length === 0) {
        setErrors({ questions: "Debe agregar al menos una pregunta" });
        setIsSubmitting(false);
        return;
      }

      if (!userInfo || !userInfo.enterprise_id || !userInfo.id) {
        throw new Error("Información de usuario no disponible");
      }

      const requestData = {
        ...formData,
        enterprise_id: userInfo.enterprise_id,
        created_by: userInfo.id,
      };

      const response = await fetch(`${API_CERTIFICATES}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error al crear certificación");
      }

      console.log("Certificación creada:", result.data);
      handleCloseModal();
      reload();
      alert("Certificación creada exitosamente");
    } catch (error: any) {
      console.error("Error:", error);
      if (error.message.includes("Title is required")) {
        setErrors({ title: "El título es requerido" });
      } else if (error.message.includes("already exists")) {
        setErrors({ title: "Ya existe una certificación con este título" });
      } else if (error.message.includes("At least one question is required")) {
        setErrors({ questions: "Debe agregar al menos una pregunta" });
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
      newErrors.questions = "El texto de la pregunta es requerido";
    }

    if (
      [1, 2].includes(currentQuestion.type_id) &&
      currentQuestion.options.length < 2
    ) {
      newErrors.questions =
        "Las preguntas de opción deben tener al menos 2 opciones";
    }

    if (
      [1, 2].includes(currentQuestion.type_id) &&
      !currentQuestion.options.some((opt) => opt.is_correct)
    ) {
      newErrors.questions = "Debe haber al menos una opción correcta";
    }

    if (currentQuestion.options.some((opt) => !opt.option_text.trim())) {
      newErrors.questions = "Todas las opciones deben tener texto";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors({ ...errors, ...newErrors });
      return;
    }

    const newQuestion: Question = {
      ...currentQuestion,
      question_text: currentQuestion.question_text.trim(),
      options: currentQuestion.options.map((opt) => ({
        ...opt,
        option_text: opt.option_text.trim(),
      })),
    };

    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion],
    });

    resetCurrentQuestion();
    setErrors({ ...errors, questions: "" });
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleDownloadTemplate = () => {
    //template
  };

  const showNotification = (message: string, type: "success" | "error") => {
    alert(message);
  };

  const handleDeleteCertificate = async (certificationId: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta evaluación?")) {
      try {
        const response = await fetch(`${API_CERTIFICATES}/${certificationId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        });

        if (response.ok) {
          // Refrescar la lista de evaluaciones después de eliminar
          reload();
          showNotification("Evaluación eliminada exitosamente", "success");
        } else {
          showNotification("Error al eliminar la evaluación", "error");
        }
      } catch (error) {
        console.error("Error deleting evaluation:", error);
        showNotification("Error al eliminar la evaluación", "error");
      }
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSideBar} setShowSidebar={setShowSidebar} />
        <main
          className={`flex-grow p-4 md:p-6 transition-all duration-300 ease-in-out`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Gestión de Certificados
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Administra los certificados para tus estudiantes desde esta
                  sección.
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                {/*
                <button
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center px-4 py-2 text-white bg-purple-500 rounded-md hover:bg-purple-600 transition-colors"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  <span className="ml-2">Descargar Plantilla</span>
                </button>*/}
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
              {loading ? (
                <div className="flex justify-center py-12">
                  <p className="text-gray-500">Cargando certificados...</p>
                </div>
              ) : error ? (
                <div className="flex justify-center py-12">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : certifications.length === 0 ? (
                <div className="flex justify-center py-12">
                  <p className="text-gray-500">
                    No hay certificados disponibles.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certifications.map((cert) => (
                    <div
                      key={cert.certification_id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300 cursor-pointer relative group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCertificate(cert.certification_id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors z-10 relative"
                            title="Eliminar evaluación"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <h2 className="text-lg font-bold mb-2 text-gray-900">
                        {cert.title}
                      </h2>
                      <p className="text-sm text-gray-600 mb-4">
                        {cert.description}
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <ClockIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>
                            Duración: {cert.duration_in_minutes} minutos
                          </span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <StarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>
                            Puntuación para aprobar: {cert.passing_percentage}%
                          </span>
                        </div>

                        {/*created_at*/}
                        {cert.created_at && (
                          <div className="flex items-center text-sm text-gray-600">
                            <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">
                              Creada:{" "}
                              {new Date(cert.created_at).toLocaleDateString(
                                "es-ES",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              cert.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {cert.is_active ? "Activo" : "Inactivo"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal para crear/editar certificados */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={handleCloseModal}
          title={
            editingCertificate ? "Editar Certificado" : "Crear Certificado"
          }
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

      {/* Modal para asignar certificados */}
      {showAssignModal && (
        <Modal
          isOpen={showAssignModal}
          onClose={handleCloseAssignModal}
          title="Asignar Certificado"
          size="lg"
          closeOnBackdropClick={false}
        >
          <AssignmentForm
            formData={assignmentFormData}
            onFormDataChange={setAssignmentFormData}
            availableCertifications={certifications.map((cert) => ({
              certification_id: cert.certification_id,
              title: cert.title,
              description: cert.description,
              duration_in_minutes: cert.duration_in_minutes,
            }))}
            errors={assignmentErrors}
            isSubmitting={isAssigningCertificate}
            onSubmit={handleAssignCertificate}
            onClose={handleCloseAssignModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default CertificatesPage;
