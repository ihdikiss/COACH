/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WeeklyPlan, DayCompletion } from '../types';
import { Calendar, Clock, Activity, Info, CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'motion/react';

interface WeekDisplayProps {
  plan: WeeklyPlan;
  completions: Record<string, DayCompletion>;
  onToggleDay: (dayIdx: number) => void;
  monthNumber: number;
}

export default function WeekDisplay({ plan, completions, onToggleDay, monthNumber }: WeekDisplayProps) {
  return (
    <div className="space-y-4">
      <div className="bento-card overflow-hidden !p-0">
        <div className="bg-slate-900 p-5 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-6 rounded-full bg-blue-500"></span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block leading-none mb-1">
                الاسبوع {plan.week} | {plan.weekName}
              </span>
              <h3 className="font-bold text-white leading-none">{plan.focus}</h3>
            </div>
          </div>
          <Calendar size={18} className="text-slate-500" />
        </div>
        
        <div className="p-4 space-y-3">
          {plan.days.map((day, idx) => {
            const key = `m${monthNumber}-w${plan.week}-d${idx}`;
            const isCompleted = completions[key]?.completed;

            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => onToggleDay(idx)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer group relative overflow-hidden ${
                  isCompleted 
                    ? 'bg-emerald-50 border-emerald-100 shadow-sm' 
                    : 'bg-white hover:bg-slate-50 border-slate-100'
                }`}
              >
                <div className="flex items-center justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className={`transition-colors ${isCompleted ? 'text-emerald-500' : 'text-slate-300 group-hover:text-slate-400'}`}>
                      {isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black text-slate-400 italic leading-none mb-1 uppercase">{day.day}</div>
                      <div className={`font-bold text-sm leading-tight flex items-center gap-2 ${isCompleted ? 'text-emerald-900 line-through opacity-60' : 'text-slate-900'}`}>
                        <span className="text-lg leading-none">{day.intensityIcon}</span>
                        {day.activityTitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 no-print">
                    <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg ${isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      <Clock size={10} />
                      {day.totalDuration}
                    </div>
                  </div>
                </div>

                {/* Detailed Parts - Collapse if completed to save space, but show on print */}
                <div className={`grid grid-cols-1 gap-2 pt-3 mt-3 border-t border-black/5 ${isCompleted ? 'hidden print:grid opacity-50' : 'grid'}`}>
                  <div className="flex items-start gap-2">
                    <span className="text-[9px] font-bold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded shrink-0">إحماء</span>
                    <div className="text-[11px] text-slate-600 leading-tight italic">
                      <span className="font-bold text-slate-400">({day.warmup.duration})</span> {day.warmup.description}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded shrink-0">رئيسي</span>
                    <div className="text-[11px] text-slate-900 leading-tight font-medium">
                      <span className="font-bold text-slate-400">({day.mainPart.duration})</span> {day.mainPart.description}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded shrink-0">تهدئة</span>
                    <div className="text-[11px] text-slate-600 leading-tight">
                      <span className="font-bold text-slate-400">({day.cooldown.duration})</span> {day.cooldown.description}
                    </div>
                  </div>
                </div>

                {day.notes && !isCompleted && (
                  <div className="text-[10px] text-slate-400 font-medium italic border-t border-slate-50 pt-2 mt-2 flex gap-2">
                    <Info size={12} className="shrink-0" />
                    {day.notes}
                  </div>
                )}
                
                {isCompleted && (
                  <div className="absolute top-2 left-2 text-[8px] font-black text-emerald-300 uppercase italic no-print">
                    Done
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lab Insight & Planning Advice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-blue-50 border border-blue-100 rounded-2xl p-5 relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 flex items-center gap-2">
              <Activity size={14} /> [مختبر علاوي للأداء]
            </div>
            <p className="text-xs text-blue-900 leading-relaxed font-medium">
              {plan.labInsight}
            </p>
          </div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-200/30 blur-3xl rounded-full"></div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2 flex items-center gap-2">
              <span className="text-base">📅</span> [نصيحة تخطيطية]
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed font-medium italic">
              {plan.planningAdvice}
            </p>
          </div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-200/20 blur-3xl rounded-full"></div>
        </motion.div>
      </div>
    </div>
  );
}
