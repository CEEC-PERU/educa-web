
  export interface RequestCourseResult {
      evaluation_id: number ,
        course_id: number,
        puntaje: number,
        user_id: number,
        second_chance: boolean,
      answers: {
          question_id: number;
          response: string | number | number[] | null; 
          response2: string | number | string[] | null; 
          isCorrect: boolean |string | null;
          isCorrect2: boolean[] | boolean |string  | null;
          score: number  | null
      }[];  // Añadimos el campo 'answers' que es un array de respuestas
  }
  