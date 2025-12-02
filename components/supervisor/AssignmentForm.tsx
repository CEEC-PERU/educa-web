import React, { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  XCircleIcon,
} from "lucide-react";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { AssignmentFormProps } from "../../interfaces/Certification";
import { useClassroomBySupervisor } from "@/hooks/useClassroom";

const AssignmentForm: React.FC<AssignmentFormProps> = ({
  formData,
  onFormDataChange,
  availableCertifications,
  errors,
  isSubmitting,
  onSubmit,
  onClose,
}) => {
  const [selectedClassrooms, setSelectedClassrooms] = useState<number[]>(
    formData.classroom_ids
  );
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  const {
    classrooms,
    isLoading: classroomsLoading,
    error: classroomsError,
  } = useClassroomBySupervisor();

  // SINCRONIZACIÓN DE ESTADOS
  useEffect(() => {
    setSelectedClassrooms(formData.classroom_ids);
  }, [formData.classroom_ids]);

  // FUNCIÓN PARA RENDERIZAR MENSAJES DE ERROR MEJORADOS
  const renderErrorSection = () => {
    if (!errors.general) return null;

    const getErrorIcon = () => {
      switch (errors.errorType) {
        case "duplicate_assignment":
          return (
            <XCircleIcon className="h-5 w-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
          );
        case "invalid_id":
          return (
            <XCircleIcon className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
          );
        case "questions_count":
          return (
            <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          );
        case "classroom_error":
          return (
            <InformationCircleIcon className="h-5 w-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0" />
          );
        default:
          return (
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
          );
      }
    };

    const getErrorTitle = () => {
      switch (errors.errorType) {
        case "duplicate_assignment":
          return "Asignación duplicada";
        case "invalid_id":
          return "ID inválido";
        case "questions_count":
          return "Error en cantidad de preguntas";
        case "classroom_error":
          return "Error en aulas";
        case "server_error":
          return "Error del servidor";
        case "network_error":
          return "Error de conexión";
        case "timeout_error":
          return "Tiempo de espera agotado";
        default:
          return "Error al asignar certificado";
      }
    };

    const getErrorSuggestion = () => {
      switch (errors.errorType) {
        case "duplicate_assignment":
          return "Una o más aulas seleccionadas ya tienen este certificado asignado. Deselecciónelas para continuar.";
        case "invalid_id":
          return "Verifique que todos los IDs de aulas y certificados existan en el sistema.";
        case "questions_count":
          return "La cantidad de preguntas asignadas debe ser menor o igual al total disponible en el certificado.";
        case "classroom_error":
          return "Hay un problema con alguna de las aulas seleccionadas. Verifique que estén activas.";
        case "server_error":
          return "Este error puede ser temporal. Intente nuevamente en unos minutos o contacte al administrador.";
        case "network_error":
          return "Verifique su conexión a internet e intente nuevamente.";
        case "timeout_error":
          return "La solicitud tardó demasiado tiempo. Intente nuevamente con una conexión más estable.";
        default:
          return "Por favor, verifique los datos e intente nuevamente.";
      }
    };

    const getContainerStyles = () => {
      switch (errors.errorType) {
        case "duplicate_assignment":
          return "bg-orange-50 border-orange-200";
        case "questions_count":
          return "bg-blue-50 border-blue-200";
        case "classroom_error":
          return "bg-purple-50 border-purple-200";
        case "network_error":
        case "timeout_error":
          return "bg-yellow-50 border-yellow-200";
        default:
          return "bg-red-50 border-red-200";
      }
    };

    const getTextStyles = () => {
      switch (errors.errorType) {
        case "duplicate_assignment":
          return {
            title: "text-orange-800",
            message: "text-orange-700",
            details: "text-orange-700",
            button: "bg-orange-100 text-orange-700 hover:bg-orange-200",
          };
        case "questions_count":
          return {
            title: "text-blue-800",
            message: "text-blue-700",
            details: "text-blue-700",
            button: "bg-blue-100 text-blue-700 hover:bg-blue-200",
          };
        case "classroom_error":
          return {
            title: "text-purple-800",
            message: "text-purple-700",
            details: "text-purple-700",
            button: "bg-purple-100 text-purple-700 hover:bg-purple-200",
          };
        case "network_error":
        case "timeout_error":
          return {
            title: "text-yellow-800",
            message: "text-yellow-700",
            details: "text-yellow-700",
            button: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
          };
        default:
          return {
            title: "text-red-800",
            message: "text-red-700",
            details: "text-red-700",
            button: "bg-red-100 text-red-700 hover:bg-red-200",
          };
      }
    };

    const styles = getTextStyles();

    return (
      <div className={`p-4 border rounded-md ${getContainerStyles()}`}>
        <div className="flex items-start">
          {getErrorIcon()}
          <div className="flex-1">
            <h4 className={`text-sm font-medium ${styles.title} mb-1`}>
              {getErrorTitle()}
            </h4>

            {/*MENSAJE PRINCIPAL DEL BACKEND */}
            <p className={`text-sm ${styles.message} mb-2`}>{errors.general}</p>

            {/* DETALLES TÉCNICOS (si existen y son diferentes al mensaje principal) */}
            {errors.backendDetails &&
              errors.backendDetails !== errors.general && (
                <div
                  className={`mt-2 p-2 rounded border ${getContainerStyles()
                    .replace("50", "100")
                    .replace("200", "300")}`}
                >
                  <p className={`text-xs font-medium mb-1 ${styles.title}`}>
                    Detalles técnicos:
                  </p>
                  <p className={`text-xs ${styles.details}`}>
                    {errors.backendDetails}
                  </p>
                </div>
              )}

            {/* SUGERENCIAS CONTEXTUALES */}
            <div
              className={`mt-3 p-2 rounded border ${
                errors.errorType === "duplicate_assignment"
                  ? "bg-orange-50 border-orange-200"
                  : errors.errorType === "questions_count"
                  ? "bg-blue-50 border-blue-200"
                  : errors.errorType === "classroom_error"
                  ? "bg-purple-50 border-purple-200"
                  : "bg-yellow-50 border-yellow-200"
              }`}
            >
              <p
                className={`text-xs ${
                  errors.errorType === "duplicate_assignment"
                    ? "text-orange-700"
                    : errors.errorType === "questions_count"
                    ? "text-blue-700"
                    : errors.errorType === "classroom_error"
                    ? "text-purple-700"
                    : "text-yellow-700"
                }`}
              >
                💡 <strong>Sugerencia:</strong> {getErrorSuggestion()}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFormField = (field: string, children: React.ReactNode) => {
    const allErrors = getAllErrors();
    const error = allErrors[field];

    return (
      <div className="space-y-1">
        {children}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  };

  const updateFormData = (field: string, value: any) => {
    onFormDataChange({
      ...formData,
      [field]: value,
    });

    // Limpiar error de validación cuando el usuario corrige
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(e);
    } catch (error) {
      // El error se maneja en el componente padre
      console.error("Error en envío del formulario:", error);
    }
  };

  const handleClassroomToggle = (classroomId: number) => {
    const updatedClassrooms = selectedClassrooms.includes(classroomId)
      ? selectedClassrooms.filter((id) => id !== classroomId)
      : [...selectedClassrooms, classroomId];

    setSelectedClassrooms(updatedClassrooms);
    updateFormData("classroom_ids", updatedClassrooms);
  };

  const selectedCertification = availableCertifications.find(
    (cert) => cert.certification_id === formData.certification_id
  );

  // VALIDACIONES MEJORADAS
  useEffect(() => {
    const newErrors: { [key: string]: string } = {};

    if (formData.start_date && formData.due_date) {
      const startDate = new Date(formData.start_date);
      const dueDate = new Date(formData.due_date);
      const now = new Date();

      if (startDate < new Date(now.getTime() - 60000)) {
        newErrors.start_date = "La fecha de inicio no puede ser en el pasado";
      }

      if (dueDate <= new Date(startDate.getTime() + 60000)) {
        newErrors.due_date =
          "La fecha límite debe ser posterior a la fecha de inicio";
      }
    }

    setValidationErrors((prev) => ({ ...prev, ...newErrors }));
  }, [formData.start_date, formData.due_date]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validaciones requeridas
    if (!formData.certification_id) {
      newErrors.certification_id = "Debe seleccionar un certificado";
    }

    if (selectedClassrooms.length === 0) {
      newErrors.classroom_ids = "Debe seleccionar al menos una aula";
    }

    if (!formData.start_date) {
      newErrors.start_date = "La fecha de inicio es requerida";
    }

    if (!formData.due_date) {
      newErrors.due_date = "La fecha límite es requerida";
    }

    // Validaciones de formato y lógica
    if (formData.start_date && formData.due_date) {
      const startDate = new Date(formData.start_date);
      const dueDate = new Date(formData.due_date);
      const now = new Date();

      if (isNaN(startDate.getTime())) {
        newErrors.start_date = "Fecha de inicio inválida";
      }

      if (isNaN(dueDate.getTime())) {
        newErrors.due_date = "Fecha límite inválida";
      }

      if (startDate < new Date(now.getTime() - 60000)) {
        newErrors.start_date = "La fecha de inicio no puede ser en el pasado";
      }

      if (dueDate <= new Date(startDate.getTime() + 60000)) {
        newErrors.due_date =
          "La fecha límite debe ser posterior a la fecha de inicio";
      }
    }

    if (
      formData.questions_count !== undefined &&
      formData.questions_count !== null
    ) {
      if (formData.questions_count <= 0) {
        newErrors.questions_count = "Debe ser mayor que 0";
      } else if (formData.questions_count > 100) {
        newErrors.questions_count = "No puede exceder 100 preguntas";
      }
    }

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getAllErrors = () => {
    return { ...validationErrors, ...errors };
  };

  const allErrors = getAllErrors();
  const hasFormErrors = Object.keys(allErrors).some(
    (key) =>
      key !== "general" &&
      key !== "backendDetails" &&
      key !== "errorType" &&
      allErrors[key]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* COMPONENTE DE ERROR MEJORADO */}
      {renderErrorSection()}

      {/* SECCIÓN DE CERTIFICADO */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <CheckCircleIcon className="h-5 w-5 mr-2 text-blue-600" />
          Seleccione un Certificado
        </h3>

        {renderFormField(
          "certification_id",
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Certificado *
            </label>
            <select
              required
              value={formData.certification_id}
              onChange={(e) =>
                updateFormData("certification_id", parseInt(e.target.value))
              }
              className={`block w-full focus:outline-none rounded-md shadow-sm p-2 border ${
                allErrors.certification_id
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              } focus:ring-2 transition-colors`}
            >
              <option value="">Seleccione un certificado</option>
              {availableCertifications.map((cert) => (
                <option
                  key={cert.certification_id}
                  value={cert.certification_id}
                >
                  {cert.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedCertification && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">
              {selectedCertification.title}
            </h4>
            <p className="text-sm text-blue-700 mb-2">
              {selectedCertification.description}
            </p>
            <div className="flex items-center text-sm text-blue-600">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>
                Duración: {selectedCertification.duration_in_minutes} minutos
              </span>
            </div>
          </div>
        )}
      </div>

      {/* SECCIÓN DE CONFIGURACIÓN */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
          Configuración de Asignación
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderFormField(
            "start_date",
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de inicio *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.start_date}
                onChange={(e) => updateFormData("start_date", e.target.value)}
                className={`block w-full focus:outline-none rounded-md shadow-sm p-2 border ${
                  allErrors.start_date
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                } focus:ring-2 transition-colors`}
              />
            </div>
          )}

          {renderFormField(
            "due_date",
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha límite *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.due_date}
                onChange={(e) => updateFormData("due_date", e.target.value)}
                className={`block w-full focus:outline-none rounded-md shadow-sm p-2 border ${
                  allErrors.due_date
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                } focus:ring-2 transition-colors`}
              />
            </div>
          )}

          {renderFormField(
            "is_randomized",
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preguntas aleatorias
              </label>
              <select
                value={formData.is_randomized ? "yes" : "no"}
                onChange={(e) =>
                  updateFormData("is_randomized", e.target.value === "yes")
                }
                className={`block w-full focus:outline-none rounded-md shadow-sm p-2 border ${
                  allErrors.is_randomized
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                } focus:ring-2 transition-colors`}
              >
                <option value="yes">Sí</option>
                <option value="no">No</option>
              </select>
            </div>
          )}

          {renderFormField(
            "questions_count",
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de preguntas asignadas
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={formData.questions_count || ""}
                onChange={(e) =>
                  updateFormData(
                    "questions_count",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                className={`block w-full focus:outline-none rounded-md shadow-sm p-2 border ${
                  allErrors.questions_count
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                } focus:ring-2 transition-colors`}
                placeholder="Ej: 20"
              />
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN DE AULAS */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
          Seleccionar Aulas ({selectedClassrooms.length} seleccionados)
        </h3>

        {renderFormField(
          "classroom_ids",
          <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
            {classroomsLoading ? (
              <div className="flex justify-center py-8">
                <div className="flex items-center space-x-2">
                  <ArrowPathIcon className="h-4 w-4 animate-spin text-gray-500" />
                  <span className="text-sm text-gray-500">
                    Cargando aulas...
                  </span>
                </div>
              </div>
            ) : classroomsError ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-700">
                  Error al cargar las aulas. Por favor, recargue la página.
                </p>
              </div>
            ) : classrooms && classrooms.length > 0 ? (
              <div className="space-y-3 p-2">
                {classrooms.map((classroom) => (
                  <div
                    key={classroom.classroom_id}
                    className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedClassrooms.includes(
                        classroom.classroom_id
                      )}
                      onChange={() =>
                        handleClassroomToggle(classroom.classroom_id)
                      }
                      id={`classroom-${classroom.classroom_id}`}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      disabled={isSubmitting}
                    />
                    <label
                      htmlFor={`classroom-${classroom.classroom_id}`}
                      className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer flex-1"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Aula: {classroom.code}
                          </p>
                          <p className="text-xs text-gray-500">
                            Turno: {classroom.Shift?.name} | Profesor:{" "}
                            {classroom.User?.userProfile?.first_name}{" "}
                            {classroom.User?.userProfile?.last_name} | Empresa:{" "}
                            {classroom.Enterprise?.name}
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500">
                  No hay aulas disponibles para asignar.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={
            isSubmitting ||
            selectedClassrooms.length === 0 ||
            !formData.certification_id ||
            hasFormErrors
          }
          className="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isSubmitting ? (
            <>
              <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
              Asignando...
            </>
          ) : (
            "Asignar Certificado"
          )}
        </button>
      </div>
    </form>
  );
};

export default AssignmentForm;
