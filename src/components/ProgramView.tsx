/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CoachingProgram } from '../types';
import WeekDisplay from './WeekDisplay';
import { AlertTriangle, Download, RefreshCw, ChevronLeft, ChevronRight, LayoutGrid, List, Printer, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProgramViewProps {
  program: CoachingProgram;
  onReset: () => void;
}

export default function ProgramView({ program, onReset }: ProgramViewProps) {
  const [activeMonth, setActiveMonth] = useState(0);
  const currentMonth = program.months[activeMonth];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" dir="rtl">
      {/* Top Banner / Program Overview */}
      <div className="lg:col-span-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 no-print">
            <LayoutGrid size={24} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic">{program.title}</h2>
            <p className="text-slate-500 font-medium max-w-2xl">بوابة RUNZ - منطق علاوي للتدريب المتدرج (Allawi Cycle Architecture)</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 no-print">
          <button 
            onClick={() => { window.focus(); window.print(); }}
            className="flex items-center gap-2 px-6 py-4 text-xs font-black uppercase bg-slate-900 text-white rounded-2xl hover:bg-black transition-all shadow-lg active:scale-95"
          >
            <Printer size={16} />
            طباعة البرنامج (PDF)
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
      <div className="lg:col-span-5 bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden h-full">
        <div className="relative z-10 space-y-8">
          <h3 className="text-xl font-bold flex items-center gap-3">
            <span className="accent-bar bg-blue-500"></span> فلتر منطق علاوي (Logic Layer)
          </h3>
          
          <div className="space-y-6">
            <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 block mb-2">توصيات السلامة والشدة</span>
              <ul className="space-y-4">
                {program.safetyWarnings.map((w, i) => (
                  <li key={i} className="text-slate-300 text-sm leading-relaxed flex gap-3">
                    <AlertTriangle className="text-orange-500 shrink-0" size={18} />
                    {w}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-emerald-500/10 p-6 rounded-3xl border border-emerald-500/20">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block mb-1">الطور التدريبي الحالي</span>
              <p className="text-white font-black text-2xl italic leading-none">{currentMonth.title}</p>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-600/10 blur-[100px] rounded-full"></div>
      </div>

      {/* Month Navigator & Weekly Plans */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex p-2 bg-slate-200/50 rounded-3xl gap-2 overflow-x-auto scrollbar-hide">
          {program.months.map((m, idx) => (
            <button
              key={idx}
              onClick={() => setActiveMonth(idx)}
              className={`flex-1 min-w-[120px] py-4 rounded-2xl font-black text-sm transition-all ${
                activeMonth === idx 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              الشهر {m.month}
            </button>
          ))}
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
                <WeekDisplay plan={week} />
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
                <div className="flex items-center gap-2">🟢 <span className="text-slate-500">حمل منخفض (120-140 bpm)</span></div>
                <div className="flex items-center gap-2">🟡 <span className="text-slate-500">حمل متوسط (140-160 bpm)</span></div>
                <div className="flex items-center gap-2">🔴 <span className="text-slate-500">حمل عالٍ/قمة (160+ bpm)</span></div>
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
