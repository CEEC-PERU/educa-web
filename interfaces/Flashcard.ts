// types.ts
export interface Option {
    option_id: number;
    option_text: string;
    is_correct: boolean;
  }
  
  export interface Question {
    question_id: number;
    question_text: string;
    options: Option[];
  }
  
  export interface FlashcardData {
    flashcard_id: number;
    name: string;
    description: string;
    questions: Question[];
  }
  