/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import UserForm from './components/UserForm';
import ProgramView from './components/ProgramView';
import HealthReportModal from './components/HealthReportModal';
import LandingPage from './components/LandingPage';
import { UserProfile, CoachingProgram, Gender, SkillLevel, TrainingGoal, DayCompletion, ProgramType, AppView } from './types';
import { generateInitialProgram, generateSubsequentMonth } from './services/geminiService';
import { ShieldCheck, Info, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [isLoading, setIsLoading] = useState(false);
  const [program, setProgram] = useState<CoachingProgram | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<UserProfile>({
    age: 25,
    weight: 70,
    height: 175,
    gender: Gender.MALE,
    skillLevel: SkillLevel.BEGINNER,
    goal: TrainingGoal.GENERAL_HEALTH,
    programType: ProgramType.WEEKLY
  });
  const [completions, setCompletions] = useState<Record<string, DayCompletion>>(() => {
    const saved = localStorage.getItem('runz_completions');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('runz_completions', JSON.stringify(completions));
  }, [completions]);

  const handleGenerate = async (profile: UserProfile) => {
    setIsLoading(true);
    try {
      const result = await generateInitialProgram(profile);
      setProgram(result);
      // Reset completions for the new program context
      setCompletions({});
    } catch (error) {
      console.error("Generation error:", error);
      alert(`حدث خطأ أثناء توليد البرنامج: ${error instanceof Error ? error.message : 'خطأ غير معروف'}. يرجى المحاولة مرة أخرى.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteDay = (month: number, week: number, dayIndex: number) => {
    const key = `m${month}-w${week}-d${dayIndex}`;
    const wasCompleted = completions[key]?.completed;
    
    setCompletions(prev => ({
      ...prev,
      [key]: {
        month,
        week,
        dayIndex,
        completed: !wasCompleted,
        completedAt: !wasCompleted ? new Date().toISOString() : undefined
      }
    }));

    if (!wasCompleted) {
      // Anti-cheat alert with Allawi tone
      alert("لقد أتممت خطوة نحو القمة. تذكر: الغش في التمرين هو غش لنفسك، الجسد لا يكذب والنتائج تُبنى بالاستمرارية، وليس بالقفز فوق الأيام. نراك غداً!");
    }
  };

  const handleFetchNextMonth = async () => {
    if (!program) return;
    const nextMonthNumber = program.months.length + 1;
    if (nextMonthNumber > 3) return;

    setIsLoading(true);
    try {
      const context = `Last month theme was: ${program.months[program.months.length - 1].title}`;
      const nextMonth = await generateSubsequentMonth(currentProfile, nextMonthNumber, context);
      
      setProgram(prev => {
        if (!prev) return null;
        return {
          ...prev,
          months: [...prev.months, nextMonth]
        };
      });
      
      // Motivational success message
      alert(`أحسنت أيها العداء! لقد أثبت التزاماً حديدياً. تم فتح الشهر ${nextMonthNumber} بنجاح. تذكر أن الاستمرارية هي سر التفرق، والقمة تنتظر من لا يمل من الصعود.`);
    } catch (error) {
      console.error("Fetch next month error:", error);
      alert("حدث خطأ أثناء فتح الشهر التالي.");
    } finally {
      setIsLoading(false);
    }
  };

  const openReport = () => {
    if (!currentProfile.age || !currentProfile.weight || !currentProfile.height) {
      alert("يرجى إكمال بياناتك الأساسية أولاً (العمر، الوزن، الطول) لتوليد تقرير السلامة الخاص بك.");
      return;
    }
    setIsReportOpen(true);
  };

  return (
    <AnimatePresence mode="wait">
      {currentView === AppView.LANDING ? (
        <LandingPage 
          onStart={(view) => setCurrentView(view)} 
          onFinishRegister={() => setCurrentView(AppView.MAIN_APP)} 
        />
      ) : (
        <motion.div
          key="main-app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans transition-colors duration-500" dir="rtl"
        >
          <div className="max-w-6xl mx-auto bg-slate-50 rounded-[2.5rem] p-6 md:p-10 border-[10px] border-slate-200 shadow-2xl relative overflow-hidden">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
              <div 
                onClick={() => setCurrentView(AppView.LANDING)}
                className="cursor-pointer group"
              >
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic group-hover:text-green-600 transition-colors">
                  RUNZ<span className="text-green-500 group-hover:text-green-400">.ENGINE</span>
                </h1>
                <p className="text-slate-500 font-medium mt-1">المحرك التدريبي العلمي القائم على أسس "حمل التدريب" للدكتور علاوي</p>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={openReport}
                  className="bg-white hover:bg-slate-50 px-6 py-3 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3 transition-all active:scale-95 group"
                >
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                    <ShieldCheck size={24} />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-black tracking-widest leading-none mb-1">Status: Online</span>
                    <span className="text-slate-900 font-bold text-sm">تقرير الجاهزية والوقاية</span>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                </button>
              </div>
            </header>

            <main className="relative z-10">
              <AnimatePresence mode="wait">
                {!program ? (
                  <motion.div 
                    key="form-grid"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                  >
                    {/* Hero Intro Column */}
                    <div className="lg:col-span-5 space-y-8">
                      <div className="bg-slate-950 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden h-full flex flex-col justify-center border border-white/5">
                        <div className="relative z-10 space-y-6">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                            خوارزمية محاكاة الأحمال
                          </div>
                          <h2 className="text-5xl font-black leading-tight tracking-tighter uppercase italic">
                            RUN YOUR <br />
                            <span className="text-green-500">DATA SCIENTIFICALLY</span>
                          </h2>
                          <p className="text-slate-400 text-lg leading-relaxed">
                            نحن نطبق آلياً قواعد التموج (3:1) بناءً على الفصل الرابع من مرجع د. علاوي لضمان أقصى كفاءة فسيولوجية.
                          </p>
                          <div className="flex gap-4 pt-6">
                            <div className="flex flex-col">
                              <span className="text-2xl font-black text-white italic">⚪🟢🟢</span>
                              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em]">RUNZ PERFORMANCE SYSTEM</span>
                            </div>
                          </div>
                        </div>
                        {/* Decorative radial gradient */}
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-green-500/20 blur-[100px] rounded-full"></div>
                      </div>
                    </div>

                    {/* Form Column */}
                    <div className="lg:col-span-7">
                      <UserForm 
                        onSubmit={handleGenerate} 
                        onProfileChange={setCurrentProfile}
                        isLoading={isLoading} 
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="program"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <ProgramView 
                      program={program} 
                      onReset={() => setProgram(null)} 
                      completions={completions}
                      onToggleDay={handleCompleteDay}
                      onUnlockNextMonth={handleFetchNextMonth}
                      isMonthLoading={isLoading}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </main>

            <footer className="mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
              <div>المرجع: "علم التدريب الرياضي" - د. محمد حسن علاوي</div>
              <div className="flex items-center gap-2">
                <span>Powered by Allawi.AI Logic Layer</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span>2026</span>
              </div>
            </footer>
          </div>

          <HealthReportModal 
            isOpen={isReportOpen} 
            onClose={() => setIsReportOpen(false)} 
            profile={currentProfile}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

