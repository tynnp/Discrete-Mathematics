export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
  topic: string;
}

export interface QuizSession {
  questions: Question[];
  userAnswers: (number | null)[];
  isCompleted: boolean;
  score: number;
}

export interface TopicConfig {
  name: string;
  description: string;
  examples: string[];
}