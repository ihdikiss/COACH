/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile, SkillLevel, TrainingGoal, Gender, ProgramType } from '../types';
import { GOAL_DEFINITIONS } from '../constants';
import { Activity, User, Target, ChevronRight, Weight, Users, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface UserFormProps {
  onSubmit: (profile: UserProfile) => void;
  onProfileChange: (profile: UserProfile) => void;
  isLoading: boolean;
}

export default function UserForm({ onSubmit, onProfileChange, isLoading }: UserFormProps) {
  const [formData, setFormData] = useState<UserProfile>({
    age: 25,
    weight: 70,
    height: 175,
    gender: Gender.MALE,
    skillLevel: SkillLevel.BEGINNER,
    goal: TrainingGoal.GENERAL_HEALTH,
    programType: ProgramType.WEEKLY
  });

  const updateFormData = (newData: Partial<UserProfile>) => {
    const updated = { ...formData, ...newData };
    setFormData(updated);
    onProfileChange(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bento-card flex flex-col justify-between h-full space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <span className="accent-bar bg-orange-500"></span> محاكي RUNZ (المدخلات)
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5 col-span-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">الجنس</span>
            <div className="grid grid-cols-2 gap-2">
              <button 
                type="button"
                onClick={() => updateFormData({gender: Gender.MALE})}
                className={`py-3 rounded-xl font-bold text-sm transition-all border-2 ${formData.gender === Gender.MALE ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-200'}`}
              >
                ذكر
              </button>
              <button 
                type="button"
                onClick={() => updateFormData({gender: Gender.FEMALE})}
                className={`py-3 rounded-xl font-bold text-sm transition-all border-2 ${formData.gender === Gender.FEMALE ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-200'}`}
              >
                أنثى
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">العمر</span>
            <input
              type="number"
              value={formData.age || ''}
              onChange={(e) => updateFormData({ age: e.target.value === '' ? 0 : Number(e.target.value) })}
              placeholder="0"
              className="w-full font-bold text-lg text-slate-900 bg-slate-100 px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">الوزن (كجم)</span>
            <input
              type="number"
              value={formData.weight || ''}
              onChange={(e) => updateFormData({ weight: e.target.value === '' ? 0 : Number(e.target.value) })}
              placeholder="0"
              className="w-full font-bold text-lg text-slate-900 bg-slate-100 px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div className="space-y-1.5 col-span-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">الطول (سم)</span>
            <input
              type="number"
              value={formData.height || ''}
              onChange={(e) => updateFormData({ height: e.target.value === '' ? 0 : Number(e.target.value) })}
              placeholder="0"
              className="w-full font-bold text-lg text-slate-900 bg-slate-100 px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div className="space-y-1.5 col-span-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">مستوى المهارة</span>
            <select
              value={formData.skillLevel}
              onChange={(e) => updateFormData({ skillLevel: e.target.value as SkillLevel })}
              className="w-full font-bold text-sm text-slate-900 bg-slate-100 px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-orange-500 appearance-none"
            >
              <option value={SkillLevel.BEGINNER}>مبتدئ (Progression 2:1)</option>
              <option value={SkillLevel.INTERMEDIATE}>متوسط (Progression 1:1)</option>
              <option value={SkillLevel.PROFESSIONAL}>محترف (Sharp Loading Wave)</option>
            </select>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">الهدف التدريبي</span>
            <select
              value={formData.goal}
              onChange={(e) => updateFormData({ goal: e.target.value as TrainingGoal })}
              className="w-full font-bold text-sm text-slate-900 bg-slate-100 px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-orange-500 appearance-none"
            >
              {Object.entries(GOAL_DEFINITIONS).map(([key, def]) => (
                <option key={key} value={key}>{def.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">طبيعة الجدول (نوع البرنامج)</span>
            <select
              value={formData.programType}
              onChange={(e) => updateFormData({ programType: e.target.value as ProgramType })}
              className="w-full font-bold text-sm text-slate-900 bg-slate-100 px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-orange-500 appearance-none"
            >
              <option value={ProgramType.WEEKLY}>برنامج أسبوعي كامل (5-6 أيام)</option>
              <option value={ProgramType.THREE_DAY}>برنامج مكثف تلات أيام فقط (Low Frequency)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              استخراج البرنامج التدريبي
              <ChevronRight size={18} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
