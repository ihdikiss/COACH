export enum Gender {
  MALE = 'male',
  FEMALE = 'female'
}

export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  PRO = 'pro'
}

export enum TrainingGoal {
  FITNESS = 'fitness',
  WEIGHT_LOSS = 'weight_loss',
  RACE = 'race'
}

export enum ProgramType {
  WEEKLY = 'weekly_full',
  THREE_DAY = 'three_day_condensed'
}

export enum AppView {
  LANDING = 'landing',
  REGISTER = 'register',
  LOGIN = 'login',
  MAIN_APP = 'main_app'
}

export interface UserProfile {
  age: number;
  weight: number;
  height: number;
  gender: Gender;
  skillLevel: SkillLevel;
  goal: TrainingGoal;
  programType: ProgramType;
}

export interface TrainingSession {
  day: string;
  activity: string;
  description: string;
  intensity: 'low' | 'medium' | 'high' | 'rest';
  duration: string;
  type: string;
}

export interface WeeklyPlan {
  week: number;
  sessions: TrainingSession[];
  focus: string;
}

export interface MonthlyPlan {
  month: number;
  title: string;
  weeks: WeeklyPlan[];
}

export interface CoachingProgram {
  title: string;
  overview: string;
  months: MonthlyPlan[];
  safetyWarnings: string[];
}

export interface DayCompletion {
  [key: string]: boolean; // format: "month-week-day"
}
