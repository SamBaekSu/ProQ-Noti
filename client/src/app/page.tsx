import { createClientForServer } from '@/utils/supabase/server';
import { TABLES } from '@/constant/db';
import { Team } from '@/types';
import HomePageClient from './HomePageClient';

async function getTeams(): Promise<Team[]> {
  const supabase = await createClientForServer();
  const { data, error } = await supabase
    .from(TABLES.TEAMS)
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching teams:', error);
    return [];
  }

  return data as Team[];
}

export default async function Page() {
  const teams = await getTeams();

  return <HomePageClient initialTeams={teams} />;
}
