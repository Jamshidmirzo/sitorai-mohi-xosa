export type Exhibit = {
  id: string;
  slug: string;
  tag: string;
  name: string;
  period: string;
  material: string;
  hall: string;
  bg: string;
  shot: string;
  story: string;
  image: string | null;
};

export type QuizQuestion =
  | {
      id: string;
      type: "choice";
      q: string;
      options: string[];
      answer: number;
      explain: string;
    }
  | {
      id: string;
      type: "text";
      q: string;
      accept: string[];
      answer: string;
      explain: string;
    };

export const QUIZ_TOTAL_SECONDS = 80;
