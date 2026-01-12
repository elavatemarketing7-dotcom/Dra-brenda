
export enum AppState {
  GATEWAY = 'GATEWAY',
  QUIZ = 'QUIZ',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  MAIN_SITE = 'MAIN_SITE'
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
}
