import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Flame, Zap } from 'lucide-react';
import { WeeklyPlan, DayCompletion } from '../types';

interface WeekDisplayProps {
  week: WeeklyPlan;
  monthIdx: number;
  completions: DayCompletion;
  onToggleDay: (key: string) => void;
}

export default function WeekDisplay({ week, monthIdx, completions, onToggleDay }: WeekDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-sm italic">
          {week.week}
        </div>
        <h4 className="text-xl font-bold text-slate-900">{week.focus}</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {week.sessions.map((session, sIdx) => {
          const key = `${monthIdx}-${week.week}-${session.day}`;
          const isDone = completions[key];
          
          return (
            <motion.div 
              key={sIdx}
              whileHover={{ y: -4 }}
              onClick={() => onToggleDay(key)}
              className={`p-4 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${
                isDone 
                  ? 'bg-green-50 border-green-200' 
                  : session.intensity === 'rest' 
                    ? 'bg-slate-50 border-slate-100 opacity-60' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Day Header */}
              <div className="flex justify-between items-start mb-3">
                <span className={`text-[10px] font-black uppercase tracking-widest ${isDone ? 'text-green-600' : 'text-slate-400'}`}>
                  {session.day}
                </span>
                {isDone ? (
                  <CheckCircle2 className="text-green-500" size={16} />
                ) : (
                  <Circle className="text-slate-200 group-hover:text-slate-300" size={16} />
                )}
              </div>

              {/* Title & Activity */}
              <div className="space-y-1 mb-4">
                <h5 className={`font-black text-sm italic leading-tight ${isDone ? 'text-green-900' : 'text-slate-900'}`}>
                  {session.activity}
                </h5>
                <p className="text-[10px] text-slate-500 line-clamp-2">{session.type}</p>
              </div>

              {/* Specs */}
              <div className="flex items-center gap-2 mt-auto">
                {session.intensity !== 'rest' && (
                  <>
                    <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                      <Clock size={10} />
                      {session.duration}
                    </div>
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      session.intensity === 'high' ? 'bg-red-500' : 
                      session.intensity === 'medium' ? 'bg-orange-400' : 'bg-green-400'
                    }`} />
                  </>
                )}
              </div>

              {/* Done Overlay */}
              {isDone && (
                <div className="absolute top-0 right-0 p-1 opacity-10">
                  <Flame size={40} className="text-green-600" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
