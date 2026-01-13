export type Category = 'Logic' | 'Creative' | 'Human' | 'Systems';

export interface Flower {
  id: string;
  name: string;
  tag: string; // e.g., Tech, Art
  description: string;
  color: string; // Tailwind color class for border/bg
  icon: string; // Emoji or SVG path
}

export interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    category: Category;
  }[];
}

export interface Recommendation {
  category: Category;
  title: string;
  description: string;
  majors: string[];
  careers: string[];
}

export interface Scores {
  Logic: number;
  Creative: number;
  Human: number;
  Systems: number;
}

export type AppPhase = 'gallery' | 'pre-quiz' | 'quiz' | 'results';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}