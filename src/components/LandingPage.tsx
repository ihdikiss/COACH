import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Zap, Trophy, ArrowRight, User, Mail, Phone, Lock, ChevronLeft, Activity } from 'lucide-react';
import { AppView } from '../types';

interface LandingPageProps {
  onStart: (view: AppView) => void;
  onFinishRegister: () => void;
}

export default function LandingPage({ onStart, onFinishRegister }: LandingPageProps) {
  const [currentStep, setCurrentStep] = useState<'landing' | 'register' | 'login'>('landing');
  const [regType, setRegType] = useState<'free' | 'premium'>('free');

  const handleOpenRegister = (type: 'free' | 'premium') => {
    setRegType(type);
    setCurrentStep('register');
  };

  const handleFinishRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation: Save data here
    setCurrentStep('login');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onFinishRegister();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden text-right" dir="rtl">
      <AnimatePresence mode="wait">
        {currentStep === 'landing' ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-screen relative p-6"
          >
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-10">
              <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-green-500 rounded-full blur-[120px]" />
              <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-white rounded-full blur-[100px] opacity-20" />
            </div>

            {/* Header / Logo */}
            <div className="absolute top-8 right-8 flex items-center gap-2 group cursor-pointer">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:bg-green-500 transition-colors duration-500 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                <span className="font-black text-xl italic tracking-tighter text-black">R</span>
              </div>
              <span className="font-black text-2xl tracking-tighter uppercase italic group-hover:text-green-500 transition-colors">RUNZ</span>
            </div>

            {/* Hero Section */}
            <div className="max-w-4xl text-center space-y-8">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-sm mb-4"
              >
                <Zap size={16} className="text-orange-500" />
                <span>الجيل الجديد من التدريب الرياضي</span>
              </motion.div>

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-black italic uppercase leading-tight tracking-tight"
              >
                التدريب الرياضي المبني على <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-green-400 to-green-600">
                  أسس علمية صلبة
                </span>
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
              >
                انضم إلى نخبة العدائين مع برامج تدريبية مخصصة 100% لتناسب أهدافك، مستواك، وطبيعة جسمك. تقنيات احترافية الآن بين يديك.
              </motion.p>

              {/* Call to Action Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto pt-8"
              >
                <button
                  onClick={() => handleOpenRegister('free')}
                  className="group relative px-8 py-5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl transition-all flex items-center justify-center gap-3 overflow-hidden shadow-xl"
                >
                  <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors" />
                  <span className="font-bold text-lg relative z-10">النسخة المجانية</span>
                  <ArrowRight className="text-green-500 group-hover:-translate-x-1 transition-transform relative z-10" />
                </button>

                <button
                  onClick={() => handleOpenRegister('premium')}
                  className="group relative px-8 py-5 bg-green-500 hover:bg-green-400 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(34,197,94,0.3)] text-black"
                >
                  <span className="font-bold text-lg">النسخة المميزة</span>
                  <Trophy size={20} className="group-hover:scale-110 group-hover:rotate-12 transition-transform" />
                </button>
              </motion.div>

              <button 
                onClick={() => setCurrentStep('login')}
                className="text-slate-500 hover:text-white transition-colors text-sm font-bold block mx-auto pt-4 underline underline-offset-4"
              >
                لديك حساب بالفعل؟ تسجيل الدخول
              </button>
            </div>

            {/* Features Bar */}
            <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
                <div className="flex flex-col items-center gap-2 group cursor-default">
                    <ShieldCheck className="text-green-500 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">حماية البيانات</span>
                </div>
                <div className="flex flex-col items-center gap-2 group cursor-default">
                    <Zap className="text-white group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">استجابة ذكية</span>
                </div>
                <div className="flex flex-col items-center gap-2 group cursor-default">
                    <Trophy className="text-green-500 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">نتائج مثبتة</span>
                </div>
                <div className="flex flex-col items-center gap-2 group cursor-default">
                    <Activity className="text-white group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">رصد حي للجهد</span>
                </div>
            </div>
          </motion.div>
        ) : currentStep === 'register' ? (
          <motion.div
            key="register"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex items-center justify-center min-h-screen p-6"
          >
            <div className="w-full max-w-md space-y-8 bg-slate-900/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-xl">
              <div className="space-y-2 text-center">
                <button
                   onClick={() => setCurrentStep('landing')}
                   className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-bold mb-4"
                >
                    <ChevronLeft size={16} className="rotate-180" />
                    <span>العودة للرئيسية</span>
                </button>
                <div className="flex justify-center mb-4">
                     <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${regType === 'premium' ? 'bg-green-500/10 text-green-500' : 'bg-white/10 text-white'}`}>
                        {regType === 'premium' ? 'PREMIUM ACCESS' : 'FREE ACCESS'}
                     </span>
                </div>
                <h2 className="text-3xl font-black italic uppercase">إنشاء حساب جديد</h2>
                <p className="text-slate-400 text-sm">ادخل بياناتك للبدء في رحلة التدريب الاحترافي</p>
              </div>

              <form onSubmit={handleFinishRegister} className="space-y-4">
                <div className="space-y-1.5 text-right">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">اسم المستخدم</label>
                  <div className="relative group">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-green-500 transition-colors" size={18} />
                    <input
                      type="text"
                      required
                      placeholder="Username"
                      className="w-full bg-slate-800 border-none rounded-xl py-3.5 pr-12 pl-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-green-500 transition-all font-bold text-right"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-right">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">البريد الإلكتروني</label>
                  <div className="relative group">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors" size={18} />
                    <input
                      type="email"
                      required
                      placeholder="example@email.com"
                      className="w-full bg-slate-800 border-none rounded-xl py-3.5 pr-12 pl-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-red-500 transition-all font-bold text-right"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-right">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">رقم الهاتف</label>
                  <div className="relative group">
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors" size={18} />
                    <input
                      type="tel"
                      required
                      placeholder="+212 ..."
                      className="w-full bg-slate-800 border-none rounded-xl py-3.5 pr-12 pl-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-red-500 transition-all font-bold text-right"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-right">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">كلمة المرور</label>
                  <div className="relative group">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors" size={18} />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full bg-slate-800 border-none rounded-xl py-3.5 pr-12 pl-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-red-500 transition-all font-bold text-right"
                    />
                  </div>
                </div>

                  <button 
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-400 text-black font-black py-4 rounded-xl shadow-lg transition-all mt-6 uppercase italic tracking-tighter"
                  >
                    التسجيل والمتابعة
                  </button>

                <div className="text-center pt-4">
                  <span className="text-slate-500 text-sm italic">لديك حساب؟ </span>
                  <button 
                    type="button"
                    onClick={() => setCurrentStep('login')}
                    className="text-white hover:text-red-500 font-bold text-sm transition-colors"
                  >
                    سجل دخولك هنا
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-center min-h-screen p-6"
          >
            <div className="w-full max-w-md space-y-8 bg-slate-900/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-xl">
              <div className="space-y-2 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center rotate-3 group hover:rotate-0 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    <Lock className="text-black" size={32} />
                  </div>
                </div>
                <h2 className="text-3xl font-black italic uppercase text-white">تسجيل الدخول</h2>
                <p className="text-slate-400 text-sm">مرحباً بك مجدداً في RUNZ. ادخل بيانات حسابك</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5 text-right">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">البريد الإلكتروني أو المستخدم</label>
                  <div className="relative group">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors" size={18} />
                    <input
                      type="text"
                      required
                      placeholder="Email or Username"
                      className="w-full bg-slate-800 border-none rounded-xl py-4 pr-12 pl-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-red-500 transition-all font-bold text-right"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-right">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">كلمة المرور</label>
                  <div className="relative group">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors" size={18} />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full bg-slate-800 border-none rounded-xl py-4 pr-12 pl-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-red-500 transition-all font-bold text-right"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-white text-slate-950 hover:bg-slate-200 font-black py-4 rounded-xl shadow-lg transition-all mt-6 uppercase italic tracking-tighter"
                >
                  دخول للنظام
                </button>

                <div className="text-center pt-4">
                  <span className="text-slate-500 text-sm italic">ليس لديك حساب؟ </span>
                  <button 
                    type="button"
                    onClick={() => setCurrentStep('register')}
                    className="text-white hover:text-green-500 font-bold text-sm transition-colors"
                  >
                    إنشاء حساب جديد
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
