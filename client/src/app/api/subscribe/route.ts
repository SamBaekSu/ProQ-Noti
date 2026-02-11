import { TABLES } from '@/constant/db';
import { supabase } from '@/utils/supabase/client';

/**
 * @description Get all team members
 * @returns string[]
 */
export const GET = async (teamAbbr: string, userId?: string) => {
  const { data, error } = await supabase.rpc('get_players_with_subscription', {
    team_abbr: teamAbbr,
    current_user_id: userId ?? undefined
  } as any);

  if (error) {
    return { status: 500, body: { error: 'Internal Server Error' } };
  }

  return data;
};

/**
 * @description Get team Id
 * @param teamAbbr
 * @returns number
 */
export const GET_TEAM_ID = async (teamAbbr: string) => {
  const { data, error } = await supabase
    .from(TABLES.TEAMS)
    .select('id')
    .eq('name_abbr', teamAbbr)
    .single();

  if (error || !data) {
    throw new Error('팀 ID 조회 실패');
  }

  return (data as any).id;
};

/**
 * @description Subscribe or Unsubscribe
 * @param userId
 * @param token
 * @param pro_id
 * @returns { status: 'subscribed' | 'unsubscribed' }
 */
export const POST = async (userId: string, token: string, pro_id: number) => {
  const { data, error } = await supabase
    .from(TABLES.SUBSCRIBE)
    .select('id')
    .match({ user_id: userId, riot_pro_user_id: pro_id });

  if (error) throw new Error('구독 조회 실패');

  if (data && data.length > 0) {
    const { error: deleteError } = await supabase
      .from(TABLES.SUBSCRIBE)
      .delete()
      .match({ user_id: userId, riot_pro_user_id: pro_id });

    if (deleteError) throw new Error('구독 취소 실패');
    return { status: 'unsubscribed' };
  } else {
    const { error: insertError } = await supabase
      .from(TABLES.SUBSCRIBE)
      .insert({ user_id: userId, riot_pro_user_id: pro_id } as any);

    if (insertError) throw new Error('구독 등록 실패');
    return { status: 'subscribed' };
  }
};
