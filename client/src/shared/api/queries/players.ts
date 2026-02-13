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

  // 1. 팀 ID 조회
  const { data: teamData, error: teamError } = await (supabase as any)
    .from('teams')
    .select('id')
    .eq('name_abbr', teamAbbr)
    .single();

  if (teamError || !teamData) {
    throw new Error('팀 정보를 찾을 수 없습니다');
  }

  // 2. 선수 조회 및 구독 정보 조인
  const { data: players, error: playersError } = await (supabase as any)
    .from('riot_pro_users')
    .select(`
      id,
      pro_name,
      position_number,
      league,
      is_starter,
      riot_accounts!inner (
        id,
        summoner_name,
        tag_line,
        region,
        puiid: puuid,
        is_online,
        last_online,
        streamer_mode,
        last_match_id
      ),
      subscribe (
        user_id
      )
    `)
    .eq('team_id', teamData.id)
    .order('position_number', { ascending: true });

  if (playersError) {
    console.error('Fetch players error:', playersError);
    throw new Error('선수 정보를 불러올 수 없습니다');
  }

  // 3. 데이터 가공
  return players.map((p: any) => ({
    id: p.id,
    pro_name: p.pro_name,
    summoner_name: p.riot_accounts[0]?.summoner_name || '',
    tag_line: p.riot_accounts[0]?.tag_line || '',
    is_online: p.riot_accounts[0]?.is_online || false,
    last_online: p.riot_accounts[0]?.last_online || null,
    puuid: p.riot_accounts[0]?.puiid || '',
    streamer_mode: p.riot_accounts[0]?.streamer_mode || false,
    last_match_id: p.riot_accounts[0]?.last_match_id || null,
    is_subscribed: p.subscribe?.some((s: any) => s.user_id === userId) || false,
    team_id: teamData.id,
    league: p.league,
    account_id: p.riot_accounts[0]?.id || 0
  }));
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
