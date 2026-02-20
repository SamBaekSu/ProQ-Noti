import { createClient } from '@supabase/supabase-js';
import { createClientForServer } from '@/shared/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClientForServer();

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: '인증 실패' }, { status: 401 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    try {
      const { data: subscribeData, error: subscribeError } = await (supabaseAdmin as any)
        .from('subscribe')
        .delete()
        .eq('user_id', user.id)
        .select();

      if (subscribeError) {
        console.warn('구독 정보 삭제 실패:', subscribeError.message);
      } else {
      }
    } catch (subscribeDeleteError) {
      console.warn('구독 테이블 접근 실패:', subscribeDeleteError);
    }

    try {
      const { data: fcmData, error: fcmError } = await (supabaseAdmin as any)
        .from('fcm_tokens')
        .delete()
        .eq('user_id', user.id)
        .select();

      if (fcmError) {
        console.warn('FCM 토큰 삭제 실패:', fcmError.message);
      } else {
      }
    } catch (fcmDeleteError) {
      console.warn('FCM 토큰 테이블 접근 실패:', fcmDeleteError);
    }

    const { data: deleteResult, error: deleteError } = await (supabaseAdmin as any)
      .from('users')
      .delete()
      .eq('id', user.id)
      .select();

    if (deleteError) {
      console.error('사용자 데이터 삭제 실패:', deleteError);
      return NextResponse.json(
        { error: `사용자 데이터 삭제 실패: ${deleteError.message}` },
        { status: 500 }
      );
    }

    const { error: authDeleteError } =
      await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (authDeleteError) {
      console.error('Auth 삭제 실패:', authDeleteError);
      console.warn(
        '사용자 데이터는 삭제되었지만 Auth 계정 삭제에 실패했습니다.'
      );
    } else {
    }

    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (signOutError) {
      console.warn('세션 종료 실패:', signOutError);
    }

    return NextResponse.json({
      message: '회원탈퇴가 완료되었습니다.',
      deletedData: {
        user: deleteResult,
        subscriptions: '구독 정보 삭제 완료',
        fcmTokens: 'FCM 토큰 삭제 완료'
      },
      warnings: authDeleteError ? ['Auth 계정 삭제 실패'] : [],
      shouldLogout: true
    });
  } catch (error) {
    console.error('회원탈퇴 처리 중 오류:', error);
    return NextResponse.json(
      {
        error: `처리 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
      },
      { status: 500 }
    );
  }
}
