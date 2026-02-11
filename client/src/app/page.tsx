import { getTeams } from '@/lib/queries/teams';
import HomePageClient from './HomePageClient';

export default async function Page() {
  const teams = await getTeams();

  return <HomePageClient initialTeams={teams} />;
}
