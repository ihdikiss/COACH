/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CoachingProgram, DayCompletion } from '../types';
import WeekDisplay from './WeekDisplay';
import { AlertTriangle, Download, RefreshCw, ChevronLeft, ChevronRight, LayoutGrid, List, Printer, Info, Lock, Zap, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProgramViewProps {
  program: CoachingProgram;
  onReset: () => void;
  completions: Record<string, DayCompletion>;
  onToggleDay: (month: number, week: number, dayIndex: number) => void;
  onUnlockNextMonth: () => void;
  isMonthLoading: boolean;
}

export default function ProgramView({ 
  program, 
  onReset, 
  completions, 
  onToggleDay, 
  onUnlockNextMonth,
  isMonthLoading 
}: ProgramViewProps) {
  const [activeMonth, setActiveMonth] = useState(0);
  const currentMonth = program.months[activeMonth];

  const calculateMonthProgress = (monthIndex: number) => {
    const month = program.months[monthIndex];
    if (!month) return 0;
    
    let completedCount = 0;
    month.weeks.forEach(week => {
      week.days.forEach((_, dayIdx) => {
        const key = `m${month.month}-w${week.week}-d${dayIdx}`;
        if (completions[key]?.completed) completedCount++;
      });
    });
    
    const totalDays = month.weeks.length * 7;
    return Math.round((completedCount / totalDays) * 100);
  };

  const progress = calculateMonthProgress(activeMonth);
  const isLatestMonth = activeMonth === program.months.length - 1;
  const canUnlockNext = isLatestMonth && progress >= 80 && program.months.length < 3;

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
            <p className="text-slate-500 font-medium max-w-2xl">بوابة RUNZ - مرحلي تدريجي (Commitment Architecture)</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 no-print">
          <button 
            onClick={() => { 
              if (window.confirm('هل أنت متأكد أنك تريد طباعة هذا البرنامج؟')) {
                window.focus(); 
                window.print(); 
              }
            }}
            className="flex items-center gap-2 px-6 py-4 text-xs font-black uppercase bg-slate-900 text-white rounded-2xl hover:bg-black transition-all shadow-lg active:scale-95"
          >
            <Printer size={16} />
            طباعة البرنامج
          </button>
          <button 
            onClick={onReset}
            className="flex items-center gap-2 px-6 py-4 text-xs font-black uppercase text-orange-600 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-all border border-orange-200"
          >
            <RefreshCw size={16} />
            إعادة ضبط
          </button>
        </div>
      </div>

      {/* Logic Filter Card (Dark Left Panel) */}
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
                * يتطلب فتح الشهر التالي إكمال 80% على الأقل من حصص الشهر الحالي لضمان التكيف الفسيولوجي.
              </p>
            </div>

            <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">توصيات السلامة</span>
              <ul className="space-y-3">
                {program.safetyWarnings.slice(0, 3).map((w, i) => (
                  <li key={i} className="text-slate-400 text-xs leading-relaxed flex gap-2">
                    <ShieldCheck className="text-green-500 shrink-0" size={14} />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Month Navigator & Weekly Plans */}
      <div className="lg:col-span-8 space-y-6">
        <div className="flex p-2 bg-slate-200/50 rounded-3xl gap-2 overflow-x-auto no-print">
          {program.months.map((m, idx) => (
            <button
              key={idx}
              onClick={() => setActiveMonth(idx)}
              className={`flex-1 min-w-[120px] py-4 rounded-2xl font-black text-sm transition-all ${
                activeMonth === idx 
                  ? 'bg-slate-950 text-white shadow-xl shadow-green-500/5' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              الشهر {m.month}
            </button>
          ))}
          {program.months.length < 3 && (
            <button
               disabled={!canUnlockNext || isMonthLoading}
               onClick={onUnlockNextMonth}
               className={`flex-1 min-w-[150px] py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 border-2 border-dashed ${
                 canUnlockNext 
                   ? 'border-green-500 text-green-600 bg-green-50 hover:bg-green-100 animate-pulse'
                   : 'border-slate-300 text-slate-300 cursor-not-allowed'
               }`}
            >
              {isMonthLoading ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <>
                  {canUnlockNext ? <Zap size={16} /> : <Lock size={16} />}
                  فتح الشهر {program.months.length + 1}
                </>
              )}
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeMonth}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start"
          >
            {currentMonth.weeks.map((week, idx) => (
              <div key={idx} className="print-break-inside-avoid">
                <WeekDisplay 
                  plan={week} 
                  completions={completions}
                  onToggleDay={(dayIdx) => onToggleDay(currentMonth.month, week.week, dayIdx)}
                  monthNumber={currentMonth.month}
                />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Print Only: Legend & Note Space */}
        <div className="print-only mt-10 space-y-6 pt-10 border-t-2 border-slate-900">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-black text-slate-900 flex items-center gap-2 border-b-2 border-slate-200 pb-2">
                <Info size={16} /> مفتاح الرموز والمفاهيم
              </h4>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex items-center gap-2"><span className="text-lg">📅</span> <span>استشفاء وتثبيت</span></div>
                <div className="flex items-center gap-2"><span className="text-lg">🚀</span> <span>زيادة حجم/سرعة</span></div>
                <div className="flex items-center gap-2"><span className="text-lg">🧘‍♂️</span> <span>راحة إيجابية</span></div>
                <div className="flex items-center gap-2">⚪ <span className="text-slate-500">حمل منخفض (120-140 bpm)</span></div>
                <div className="flex items-center gap-2">🟢 <span className="text-slate-500">حمل متوسط (140-160 bpm)</span></div>
                <div className="flex items-center gap-2">🟢🟢 <span className="text-slate-500">حمل عالٍ/قمة (160+ bpm)</span></div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-black text-slate-900 flex items-center gap-2 border-b-2 border-slate-200 pb-2">
                سجل الملاحظات (Manual Log)
              </h4>
              <div className="h-32 border border-slate-200 rounded-xl bg-slate-50/50"></div>
              <p className="text-[10px] text-slate-400">
                استخدم هذه المساحة لكتابة شعورك البدني، النبض الحقيقي، أو أي عوارض صحية بعد الحصص التدريبية.
              </p>
            </div>
          </div>
          
          <div className="text-center pt-6 grayscale opacity-50">
            <p className="text-[10px] font-bold">ALLAWI SCIENTIFIC LOGIC V2 | RUNZ ENGINE REPORT</p>
          </div>
        </div>
      </div>
    </div>
  );
}
