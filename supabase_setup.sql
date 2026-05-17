-- 1. إنشاء جدول الملفات الشخصية (Profiles) لبيانات RUNZ الإضافية
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- قيد للتأكد من أن اسم المستخدم لا يقل عن 3 أحرف
  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- 2. تفعيل نظام الحماية (Row Level Security) لضمان الخصوصية
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. سياسات الوصول (Policies): من يمكنه رؤية ماذا؟
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 4. وظيفة (Function) برمجية تُستدعى آلياً من قاعدة البيانات
-- تقوم هذه الوظيفة باستخراج اسم المستخدم والهاتف من بيانات التسجيل وإضافتها للجدول
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, phone)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'username', 
    new.raw_user_meta_data->>'phone'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. المشغّل (Trigger): ربط عملية التسجيل في Auth بالجدول Profiles أعلاه
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
