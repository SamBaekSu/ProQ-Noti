'use server';

import { createClientForServer } from '@/shared/lib/supabase/server';

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
    throw new Error('Failed to fetch teams');
  }

  return data;
}
