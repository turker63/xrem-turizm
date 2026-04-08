import { createClient } from '@supabase/supabase-js';

// .env.local dosyasındaki anahtarları çekiyoruz
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Supabase istemcisini başlatıyoruz
export const supabase = createClient(supabaseUrl, supabaseAnonKey);