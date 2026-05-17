import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, ShieldCheck, TrendingUp, RotateCcw, Lock, ChevronRight, Activity } from 'lucide-react';
import { CoachingProgram, DayCompletion } from '../types';
import WeekDisplay from './WeekDisplay';

interface ProgramViewProps {
  program: CoachingProgram;
  onReset: () => void;
  completions: DayCompletion;
  onToggleDay: (key: string) => void;
  onUnlockNextMonth: () => void;
  isMonthLoading: boolean;
}

export default function ProgramView({ program, onReset, completions, onToggleDay, onUnlockNextMonth, isMonthLoading }: ProgramViewProps) {
  const [activeMonth, setActiveMonth] = useState(0);
  const currentMonth = program.months[activeMonth];

  // Logic for progression
  const monthCompletionsCount = Object.keys(completions).filter(k => k.startsWith(`${activeMonth}-`)).length;
  const totalMonthSessions = currentMonth.weeks.reduce((acc, w) => acc + w.sessions.length, 0);
  const progress = Math.round((monthCompletionsCount / totalMonthSessions) * 100);

  const canUnlockNext = progress >= 75 && activeMonth === program.months.length - 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" dir="rtl">
      {/* Top Banner / Program Overview */}
      <div className="lg:col-span-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/20 no-print">
            <LayoutGrid size={24} className="text-green-500" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic">{program.title}</h2>
            <p className="text-slate-400 text-sm italic">{program.overview.substring(0, 80)}...</p>
          </div>
        </div>
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-slate-400 hover:text-red-500 font-bold transition-colors text-sm uppercase underline decoration-2 underline-offset-8 no-print"
        >
          <RotateCcw size={16} />
          <span>توليد برنامج بديل</span>
        </button>
      </div>

      {/* Main Timeline Column */}
      <div className="lg:col-span-8 space-y-12">
        <div className="flex flex-wrap gap-4 no-print">
          {program.months.map((m, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveMonth(idx)}
              className={`flex-1 min-w-[120px] py-4 rounded-2xl font-black text-sm transition-all ${
                activeMonth === idx 
                  ? 'bg-slate-950 text-white shadow-xl shadow-green-500/5' 
                  : 'text-slate-400 hover:text-slate-600 border border-slate-200'
              }`}
            >
              الشهر {m.month}: {m.title}
            </button>
          ))}
          <button 
             onClick={onUnlockNextMonth}
             disabled={isMonthLoading || !canUnlockNext}
             className={`flex-1 min-w-[150px] py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 border-2 border-dashed ${
               canUnlockNext 
                 ? 'border-green-500 text-green-600 bg-green-50 hover:bg-green-100 animate-pulse'
                 : 'border-slate-300 text-slate-300 cursor-not-allowed'
             }`}
          >
            {isMonthLoading ? 'جاري التوليد...' : canUnlockNext ? 'فتح الشهر التالي 🔓' : 'أكمل 75% لفتح الشهر 🔒'}
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeMonth}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
            {currentMonth.weeks.map((week, idx) => (
              <WeekDisplay 
                key={idx} 
                week={week} 
                monthIdx={activeMonth}
                completions={completions} 
                onToggleDay={onToggleDay} 
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sidebar Stats Column */}
      <div className="lg:col-span-4 bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden h-full">
        <div className="relative z-10 space-y-8">
          <h3 className="text-xl font-bold flex items-center gap-3">
            <span className="accent-bar bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span> نظام الالتزام (Gamification)
          </h3>
          
          <div className="space-y-6">
            <div className="bg-slate-800/50 p-6 rounded-3xl border border-white/5">
              <div className="flex justify-between items-end mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-green-500">إنجاز الشهر {currentMonth.month}</span>
                <span className="text-2xl font-black italic">{progress}%</span>
              </div>
              <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-4 leading-relaxed italic">
                * الوصول لنسبة 75% يفتح لك إمكانية توليد الشهر التدريبي التالي بناءً على استجابتك الفسيولوجية.
              </p>
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">نصائح فنية للمرحلة</span>
              <ul className="space-y-3">
                {program.safetyWarnings.slice(0, 3).map((w, i) => (
                  <li key={i} className="text-slate-400 text-xs leading-relaxed flex gap-2">
                    <ShieldCheck className="text-green-500 shrink-0" size={14} />
                    {w}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8 border-t border-slate-800">
               <div className="flex flex-col gap-4 text-xs">
                <div className="flex items-center gap-2 font-black uppercase tracking-tighter text-slate-500">دليل الخارطة اللونية:</div>
                <div className="flex items-center gap-2"><span className="text-lg">📅</span> <span>استشفاء وتثبيت</span></div>
                <div className="flex items-center gap-2"><span className="text-lg">🚀</span> <span>زيادة حجم/سرعة</span></div>
                <div className="flex items-center gap-2"><span className="text-lg">🧘‍♂️</span> <span>راحة إيجابية</span></div>
                <div className="flex items-center gap-2">⚪ <span className="text-slate-500">حمل منخفض (120-140 bpm)</span></div>
                <div className="flex items-center gap-2">🟢 <span className="text-slate-500">حمل متوسط (140-160 bpm)</span></div>
                <div className="flex items-center gap-2">🟢🟢 <span className="text-slate-500">حمل عالٍ/قمة (160+ bpm)</span></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Abstract background graphics */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-3xl -z-0"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-blue-500/10 blur-2xl -z-0"></div>
      </div>
    </div>
  );
}
