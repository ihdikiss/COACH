import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Activity, Heart, Scale } from 'lucide-react';
import { UserProfile, SkillLevel } from '../types';

interface HealthReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export default function HealthReportModal({ isOpen, onClose, profile }: HealthReportModalProps) {
  if (!isOpen) return null;

  // Simple BMI Logic
  const heightMeters = profile.height / 100;
  const bmi = profile.weight / (heightMeters * heightMeters);
  
  const getBmiStatus = () => {
    if (bmi < 18.5) return { label: 'تحت الوزن', color: 'text-orange-500' };
    if (bmi < 25) return { label: 'وزن مثالي للعداء', color: 'text-green-500' };
    if (bmi < 30) return { label: 'وزن زائد', color: 'text-orange-500' };
    return { label: 'سمنة (تعديل الحمل ضروري)', color: 'text-red-500' };
  };

  const status = getBmiStatus();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl"
      >
        <div className="bg-slate-900 p-8 text-white flex justify-between items-center border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center">
              <ShieldAlert size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black italic uppercase">تقرير الجاهزية الطبية</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Medical Clearance & Safety Dashboard</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">إغلاق</button>
        </div>

        <div className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center text-center gap-2">
              <Scale className="text-blue-500" size={24} />
              <span className="text-[10px] font-black uppercase text-slate-400">مؤشر كتلة الجسم</span>
              <span className="text-3xl font-black text-slate-900">{bmi.toFixed(1)}</span>
              <span className={`text-xs font-bold ${status.color}`}>{status.label}</span>
            </div>
            
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center text-center gap-2">
              <Heart className="text-red-500" size={24} />
              <span className="text-[10px] font-black uppercase text-slate-400">معدل النبض المتوقع</span>
              <span className="text-3xl font-black text-slate-900">{220 - profile.age}</span>
              <span className="text-xs font-bold text-slate-400 italic">MHR (bpm)</span>
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center text-center gap-2">
              <Activity className="text-green-500" size={24} />
              <span className="text-[10px] font-black uppercase text-slate-400">تصنيف الخطر</span>
              <span className={`text-3xl font-black ${profile.skillLevel === SkillLevel.BEGINNER && bmi > 27 ? 'text-red-500' : 'text-slate-900'}`}>
                {profile.skillLevel === SkillLevel.BEGINNER && bmi > 27 ? 'متوسط' : 'منخفض'}
              </span>
              <span className="text-xs font-bold text-slate-400 italic">Injury Risk Level</span>
            </div>
          </div>

          <div className="bg-orange-50 border-r-4 border-orange-500 p-6 rounded-2xl">
            <h4 className="font-black text-orange-950 mb-3 flex items-center gap-2 text-sm italic uppercase">
              ⚠️ تنبيه قانوني وفني (إلزامي):
            </h4>
            <p className="text-orange-900 text-sm leading-relaxed">
              هذه البرامج تعتمد على "حمل التدريب المستهدف" وليست استشارة طبية. يرجى التوقف فوراً عند الشعور بألم حاد في المفاصل أو ضيق في التنفس. يمنع التدريب في حالة ارتفاع درجة الحرارة أو الإصابة بنزلة برد شديدة.
            </p>
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-sm uppercase italic active:scale-95 transition-all"
          >
            الموافقة والمتابعة
          </button>
        </div>
      </motion.div>
    </div>
  );
}
