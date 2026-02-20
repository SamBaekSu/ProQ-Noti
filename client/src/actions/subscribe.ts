'use server';

import { createClientForServer } from '@/shared/lib/supabase/server';

/**
 * @description Subscribe or Unsubscribe to a pro player
 * @param userId
 * @param proId
 * @returns { status: 'subscribed' | 'unsubscribed' }
 */
export async function toggleSubscription(userId: string, proId: number) {
  const supabase = await createClientForServer();

  const { data, error } = await (supabase as any)
    .from('subscribe')
    .select('id')
    .match({ user_id: userId, riot_pro_user_id: proId });

  if (error) throw new Error('구독 조회 실패');

  if (data && data.length > 0) {
    const { error: deleteError } = await (supabase as any)
      .from('subscribe')
      .delete()
      .match({ user_id: userId, riot_pro_user_id: proId });

    if (deleteError) throw new Error('구독 취소 실패');
    return { status: 'unsubscribed' as const };
  } else {
    const { error: insertError} = await (supabase as any)
      .from('subscribe')
      .insert({
        user_id: userId,
        riot_pro_user_id: proId
      });

    if (insertError) throw new Error('구독 등록 실패');
    return { status: 'subscribed' as const };
  }
}
