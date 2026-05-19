import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Activity, Heart, Scale, CheckCircle2, ChevronDown, Check, Info } from 'lucide-react';
import { UserProfile, SkillLevel, TrainingGoal } from '../types';
import { GOAL_DEFINITIONS } from '../constants';

interface HealthReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export default function HealthReportModal({ isOpen, onClose, profile }: HealthReportModalProps) {
  if (!isOpen) return null;

  // 1. حسابات كتلة الجسم والوزن المثالي للجري
  const heightMeters = profile.height / 100;
  const bmi = profile.weight / (heightMeters * heightMeters);
  
  // الوزن المثالي للعداء (بين مؤشر 19.5 و 22.5 وهو النطاق الأمثل للأداء والوقاية من المفاصل)
  const idealWeightMin = 19.5 * (heightMeters * heightMeters);
  const idealWeightMax = 22.5 * (heightMeters * heightMeters);

  const getBmiStatus = () => {
    if (bmi < 18.5) return { label: 'تحت الوزن الطبيعي للعداء', color: 'text-amber-500', bg: 'bg-amber-500/10' };
    if (bmi < 24.9) return { label: 'وزن مثالي وأداء فسيولوجي متميز', color: 'text-green-500', bg: 'bg-green-500/10' };
    if (bmi < 29.9) return { label: 'وزن زائد (مخاطر المفاصل متوسطة)', color: 'text-orange-500', bg: 'bg-orange-500/10' };
    return { label: 'سمنة (يجب خفض شدة الصدمات الهوائية مباشرة)', color: 'text-red-500', bg: 'bg-red-500/10' };
  };

  const status = getBmiStatus();

  // 2. حساب نبضات القلب المستهدفة (physiological zones)
  const maxHeartRate = 220 - profile.age;
  const fatBurnZoneMin = Math.round(maxHeartRate * 0.60);
  const fatBurnZoneMax = Math.round(maxHeartRate * 0.70);
  const aerobicZoneMin = Math.round(maxHeartRate * 0.70);
  const aerobicZoneMax = Math.round(maxHeartRate * 0.80);
  const anaerobicZoneMin = Math.round(maxHeartRate * 0.81);
  const anaerobicZoneMax = Math.round(maxHeartRate * 0.90);

  // 3. الأسئلة الطبية التفاعلية (PAR-Q Questionnaire)
  const parqQuestions = [
    { id: 1, text: 'هل سبق وأن أخبرك طبيب بأنك تعاني من مشكلة في القلب أو ضغط الدم؟' },
    { id: 2, text: 'هل تشعر بآلام في الصدر أثناء ممارسة النشاط البدني أو الجري؟' },
    { id: 3, text: 'هل تفقد توازنك أو تعاني من الدوخة المستمرة أثناء المجهود؟' },
    { id: 4, text: 'هل تعاني من مشاكل في العظام أو المفاصل قد تزداد سوءاً مع الجري والارتطام؟' },
    { id: 5, text: 'هل تتناول حالياً أي أدوية موصوفة لأمراض القلب أو ضغط الدم؟' }
  ];

