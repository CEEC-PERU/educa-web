// types.ts

export interface Flashcard {
  flashcard_id: number;
  question: string;
  correct_answer: string[];
  incorrect_answer: string[];
  module_id: number;
  created_at?: string;
  updated_at?: string;
}
