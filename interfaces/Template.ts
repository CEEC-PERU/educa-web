
  // Interface para QuestionTemplate
export interface QuestionTemplate {
    quest_temp_id: number; // ID unico de la pregunta
    question: string; // Texto de la pregunta
    type: 'open' | 'closed'; // Tipo de pregunta ('open' para texto libre, 'closed' para opciones)
    options: string[] | null; // Opciones disponibles (para preguntas cerradas) o null para abiertas
    createdAt: string; // Fecha de creacion
    updatedAt: string; // Fecha de actualizacion
    template_id: number; // Relacion con la plantilla
  }
  
  // Interface para Template
 export  interface Template {
    template_id: number; // ID unico de la plantilla
    name: string; // Nombre de la plantilla
    is_active: boolean; // Estado de la plantilla (activa o no)
    createdAt: string; // Fecha de creacion
    updatedAt: string; // Fecha de actualizacion
    QuestionTemplates: QuestionTemplate[]; // Preguntas asociadas a la plantilla
  }
  