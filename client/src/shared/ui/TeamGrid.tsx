import { Team } from '@/shared/types';
import { TeamCard } from './TeamCard';

type TeamGridProps = {
  teamList: Team[];
  onSelectTeam: (team: string) => void;
};

export function TeamGrid({ teamList, onSelectTeam }: TeamGridProps) {
  return (
    <div className="grid grid-cols-2 w-full h-full gap-4 place-items-center px-20 md:px-28 py-5">
      {teamList.map((team) => (
        <TeamCard
          key={team.id} // key는 고유한 id를 사용하는 것이 더 좋아.
          team={team}
          onClick={() => onSelectTeam(team.name_abbr)}
        />
      ))}
    </div>
  );
}
