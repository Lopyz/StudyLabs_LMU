export type OpenAIModel = 'gpt-3.5-turbo-16k' | 'gpt-4';

export interface Einzelverarbeitung {
  model: OpenAIModel;
  apiKey?: string | undefined;
  clerkId?: string | undefined;
  exercise_id: string;
  exercise_text: string;
  solution_correct: string;
  rubric_scoring: string;
  points_achievable: string;
  solution_student: Array<string>;
  systemprompt: string;
  topic: string;
  schemaId: string;
  schemaName?: string;
}

export interface Massenverarbeitung {
  model: OpenAIModel;
  apiKey?: string | undefined;
  clerkId?: string | undefined;
  exercises: any;
  exercise_id: string;
  exercise_text: string;
  solution_correct: string;
  rubric_scoring: string;
  points_achievable: string;
  solution_student: Array<string>;
  systemprompt: string;
  topic: string;
  schemaId: string;
  schemaName?: string;
}


export type UserObj = {
  username: string;
  gemachte_anfragen: any;
  verfügbare_anfragen: any;
  name: string;
  date: string;
  edit: string;
};

export interface ChatBody {
  inputCode: string;
  model: OpenAIModel;
}

export interface TaskType {
  exercise_id: string;
  exercise_text?: string;
  points_achievable: number;
}

export type ExcelDataType = {
  exercise_id: string;
  exercise_text: string;
  solution_student: string;
  points_achieved: number;
  points_achievable: number;
  solution_correct: string;
  feedback: string;
};