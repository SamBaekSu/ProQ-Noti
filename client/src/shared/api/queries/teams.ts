'use server';

import { createClientForServer } from '@/shared/lib/supabase/server';
import { handleSupabaseError, ERROR_MESSAGES } from '@/shared/lib/error-handler';

/**
 * @description Get all teams
 * @returns Team data array
 */
export async function getTeams() {
  const supabase = await createClientForServer();

  const { data, error } = await (supabase as any)
    .from('teams')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    handleSupabaseError(error, ERROR_MESSAGES.FETCH_TEAMS);
  }

  return data;
}
