'use server';

import { createClientForServer } from '@/shared/lib/supabase/server';
import { cache } from 'react';

/**
 * @description Get all team members with subscription status
 * @param teamAbbr - Team abbreviation
 * @param userId - Optional user ID to check subscription status
 * @returns Player data with subscription info
 * @note Uses React cache to deduplicate requests during a single render
 */
export const getPlayersWithSubscription = cache(async (
  teamAbbr: string,
  userId?: string
) => {
  const supabase = await createClientForServer();

  const { data, error } = await (supabase as any).rpc('get_players_with_subscription', {
    team_abbr: teamAbbr,
    ...(userId != null ? { current_user_id: userId } : {})
  });

  if (error) {
    throw new Error('Failed to fetch players');
  }

  return data;
});

/**
 * @description Get team ID by team abbreviation
 * @param teamAbbr - Team abbreviation
 * @returns Team ID
 */
export async function getTeamIdByAbbr(teamAbbr: string) {
  const supabase = await createClientForServer();

  const { data, error } = await (supabase as any)
    .from('teams')
    .select('id')
    .eq('name_abbr', teamAbbr)
    .single();

  if (error || !data) {
    throw new Error('팀 ID 조회 실패');
  }

  return data.id;
}
