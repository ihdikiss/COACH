import { createClient } from '@supabase/supabase-js';

// القيم التي قدمتها للربط السريع
const DEFAULT_URL = 'https://fjvdwrtdogcvmcmsayzu.supabase.co';
const DEFAULT_KEY = 'sb_publishable_7pI59kGPCBqfUxorgJDqtA_Y6DRm61t';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_KEY;

// التحقق من وجود القيم قبل المحاولة لتجنب انهيار التطبيق
if (!supabaseUrl) {
  console.error('Supabase URL is missing!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
