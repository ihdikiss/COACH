/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  PROFESSIONAL = 'professional'
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female'
}

export enum TrainingGoal {
  GENERAL_HEALTH = 'general_health',
  WEIGHT_LOSS = 'weight_loss',
  RACE_PREP = 'race_prep'
}

export interface UserProfile {
  age: number;
  weight: number; 
  height: number;
  gender: Gender;
  skillLevel: SkillLevel;
  goal: TrainingGoal;
}

export interface TrainingSessionPart {
  description: string;
  duration: string;
}

export interface TrainingDay {
  day: string;
  activityTitle: string;
  warmup: TrainingSessionPart;
  mainPart: TrainingSessionPart;
  cooldown: TrainingSessionPart;
  intensity: 'Low' | 'Medium' | 'High' | 'Max' | 'Rest';
  intensityIcon: '🟢' | '🟡' | '🔴' | '⚪';
  notes?: string;
  totalDuration: string;
}

export interface WeeklyPlan {
  week: number;
  weekName: string;
  days: TrainingDay[];
  focus: string;
  labInsight: string; // [مختبر علاوي للأداء]
  planningAdvice: string; // [نصيحة تخطيطية]
}

export interface MonthlyPlan {
  month: number;
  title: string;
  weeks: WeeklyPlan[];
}

export interface DayCompletion {
  month: number;
  week: number;
  dayIndex: number;
  completed: boolean;
  completedAt?: string;
  notes?: string;
}

export interface CoachingProgram {
  title: string;
  overview: string;
  months: MonthlyPlan[];
  safetyWarnings: string[];
}
