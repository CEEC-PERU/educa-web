export interface ResultModule {
    user_id : number, 
    puntaje : number,
    evaluation_id : number, 
    module_id: number | null | undefined;
}
  

export interface RequestResultModule {
    user_id: number; 
    puntaje: number;
    evaluation_id: number; 
    module_id: number | null | undefined;
    answers: {
        question_id: number;
        response: string | number | number[] | null; 
        response2: string | number | string[] | null; 
        isCorrect: boolean |string | null;
        isCorrect2: boolean[] | boolean |string  | null;
        score: number  | null
    }[];  // Añadimos el campo 'answers' que es un array de respuestas
}
