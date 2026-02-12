'use server';

import { createClientForServer } from '@/shared/lib/supabase/server';

/**
 * @description Save or update FCM token and device type using upsert.
 * The operation is based on the unique constraint of (user_id, device_type).
 * @param userId
 * @param token
 * @param deviceType
 * @returns { status: 'success' | 'error', message?: string }
 */
export async function upsertFcmToken(
  userId: string,
  token: string,
  deviceType: string
) {
  try {
    const supabase = await createClientForServer();

    const { error } = await (supabase as any)
      .from('fcm_tokens')
      .upsert(
        {
          user_id: userId,
          fcm_token: token,
          device_type: deviceType,
          updated_at: new Date().toISOString()
        },
        {
          // 어떤 기준으로 중복을 판단할지 지정
          // 'user_id'와 'device_type'이 모두 같은 행이 있으면 업데이트, 없으면 삽입
          onConflict: 'user_id,device_type'
        }
      );

    // upsert 과정에서 에러가 발생했다면
    if (error) {
      // 에러를 던져서 아래 catch 블록에서 처리하도록 함
      throw error;
    }

    const successMessage = 'FCM 토큰이 성공적으로 저장/업데이트되었습니다.';
    return { status: 'success' as const, message: successMessage };
  } catch (err) {
    console.error('❌ FCM 토큰 upsert 중 오류 발생:', err);
    return {
      status: 'error' as const,
      message: (err as Error).message || '알 수 없는 서버 오류'
    };
  }
}