  const [parqAnswers, setParqAnswers] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false
  });

  const [termsAccepted, setTermsAccepted] = useState(false);

  const toggleParq = (id: number) => {
    setParqAnswers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const hasAnyYes = Object.values(parqAnswers).some(val => val === true);

  // نصيحة تخصيص مخصصة تفاعلية بناءً على الهدف السريري
  const getGoalAdvice = () => {
    switch (profile.goal) {
      case TrainingGoal.WEIGHT_LOSS:
        return 'الهدف الأساسي هو تخسيس الوزن: ينصح بالتركيز بشكل رئيسي على منطقة حرق الدهون المستهدفة (Zone 2) بنبض يتراوح بين ' + fatBurnZoneMin + ' و ' + fatBurnZoneMax + ' نبضة في الدقيقة لتعزيز أكسدة الدهون بكفاءة فسيولوجية عالية وتقليل الجهد المفاجئ على الركبتين.';
      case TrainingGoal.FITNESS:
        return 'الهدف الأساسي هو تحسين اللياقة البدنية العامة: احرص على التنوع الذكي بين الاستشفاء الهوائي الخفيف وتدريبات العتبة اللاهوائية (نبض ' + aerobicZoneMin + ' - ' + aerobicZoneMax + ' bpm) لتحفيز الكفاءة الفسيولوجية للجهاز الدوري والتنفسي.';
      case TrainingGoal.RACE:
        return 'الهدف الأساسي هو الجري لسباق وبناء عتبة السرعة: خطتك تحتوي على فترات شدة عالية (Zone 4) تصل إلى نبض ' + anaerobicZoneMin + ' - ' + anaerobicZoneMax + ' bpm. تأكد من إكمال الاستشفاء الكامل وعدم إهمال فترات النوم والتغذية الهيدراتية الكافية.';
      default:
        return 'أنت تتدرب على خطة جري متقدمة لقطع المسافات. التركيز على تموج الأحمال التدريبية لضمان التكيف التدريجي (Supercompensation) دون السقوط في الإجهاد المفرط.';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-slate-900 text-white rounded-[2.5rem] w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-800 my-8"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-red-600 to-amber-600 p-8 text-white flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -z-0"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
              <ShieldAlert size={30} className="text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight italic">لوحة الجاهزية الطبية والبدنية</h2>
              <p className="text-white/80 text-[10px] font-black uppercase tracking-widest leading-none mt-1">Medical Clearance & Dynamic Physiology Monitor</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/60 hover:text-white transition-colors text-xs font-mono border border-white/10 hover:border-white/20 px-4 py-2 rounded-xl backdrop-blur-md relative z-10"
          >
            إغلاق [X]
          </button>
        </div>

        {/* Content Section */}
        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
          
          {/* 1. Physiological Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* BMI Card */}
            <div className="p-6 bg-slate-800/50 rounded-3xl border border-slate-800 flex flex-col items-center text-center gap-2">
              <Scale className="text-cyan-400" size={24} />
              <span className="text-[10px] font-black uppercase text-slate-400">مؤشر كتلة الجسم (BMI)</span>
              <span className="text-3xl font-black text-white">{bmi.toFixed(1)}</span>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${status.bg} ${status.color}`}>
                {status.label}
              </span>
              <div className="text-[10px] text-slate-500 mt-1">
                الوزن المثالي الموصى به لجسمك:<br />
                <span className="font-bold text-slate-400">{Math.round(idealWeightMin)} - {Math.round(idealWeightMax)} كجم</span>
              </div>
            </div>

            {/* Pulsing Zones Card */}
            <div className="p-6 bg-slate-800/50 rounded-3xl border border-slate-800 flex flex-col items-center text-center gap-2">
              <Heart className="text-red-400 animate-pulse" size={24} />
              <span className="text-[10px] font-black uppercase text-slate-400">النطاق والنبض المستهدف</span>
              <span className="text-3xl font-black text-white">{maxHeartRate} bpm</span>
              <span className="text-[10px] font-bold text-red-400 px-3 py-1 rounded-full bg-red-500/10">
                النبض الأقصى المقدر (MHR)
              </span>
              <div className="text-[10px] text-slate-500 mt-1 space-y-0.5 text-right w-full">
                <div className="flex justify-between">
                  <span>حرق الدهون:</span>
                  <span className="font-bold text-slate-400">{fatBurnZoneMin}-{fatBurnZoneMax}</span>
                </div>
                <div className="flex justify-between">
                  <span>تحمل هوائي:</span>
                  <span className="font-bold text-slate-400">{aerobicZoneMin}-{aerobicZoneMax}</span>
                </div>
              </div>
            </div>

            {/* Injury Risk Analysis */}
            <div className="p-6 bg-slate-800/50 rounded-3xl border border-slate-800 flex flex-col items-center text-center gap-2">
              <Activity className="text-amber-400" size={24} />
              <span className="text-[10px] font-black uppercase text-slate-400">تصنيف مخاطر الإصابة بدقة</span>
              <span className="text-3xl font-black text-white">
                {bmi > 26.5 || profile.age > 45 ? 'متوسط الحمل' : 'آمن ومتكامل'}
              </span>
              <span className="text-[10px] text-slate-400 font-bold px-3 py-1 rounded-full bg-amber-500/10">
                معامل المفاصل والارتداد الفسيولوجي
              </span>
              <div className="text-[10px] text-slate-500 mt-1">
                {bmi > 26.5 
                  ? 'يُنصح بشدة بالتبديل مع راحة إيجابية لتجنب آلام مفصل الركبة والكاحل.'
                  : 'تكوين فسيولوجي متميز وصالح لتطبيق تكييفات الأحمال القوية مباشرة.'}
              </div>
            </div>

          </div>

          {/* 2. Dynamic Advice Panel based on Goal */}
          <div className="bg-slate-800/30 border border-slate-800 p-6 rounded-3xl flex gap-4 items-start">
            <div className="w-10 h-10 bg-green-500/10 rounded-2xl flex items-center justify-center shrink-0 text-green-400">
              <Info size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-200 mb-1 text-sm">نصائح فسيولوجيا التدريب لهدف {GOAL_DEFINITIONS[profile.goal]?.label || 'التدريب'}:</h4>
              <p className="text-slate-400 text-xs leading-relaxed">{getGoalAdvice()}</p>
            </div>
          </div>

          {/* 3. PAR-Q Medical Screen */}
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-2">
              <h3 className="font-black text-sm uppercase tracking-wider text-slate-300">استمارة الجاهزية الذاتية للنشاط البدني (PAR-Q)</h3>
              <p className="text-[10px] text-slate-500">أجب عن الأسئلة التالية بصدق لتعزيز سلامتك وتجنب السقوط الإجهادي لمرجع الدكتور علاوي.</p>
            </div>

            <div className="space-y-2">
              {parqQuestions.map(q => (
                <div 
                  key={q.id}
                  onClick={() => toggleParq(q.id)}
                  className={`flex justify-between items-center p-4 rounded-2xl transition-all cursor-pointer border ${
                    parqAnswers[q.id] 
                      ? 'bg-red-500/10 border-red-500/30' 
                      : 'bg-slate-800/20 border-slate-800 hover:bg-slate-800/40'
                  }`}
                >
                  <span className="text-xs font-bold leading-relaxed pr-2">{q.text}</span>
                  <div className="flex items-center gap-3 shrink-0 select-none">
                    <span className="text-[10px] font-black">{parqAnswers[q.id] ? 'نعم ⚠️' : 'لا'}</span>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all ${
                      parqAnswers[q.id] ? 'bg-red-500 border-red-500 text-white' : 'border-slate-700 bg-slate-900 text-slate-500'
                    }`}>
                      {parqAnswers[q.id] && <Check size={14} className="stroke-[3]" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {hasAnyYes && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-500 text-xs leading-relaxed"
              >
                <strong>⚠️ ملحوظة طبية حرجة:</strong> لقد أجبت بـ "نعم" على سؤال أو أكثر من أسئلة الجاهزية. يوصى بشدة بالحصول على استشارة طبية أو موافقة صريحة من طبيبك المختص قبل الانخراط في التمرينات ذات الأحمال العالية ببرنامج RUNZ.
              </motion.div>
            )}
          </div>

          {/* 4. Terms and Safety Policy Check */}
          <div className="p-6 bg-slate-950/40 rounded-3xl border border-slate-800 space-y-4">
            <h4 className="font-black text-xs uppercase tracking-wider text-slate-300">التعهد والمسؤولية القانونية والفنية</h4>
            <div className="flex items-start gap-4">
              <div 
                onClick={() => setTermsAccepted(!termsAccepted)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border cursor-pointer select-none transition-all ${
                  termsAccepted ? 'bg-green-500 border-green-500 text-black shadow-lg shadow-green-500/20' : 'border-slate-700 text-transparent bg-slate-900 hover:border-slate-600'
                }`}
              >
                <Check size={18} className="stroke-[3]" />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed cursor-pointer" onClick={() => setTermsAccepted(!termsAccepted)}>
                أقر وأتعهد أنا المشترك بأنني على دراية كاملة بمتطلبات التدريب، وسأتوقف فوراً عن التمرين في حال حدوث أي ضيق غير معتاد في المفاصل أو القلب، وأتحمل كامل المسؤولية الفردية عن جاهزيتي وصحتي البدنية أثناء الخطة التدريبية المخصصة لي.
              </p>
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-8 bg-slate-950 border-t border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="text-[10px] text-slate-500 italic max-w-sm text-center md:text-right">
            * هذا التطبيق يقوم بمحاكاة وتخصيص الأحمال العلمية للعدائين الأصحاء الخالين من الأعراض المرضية.
          </div>
          <button 
            onClick={onClose}
            disabled={!termsAccepted}
            className={`w-full md:w-auto bg-green-500 hover:bg-green-400 text-slate-950 px-10 py-4 rounded-xl font-black text-sm uppercase italic active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer ${
              !termsAccepted ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500 hover:bg-slate-800' : ''
            }`}
          >
            <CheckCircle2 size={16} />
            أؤكد جاهزيتي وبدء التطبيقات
          </button>
        </div>
      </motion.div>
    </div>
  );
}
