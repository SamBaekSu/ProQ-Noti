import { createClientForServer } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (!code) {
    return NextResponse.redirect(
      new URL('/error?message=Missing authorization code', request.url)
    );
  }

  const supabase = await createClientForServer();

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth exchange error:', error);
      return NextResponse.redirect(
        `/error?message=${encodeURIComponent(error.message)}`
      );
    }

    const { user } = data.session;

    if (!user) {
      return NextResponse.json({ message: 'empty user' });
    }

    const { error: insertError } = await supabase.from('users').upsert(
      {
        id: user.id,
        email: user.email,
        user_name:
          user.user_metadata?.name ||
          user.user_metadata?.full_name ||
          'Unknown User',
        avatar_url:
          user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
        updated_at: new Date().toISOString()
      },
      {
        onConflict: 'id',
        ignoreDuplicates: false
      }
    );

    if (insertError) {
      console.error('User insert/update error:', insertError);
    }

    const redirectUrl = new URL(next, request.url);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Unexpected error in auth callback:', error);
    return NextResponse.redirect(
      new URL('/error?message=Authentication failed', request.url)
    );
  }
}
