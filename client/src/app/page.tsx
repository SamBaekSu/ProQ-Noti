import { getTeams } from '@/shared/api/queries/teams';
import { getLivePlayers } from '@/shared/api/queries/live';
import HomePageClient from './HomePageClient';

export default async function Page() {
  const [teams, livePlayers] = await Promise.all([
    getTeams(),
    getLivePlayers()
  ]);

  return <HomePageClient initialTeams={teams} initialLivePlayers={livePlayers} />;
}
