import React, { useState } from "react";
import { PlusCircleIcon, XCircleIcon, FileSpreadsheet } from "lucide-react";
import { Question, Option } from "../../interfaces/Certification";
import ExcelUploader from "../Certification/ExcelUploader";

interface QuestionFormProps {
  currentQuestion: Question;
  onQuestionChange: (question: Question) => void;
  onAddQuestion: () => void;
  onAddMultipleQuestions: (questions: Question[]) => void;
  errors: { [key: string]: string };
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  currentQuestion,
  onQuestionChange,
  onAddQuestion,
  onAddMultipleQuestions,
  errors,
}) => {
  const [showExcelUploader, setShowExcelUploader] = useState(false);

  const addOption = () => {
    if (currentQuestion.options.length >= 6) {
      alert("Máximo 6 opciones por pregunta");
      return;
    }

    const newOption: Option = {
      option_text: "",
      is_correct: false,
      option_order: currentQuestion.options.length + 1,
    };

    onQuestionChange({
      ...currentQuestion,
      options: [...currentQuestion.options, newOption],
    });
  };

  const updateOption = (index: number, field: string, value: any) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };

    // Para opción simple, cuando se marca una como correcta, desmarcar las demás
    if (field === "is_correct" && value === true) {
      updatedOptions.forEach((opt, i) => {
        if (i !== index) opt.is_correct = false;
      });
    }

    onQuestionChange({
      ...currentQuestion,
      options: updatedOptions,
    });
  };

  const removeOption = (index: number) => {
    if (currentQuestion.options.length <= 2) {
      alert("Mínimo 2 opciones por pregunta");
      return;
    }

    const updatedOptions = currentQuestion.options
      .filter((_, i) => i !== index)
      .map((opt, i) => ({ ...opt, option_order: i + 1 }));

    onQuestionChange({
      ...currentQuestion,
      options: updatedOptions,
    });
  };

  // Validar si se puede agregar la pregunta
  const canAddQuestion = () => {
    return (
      currentQuestion.question_text.trim() !== "" &&
      currentQuestion.points_value > 0 &&
      currentQuestion.options.length >= 2 &&
      currentQuestion.options.some((opt) => opt.is_correct) &&
      currentQuestion.options.every((opt) => opt.option_text.trim() !== "")
    );
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Preguntas del Certificado
        </h3>
        <button
          type="button"
          onClick={() => setShowExcelUploader(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Cargar desde Excel
        </button>
      </div>

      {showExcelUploader && (
        <ExcelUploader
          onQuestionsLoaded={(questions) => {
            onAddMultipleQuestions(questions);
            setShowExcelUploader(false);
          }}
          onClose={() => setShowExcelUploader(false)}
        />
      )}

      {errors.questions && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.questions}</p>
        </div>
      )}

      {/* formulario para agregar nueva pregunta */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="font-medium text-gray-700 mb-4">
          Agregar Nueva Pregunta (Opción Simple)
        </h4>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Texto de la Pregunta *
            </label>
            <textarea
              value={currentQuestion.question_text}
              rows={3}
              onChange={(e) =>
                onQuestionChange({
                  ...currentQuestion,
                  question_text: e.target.value,
                })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Ingrese el texto de la pregunta"
            />
            {errors.question_text && (
              <p className="text-sm text-red-600 mt-1">
                {errors.question_text}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Pregunta
              </label>
              <input
                type="text"
                value="Opción Simple"
                readOnly
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Puntuación de la Pregunta *
              </label>
              <input
                type="number"
                min="1"
                readOnly
                value={currentQuestion.points_value}
                onChange={(e) =>
                  onQuestionChange({
                    ...currentQuestion,
                    points_value: parseInt(e.target.value) || 1,
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="Ingrese la puntuación de la pregunta"
              />
              {errors.points_value && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.points_value}
                </p>
              )}
            </div>
          </div>

          {/* Opciones para preguntas de tipo opción simple */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Opciones de Respuesta *
                <span className="text-xs text-gray-500 ml-2">
                  (Selecciona la respuesta correcta)
                </span>
              </label>
              <button
                type="button"
                onClick={addOption}
                disabled={currentQuestion.options.length >= 6}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlusCircleIcon className="h-4 w-4 mr-1" />
                Añadir Opción
              </button>
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <input
                    type="radio"
                    name="correct-option"
                    checked={option.is_correct}
                    onChange={(e) =>
                      updateOption(index, "is_correct", e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={option.option_text}
                    onChange={(e) =>
                      updateOption(index, "option_text", e.target.value)
                    }
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder={`Escribe la opción ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    disabled={currentQuestion.options.length <= 2}
                    className="text-red-600 hover:text-red-800 p-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title={
                      currentQuestion.options.length <= 2
                        ? "Mínimo 2 opciones requeridas"
                        : "Eliminar opción"
                    }
                  >
                    <XCircleIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {currentQuestion.options.length === 0 && (
                <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-sm text-gray-500">
                    No hay opciones agregadas
                  </p>
                  <button
                    type="button"
                    onClick={addOption}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center justify-center mx-auto"
                  >
                    <PlusCircleIcon className="h-4 w-4 mr-1" />
                    Agregar primera opción
                  </button>
                </div>
              )}
            </div>

            {errors.options && (
              <p className="text-sm text-red-600 mt-2">{errors.options}</p>
            )}

            {/* Información de validación */}
            <div className="mt-3 space-y-1">
              {currentQuestion.options.length < 2 && (
                <p className="text-xs text-red-600">
                  ✗ Se requieren al menos 2 opciones
                </p>
              )}
              {currentQuestion.options.length >= 2 &&
                !currentQuestion.options.some((opt) => opt.is_correct) && (
                  <p className="text-xs text-red-600">
                    ✗ Selecciona una opción como correcta
                  </p>
                )}
              {currentQuestion.options.some(
                (opt) => !opt.option_text.trim()
              ) && (
                <p className="text-xs text-red-600">
                  ✗ Todas las opciones deben tener texto
                </p>
              )}
              {canAddQuestion() && (
                <p className="text-xs text-green-600">
                  ✓ La pregunta está lista para agregar
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onAddQuestion}
            disabled={!canAddQuestion()}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Agregar Pregunta al Certificado
          </button>

          {/* Indicadores de estado */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Tipo: Opción Simple (solo una respuesta correcta)</p>
            <p>• Mínimo: 2 opciones, Máximo: 6 opciones</p>
            <p>• Una opción debe marcarse como correcta</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionForm;
