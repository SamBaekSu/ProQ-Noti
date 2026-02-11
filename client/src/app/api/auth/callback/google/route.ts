import { createClientForServer } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect('/error?message=Missing authorization code');
  }

  const supabase = await createClientForServer();

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `/error?message=${encodeURIComponent(error.message)}`
    );
  }

  const { user } = data.session;

  if (!user) {
    return NextResponse.json({ message: 'empty user' });
  }

  const { error: insertError } = await (supabase as any).from('users').upsert(
    {
      id: user.id,
      email: user.email,
      user_name: user.user_metadata?.name || 'Unknown User',
      avatar_url: user.user_metadata?.avatar_url || null,
      created_at: new Date().toISOString()
    },
    { onConflict: 'id' }
  );

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}`);
}
