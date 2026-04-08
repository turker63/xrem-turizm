import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();

    // Süper yetkili admin istemcisi (Auth bariyerlerini aşar)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // 1. Kullanıcıyı Authentication kısmına zorla ekle
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true // E-posta onayıyla uğraşmasınlar, direkt aktif olsun
    });

    if (authError) return NextResponse.json({ error: authError.message }, { status: 400 });

    // 2. Kullanıcıyı senin Beyaz Liste (admin_users) tablosuna ekle
    const { error: dbError } = await supabaseAdmin
      .from('admin_users')
      .insert([{ email, role }]);

    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 400 });

    return NextResponse.json({ message: "Başarıyla oluşturuldu" });
  } catch (err) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}