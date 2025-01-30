// interfaces/AnswerTemplate.ts

export interface AnswerTemplate {
    quest_temp_id: number;      // ID de la pregunta asociada
    user_id: number;            // ID del usuario que responde
    selectedOption?: string | null;    // Opción seleccionada para preguntas cerradas (si aplica)
    openResponse?: string | null;      // Respuesta abierta para preguntas abiertas (si aplica)
}
  