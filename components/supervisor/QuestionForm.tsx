import React from 'react';
import { PlusCircleIcon, XCircleIcon } from 'lucide-react';
import { Question, Option } from '../../interfaces/Certification';

interface QuestionFormProps {
  currentQuestion: Question;
  onQuestionChange: (question: Question) => void;
  onAddQuestion: () => void;
  errors: { [key: string]: string };
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  currentQuestion,
  onQuestionChange,
  onAddQuestion,
  errors
}) => {
  const addOption = () => {
    if (currentQuestion.options.length >= 6) {
      alert('Máximo 6 opciones por pregunta');
      return;
    }

    const newOption: Option = {
      option_text: '',
      is_correct: false,
      option_order: currentQuestion.options.length + 1
    };

    onQuestionChange({
      ...currentQuestion,
      options: [...currentQuestion.options, newOption]
    });
  };

  const updateOption = (index: number, field: string, value: any) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    
    if (field === 'is_correct' && value === true && currentQuestion.type_id === 1) {
      updatedOptions.forEach((opt, i) => {
        if (i !== index) opt.is_correct = false;
      });
    }
    
    onQuestionChange({
      ...currentQuestion,
      options: updatedOptions
    });
  };

  const removeOption = (index: number) => {
    const updatedOptions = currentQuestion.options.filter((_, i) => i !== index)
      .map((opt, i) => ({ ...opt, option_order: i + 1 }));
    
    onQuestionChange({
      ...currentQuestion,
      options: updatedOptions
    });
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Preguntas del Certificado
        </h3>
      </div>

      {errors.questions && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.questions}</p>
        </div>
      )}

      {/* formulario para agregar nueva pregunta */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="font-medium text-gray-700 mb-4">
          Agregar Nueva Pregunta
        </h4>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Texto de la Pregunta *
            </label>
            <textarea
              value={currentQuestion.question_text}
              rows={3}
              onChange={(e) => onQuestionChange({ 
                ...currentQuestion, 
                question_text: e.target.value 
              })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Ingrese el texto de la pregunta"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Pregunta *
              </label>
              <select
                value={currentQuestion.type_id}
                onChange={(e) => onQuestionChange({ 
                  ...currentQuestion, 
                  type_id: parseInt(e.target.value),
                  options: currentQuestion.type_id === parseInt(e.target.value) ? 
                          currentQuestion.options : []
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <option value={1}>Opción Simple</option>
                <option value={2}>Opción Múltiple</option>
                <option value={3}>Verdadero/Falso</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Puntuación de la Pregunta *
              </label>
              <input
                type="number"
                min="1"
                value={currentQuestion.points_value}
                onChange={(e) => onQuestionChange({ 
                  ...currentQuestion, 
                  points_value: parseInt(e.target.value) || 1 
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="Ingrese la puntuación de la pregunta"
              />
            </div>
          </div>

          {/* Opciones para preguntas de tipo opción */}
          {[1, 2].includes(currentQuestion.type_id) && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Opciones *
                </label>
                <button
                  type="button"
                  onClick={addOption}
                  className="text-sm text-blue-600 hover:underline flex items-center"
                >
                  <PlusCircleIcon className="h-4 w-4 mr-1" />
                  Agregar Opción
                </button>
              </div>
              
              <div className="space-y-2">
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-white border rounded">
                    <input
                      type={currentQuestion.type_id === 1 ? "radio" : "checkbox"}
                      name="correct-option"
                      checked={option.is_correct}
                      onChange={(e) => updateOption(index, 'is_correct', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={option.option_text}
                      onChange={(e) => updateOption(index, 'option_text', e.target.value)}
                      className="flex-1 border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder={`Opción ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <XCircleIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {currentQuestion.options.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-2">
                    Agregue al menos 2 opciones
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Opciones predefinidas para Verdadero/Falso */}
          {currentQuestion.type_id === 3 && currentQuestion.options.length === 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 p-2 bg-white border rounded">
                <input
                  type="radio"
                  name="true-false"
                  checked={currentQuestion.options[0]?.is_correct || false}
                  onChange={() => onQuestionChange({
                    ...currentQuestion,
                    options: [
                      { option_text: 'Verdadero', is_correct: true, option_order: 1 },
                      { option_text: 'Falso', is_correct: false, option_order: 2 }
                    ]
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label className="flex-1 text-sm">Verdadero</label>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-white border rounded">
                <input
                  type="radio"
                  name="true-false"
                  checked={currentQuestion.options[1]?.is_correct || false}
                  onChange={() => onQuestionChange({
                    ...currentQuestion,
                    options: [
                      { option_text: 'Verdadero', is_correct: false, option_order: 1 },
                      { option_text: 'Falso', is_correct: true, option_order: 2 }
                    ]
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label className="flex-1 text-sm">Falso</label>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={onAddQuestion}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Agregar Pregunta al Certificado
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionForm;