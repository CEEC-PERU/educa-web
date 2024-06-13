export interface Evaluation {
    evaluation_id: number;
    name: string;
    description: string;
    created_at?: string;
    updated_at?: string;
}

export interface Question {
    question_id: number;
    evaluation_id: number;
    question_text: string;
    type_id: number;
    created_at?: string;
    updated_at?: string;
}

export interface Option {
    option_id: number;
    question_id: number;
    option_text: string;
    is_correct: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface QuestionType {
    type_id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
}
