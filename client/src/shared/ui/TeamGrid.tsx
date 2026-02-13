import { Team } from '@/shared/types';
import { TeamCard } from './TeamCard';

interface TeamGridProps {
  teamList: Team[];
  onSelectTeam: (team: string) => void;
  selectedTeam?: string | null;
}

/**
 * TeamGrid Component - 반응형 팀 그리드
 * Mobile (360px): 2열 그리드
 * Tablet (768px): 3열 그리드
 * Desktop (960px+): 4열 그리드
 */
export function TeamGrid({
  teamList,
  onSelectTeam,
  selectedTeam
}: TeamGridProps) {
  if (!teamList || teamList.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full">
        <p className="text-gray-400 text-lg font-bold uppercase">팀 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div
      className="
        w-full
        grid
        grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        auto-rows-max
        justify-items-stretch
        gap-3
        md:gap-4
        lg:gap-6
        p-4
        md:p-6
        lg:p-8
        max-w-7xl
        mx-auto
      "
      role="group"
      aria-label="팀 선택"
    >
      {teamList.map((team) => (
        <div key={team.id} className="w-full max-w-sm mx-auto">
          <TeamCard
            team={team}
            selected={selectedTeam === team.name_abbr}
            onClick={() => onSelectTeam(team.name_abbr)}
          />
        </div>
      ))}
    </div>
  );
}
