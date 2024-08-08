// interfaces/Video.ts
export interface Video {
    video_id?: number;
    orden: number;
    video_enlace: string;
    question: string;
    correct_answer: string;
    incorrect_answer: string[];
    session_id: number;
  }