/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserProfile, Gender } from '../types';
import { X, ShieldCheck, Activity, Heart, AlertCircle, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HealthReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export default function HealthReportModal({ isOpen, onClose, profile }: HealthReportModalProps) {
  const calculateBMI = () => {
    const heightInMeters = profile.height / 100;
    return Number((profile.weight / (heightInMeters * heightInMeters)).toFixed(1));
  };

  const bmi = calculateBMI();
  const hrMax = 220 - profile.age;
  const hrMinSafe = Math.round(hrMax * 0.6);
  const hrMaxSafe = Math.round(hrMax * 0.7);

  const getIdealWeightRange = () => {
    const heightInMeters = profile.height / 100;
    const min = Number((18.5 * heightInMeters * heightInMeters).toFixed(1));
    const max = Number((24.9 * heightInMeters * heightInMeters).toFixed(1));
    return { min, max };
  };

  const idealWeight = getIdealWeightRange();

  const getBMICategory = () => {
    if (bmi < 18.5) return "نقص وزن";
    if (bmi < 25) return "وزن مثالي";
    if (bmi < 30) return "وزن زائد";
    return "سمنة";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh] border border-slate-200"
            dir="rtl"
          >
            {/* Header */}
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center sticky top-0 z-10 no-print">
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
                aria-label="إغلاق التقرير"
              >
                <X size={24} />
              </button>
              <div className="flex items-center gap-3 text-left md:text-right">
                <div className="text-left md:text-right">
                  <h2 className="text-2xl font-black italic tracking-tight">تقرير الجاهزية والوقاية</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Readiness & Prevention Analysis</p>
                </div>
                <div className="p-3 bg-blue-500 rounded-2xl hidden md:block">
                  <ShieldCheck size={28} />
                </div>
              </div>
            </div>

            {/* Print Only Header */}
            <div className="print-only p-8 border-b-2 border-slate-900 mb-8">
              <div className="flex justify-between items-center">
                <div className="text-right">
                  <h1 className="text-4xl font-black italic tracking-tighter">
                    RUNZ<span className="text-blue-600">.ENGINE</span>
                  </h1>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Allawi Scientific Logic V2</p>
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-bold text-slate-900">تقرير الجاهزية البدنية والوقائية</h2>
                  <p className="text-xs text-slate-400 font-medium">التاريخ: {new Date().toLocaleDateString('ar-EG')}</p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Profile Inputs Section */}
              <section className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-wrap gap-6 justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">العمر</span>
                  <span className="text-lg font-black text-slate-900">{profile.age} سنة</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">الوزن</span>
                  <span className="text-lg font-black text-slate-900">{profile.weight} كجم</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">الطول</span>
                  <span className="text-lg font-black text-slate-900">{profile.height} سم</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">الجنس</span>
                  <span className="text-lg font-black text-slate-900">{profile.gender === Gender.MALE ? 'ذكر' : 'أنثى'}</span>
                </div>
              </section>

              {/* BMI & Ideal Weight Section */}
              <section className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-orange-500 rounded-full"></span>
                  تحليل كتلة الجسم والمنطق الفسيولوجي
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col justify-center items-center text-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">مؤشر BMI</span>
                    <div className="text-4xl font-black text-slate-900">{bmi}</div>
                    <div className="text-sm font-bold text-blue-600 mt-1">{getBMICategory()}</div>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col justify-center items-center text-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">النطاق المثالي للوزن</span>
                    <div className="text-xl font-black text-slate-900">{idealWeight.min} - {idealWeight.max}</div>
                    <div className="text-[10px] font-bold text-slate-500 mt-1">كجم (حسب طولك الفعلي)</div>
                  </div>
                </div>
              </section>

              {/* Allawi Logic Analysis Sections */}
              <div className="space-y-6">
                {/* 1. Heart Rate Analysis (HR Max) */}
                <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                      <Activity size={20} />
                    </div>
                    <h4 className="font-black text-slate-900">قاعدة نبض القلب الأقصى (HR Max)</h4>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    بناءً على عمرك، نطاق النبض الآمن لك أثناء الجري المتوسط يجب أن يتراوح بين <span className="font-bold text-red-600">[{hrMinSafe} إلى {hrMaxSafe}]</span> نبضة/دقيقة (ذروتك: {hrMax}). {profile.gender === Gender.FEMALE ? 'فسيولوجياً، نبض الإناث أسرع لضخ الدم،' : 'فسيولوجياً، نبض الذكور أبطأ وأقوى لامتلاكهم قلباً أكبر،'} مما يؤثر على مستوى الجهد.
                  </p>
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200">
                    💡 نصيحة علاوي: ركز في البداية على الأراضي العشبية أو الممرات المخصصة لامتصاص الصدمات وحماية الأوتار.
                  </p>
                </div>

                {/* 2. Age & Recovery Analysis */}
                <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <Heart size={20} />
                    </div>
                    <h4 className="font-black text-slate-900">تحليل السن (دورة الاستشفاء)</h4>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    بما أن عمرك <span className="font-bold text-slate-900">[{profile.age}] سنة</span>، فإن معدل الاستشفاء الفسيولوجي لديك يتطلب <span className="font-bold text-blue-600">{profile.age > 40 ? '8-9' : '7-8'} ساعات نوم</span> عميق لإتمام دورة البناء العضلي.
                  </p>
                  <p className="text-xs text-slate-500 italic bg-blue-50/50 p-3 rounded-xl border border-dashed border-blue-200">
                    💡 توصية فنية: التزم ببروتوكول إحماء لا يقل عن 10 دقائق لتنشيط الجهاز الدوري قبل البدء، لتجنب إصابات الأوتار والتصلب المفصلي.
                  </p>
                </div>

                {/* 3. Metabolism & Hormonal Analysis */}
                <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                      <Activity size={20} />
                    </div>
                    <h4 className="font-black text-slate-900">تحليل التمثيل الغذائي والبيئة الهرمونية</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-purple-50/30 p-4 rounded-2xl border border-purple-100/50">
                      <div className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-1">الحالة الأيضية (Metabolic Rate)</div>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        بناءً على عمرك البالغ <span className="font-bold text-slate-900">[{profile.age}] عاماً</span>، يقدر محركنا أن معدل حرق الدهون لديك يحتاج إلى <span className="font-bold text-purple-700">{profile.age > 35 ? 'جري هوائي منخفض الشدة طويل الأمد' : 'تدريبات متواترة عالية الكثافة (HIIT)'}</span> لتحفيز الميتابولزم وتجنب زيادة الوزن الميكانيكي على المفاصل.
                      </p>
                    </div>

                    <div className="bg-amber-50/30 p-4 rounded-2xl border border-amber-100/50">
                      <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">المؤشر الهرموني (توازن التستوستيرون)</div>
                      {profile.age < 30 ? (
                        <p className="text-sm text-slate-700 leading-relaxed">
                          بيئتك الهرمونية في ذروتها؛ جسمك قادر على تحمل أحمال "صدمة" والاستشفاء منها سريعاً. ركز على كفاءة البناء السريع واستغلال ذروة التستوستيرون الطبيعي.
                        </p>
                      ) : profile.age <= 35 ? (
                        <p className="text-sm text-slate-700 leading-relaxed">
                          أنت في مرحلة التوازن الهرموني المثالي. الاستمرار في الجري المنتظم يحافظ على مستويات الطاقة ويمنع الانخفاض التدريجي في معدلات الحرق.
                        </p>
                      ) : (
                        <p className="text-sm text-slate-700 leading-relaxed">
                          يجب الحذر من الإجهاد المزمن (الكورتيزول) الذي يخفض مستويات التستوستيرون. برنامجك سيعتمد على "الاستشفاء النشط" لضمان الحفاظ على الكتلة العضلية وتحفيز الهرمونات البنائية بشكل طبيعي، مع فترات راحة أطول بين الحصص العالية.
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-[10px] text-slate-400 font-medium italic">
                    * ملاحظة: كلما زاد السن، قلت سرعة ترميم الألياف العضلية، مما يتطلب تدرجاً أدق في الأحمال لمنع الإصابات التراكمية.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-col items-center gap-4 no-print">
                <div className="flex gap-3">
                  <button 
                    onClick={onClose}
                    className="px-10 py-4 bg-slate-100 text-slate-900 font-black rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                  >
                    إغلاق التقرير
                  </button>
                  <button 
                    onClick={() => { 
                      if (window.confirm('Are you sure you want to print this report?')) {
                        window.focus(); 
                        window.print(); 
                      }
                    }}
                    className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-200 flex items-center gap-2"
                  >
                    <Printer size={18} />
                    طباعة التقرير (PDF)
                  </button>
                </div>
              </div>

              {/* Print Only Disclaimer */}
              <div className="print-only mt-12 pt-8 border-t border-slate-200 text-center">
                <p className="text-[10px] text-slate-400 leading-relaxed max-w-lg mx-auto grayscale">
                  هذا التقرير استرشادي بناءً على علوم التدريب الرياضي (Allawi Scientific Logic)، ويُنصح دائماً بمراجعة المختصين أو الأطباء في حالات الإصابة أو التاريخ المرضي الخاص. تطبيق RUNZ غير مسؤول عن سوء استخدام البيانات.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
