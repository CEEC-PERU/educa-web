import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTemplates } from "../../hooks/useTemplate";
import { useAnswerTemplate } from "../../hooks/useAnswerTemplate";
import { QuestionTemplate } from "../../interfaces/Template";

const SurveyModal = () => {
  const { user } = useAuth();
  const { templates } = useTemplates();
  const { createAnswerTemplateUser } = useAnswerTemplate();

  const [showPopup, setShowPopup] = useState(false);
  const [responses, setResponses] = useState<{ [key: number]: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const activeTemplate = templates.find((t) => t.is_active);
  const userId = (user as { id: number })?.id;

  const handleResponseChange = (questionId: number, answer: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    const unanswered = activeTemplate?.QuestionTemplates.filter(
      (q) => !responses[q.quest_temp_id],
    );

    if (unanswered && unanswered.length > 0) {
      setFormError("Por favor responde todas las preguntas.");
      return;
    }

    const answerTemplates = activeTemplate?.QuestionTemplates.map((q) => {
      const response = responses[q.quest_temp_id];
      return q.type === "closed"
        ? { quest_temp_id: q.quest_temp_id, user_id: userId, selectedOption: response || null, openResponse: null }
        : { quest_temp_id: q.quest_temp_id, user_id: userId, selectedOption: null, openResponse: response || null };
    });

    if (!answerTemplates?.length) return;

    setIsSubmitting(true);
    try {
      await createAnswerTemplateUser(answerTemplates);
      setShowPopup(false);
      setResponses({});
      setFormError(null);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch {
      setFormError("Ocurrió un error al enviar tu respuesta. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowPopup(true)}
        className="fixed top-5 right-5 z-50 bg-red-500 rounded-full p-3 text-white"
        aria-label="Abrir encuesta"
      >
        <span className="text-2xl">🔔</span>
        {activeTemplate && (
          <span className="absolute top-0 right-0 bg-white text-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            1
          </span>
        )}
      </button>

      {showPopup && activeTemplate && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[60]"
            onClick={() => setShowPopup(false)}
          />
          <div className="fixed top-0 right-0 h-full bg-white p-8 shadow-xl z-[70] w-full max-w-lg flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-indigo-700">
                Formulario de Encuesta
              </h2>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Cerrar"
              >
                <span className="text-xl">✕</span>
              </button>
            </div>

            <form className="flex-1 overflow-y-auto space-y-6">
              {activeTemplate.QuestionTemplates.map(
                (question: QuestionTemplate) => (
                  <div key={question.quest_temp_id}>
                    <label className="block text-sm font-medium text-indigo-600 mb-2">
                      {question.question}
                    </label>
                    {question.type === "closed" ? (
                      <select
                        value={responses[question.quest_temp_id] || ""}
                        onChange={(e) =>
                          handleResponseChange(
                            question.quest_temp_id,
                            e.target.value,
                          )
                        }
                        className="block w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="" disabled>
                          Seleccione una opción
                        </option>
                        {question.options?.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={responses[question.quest_temp_id] || ""}
                        onChange={(e) =>
                          handleResponseChange(
                            question.quest_temp_id,
                            e.target.value,
                          )
                        }
                        className="block w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Escriba su respuesta"
                      />
                    )}
                  </div>
                ),
              )}

              {formError && (
                <p className="text-red-500 text-sm">{formError}</p>
              )}
            </form>

            <div className="pt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </div>
        </>
      )}

      {submitSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg z-[70]">
          ¡Encuesta enviada satisfactoriamente!
        </div>
      )}
    </>
  );
};

export default SurveyModal;
