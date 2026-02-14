'use server';

import { createClientForServer } from '@/shared/lib/supabase/server';
import { handleSupabaseError, ERROR_MESSAGES } from '@/shared/lib/error-handler';

/**
 * @description Get all live (online) players
 * @returns Live player data array
 */
export async function getLivePlayers() {
  const supabase = await createClientForServer();

  const { data, error } = await (supabase as any)
    .from('riot_pro_users')
    .select(`
      id,
      pro_name,
      riot_accounts!inner (
        id,
        puuid,
        summoner_name,
        tag_line,
        is_online
      ),
      teams!inner (
        name_abbr,
        name_prefix,
        name_suffix
      )
    `)
    .eq('riot_accounts.is_online', true)
    .order('pro_name', { ascending: true });

  if (error) {
    handleSupabaseError(error, ERROR_MESSAGES.FETCH_LIVE_PLAYERS);
  }

  // Transform data to flatten structure
  return data.map((player: any) => ({
    id: player.id,
    pro_name: player.pro_name,
    team_abbr: player.teams.name_abbr,
    team_name: [player.teams.name_prefix, player.teams.name_suffix]
      .filter(Boolean)
      .join(' '),
    summoner_name: player.riot_accounts.summoner_name,
    tag_line: player.riot_accounts.tag_line,
    puuid: player.riot_accounts.puuid,
    is_online: player.riot_accounts.is_online
  }));
}
