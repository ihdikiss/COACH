import React from 'react';
import { UserProfile, Gender, SkillLevel, TrainingGoal, ProgramType } from '../types';
import { GOAL_DEFINITIONS } from '../constants';
import { ChevronRight } from 'lucide-react';

interface UserFormProps {
  onSubmit: (profile: UserProfile) => void;
  onProfileChange: (profile: UserProfile) => void;
  isLoading: boolean;
}

export default function UserForm({ onSubmit, onProfileChange, isLoading }: UserFormProps) {
  const [formData, setFormData] = React.useState<UserProfile>({
    age: 30,
    weight: 75,
    height: 175,
    gender: Gender.MALE,
    skillLevel: SkillLevel.BEGINNER,
    goal: TrainingGoal.FITNESS,
    programType: ProgramType.WEEKLY
  });

  const updateFormData = (patch: Partial<UserProfile>) => {
    const updated = { ...formData, ...patch };
    setFormData(updated);
    onProfileChange(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bento-card flex flex-col justify-between h-full space-y-8" dir="rtl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <span className="accent-bar bg-green-500"></span> محاكي RUNZ (المدخلات)
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-slate-400">الجنس</label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                type="button"
                onClick={() => updateFormData({gender: Gender.MALE})}
                className={`py-3 rounded-xl font-bold text-sm transition-all border-2 ${formData.gender === Gender.MALE ? 'bg-slate-950 text-white border-slate-950 shadow-lg shadow-green-500/10' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-200'}`}
              >
                ذكر
              </button>
              <button 
                type="button"
                onClick={() => updateFormData({gender: Gender.FEMALE})}
                className={`py-3 rounded-xl font-bold text-sm transition-all border-2 ${formData.gender === Gender.FEMALE ? 'bg-slate-950 text-white border-slate-950 shadow-lg shadow-green-500/10' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-200'}`}
              >
                أنثى
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-slate-400">العمر</label>
            <input
              type="number"
              value={formData.age || ''}
              onChange={(e) => updateFormData({ age: e.target.value === '' ? 0 : Number(e.target.value) })}
              className="w-full font-bold text-lg text-slate-900 bg-slate-100 px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-slate-400">الوزن (كجم)</label>
            <input
              type="number"
              value={formData.weight || ''}
              onChange={(e) => updateFormData({ weight: e.target.value === '' ? 0 : Number(e.target.value) })}
              className="w-full font-bold text-lg text-slate-900 bg-slate-100 px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-slate-400">الطول (سم)</label>
            <input
              type="number"
              value={formData.height || ''}
              onChange={(e) => updateFormData({ height: e.target.value === '' ? 0 : Number(e.target.value) })}
              className="w-full font-bold text-lg text-slate-900 bg-slate-100 px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <label className="text-[10px] uppercase font-black tracking-widest text-slate-400">المستوى الحالي</label>
          <select
            value={formData.skillLevel}
            onChange={(e) => updateFormData({ skillLevel: e.target.value as SkillLevel })}
            className="w-full font-bold text-sm text-slate-900 bg-slate-100 px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-green-500"
          >
            <option value={SkillLevel.BEGINNER}>مبتدئ (Progression 2:1)</option>
            <option value={SkillLevel.INTERMEDIATE}>متوسط (Progression 1:1)</option>
            <option value={SkillLevel.ADVANCED}>متقدم (Progression 1:0.5)</option>
            <option value={SkillLevel.PRO}>محترف (Elite Logic)</option>
          </select>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <label className="text-[10px] uppercase font-black tracking-widest text-slate-400">الهدف التدريبي</label>
          <select
            value={formData.goal}
            onChange={(e) => updateFormData({ goal: e.target.value as TrainingGoal })}
            className="w-full font-bold text-sm text-slate-900 bg-slate-100 px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-green-500"
          >
            {Object.entries(GOAL_DEFINITIONS).map(([key, def]) => (
              <option key={key} value={key}>{def.label}</option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <label className="text-[10px] uppercase font-black tracking-widest text-slate-400">نوع وهيبة البرنامج</label>
          <select
            value={formData.programType}
            onChange={(e) => updateFormData({ programType: e.target.value as ProgramType })}
            className="w-full font-bold text-sm text-slate-900 bg-slate-100 px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-green-500"
          >
            <option value={ProgramType.WEEKLY}>برنامج أسبوعي كامل (5-6 أيام)</option>
            <option value={ProgramType.THREE_DAY}>برنامج مكثف تلات أيام فقط (Low Frequency)</option>
          </select>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-slate-950 hover:bg-black text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 shadow-xl group"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
          ) : (
            <>
              استخراج البرنامج التدريبي
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform rotate-180" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
