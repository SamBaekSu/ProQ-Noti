import { Team } from '@/shared/types';
import { TeamCard } from './TeamCard';
import { cn } from '@/shared/lib/utils';

interface TeamGridProps {
  teamList: Team[];
  onSelectTeam: (team: string) => void;
  selectedTeam?: string | null;
}

// LCK 팀 목록 (2025 기준)
const LCK_TEAMS = ['T1', 'GEN', 'DK', 'HLE', 'KT', 'DRX', 'NS', 'BRO', 'FOX', 'KDF', 'BNK', 'DN'];

// 팀을 그룹별로 분류
function groupTeams(teams: Team[]) {
  const lckTeams: Team[] = [];
  const challengersTeams: Team[] = [];
  const otherTeams: Team[] = [];

  teams.forEach((team) => {
    const abbr = team.name_abbr.trim();
    if (LCK_TEAMS.includes(abbr)) {
      lckTeams.push(team);
    } else if (
      abbr.includes('CL') ||
      abbr === 'OK'
    ) {
      challengersTeams.push(team);
    } else {
      otherTeams.push(team);
    }
  });

  return { lckTeams, challengersTeams, otherTeams };
}

/**
 * TeamGrid Component - 리그별 그룹화된 팀 그리드
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

  const { lckTeams, challengersTeams, otherTeams } = groupTeams(teamList);

  const gridClassName = cn(
    'w-full grid',
    'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    'auto-rows-max justify-items-center',
    'gap-3 md:gap-4 lg:gap-6',
    'px-1'
  );

  return (
    <div className="flex justify-center w-full px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
      <div className="w-full">
        {/* LCK Teams */}
        {lckTeams.length > 0 && (
          <section className="mb-12 md:mb-16" role="group" aria-label="LCK 팀">
            <div className="mb-6 md:mb-8 relative">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-wider">
                  LCK
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-opgg-blue/50 to-transparent" />
              </div>
              <p className="text-sm md:text-base text-gray-400 mt-2 font-semibold">
                {lckTeams.length}개 팀
              </p>
            </div>
            <div className={gridClassName}>
              {lckTeams.map((team) => (
                <div key={team.id} className="w-full flex justify-center">
                  <TeamCard
                    team={team}
                    selected={selectedTeam === team.name_abbr}
                    onClick={() => onSelectTeam(team.name_abbr)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Challengers League Teams */}
        {challengersTeams.length > 0 && (
          <section className="mb-12 md:mb-16" role="group" aria-label="Challengers League 팀">
            <div className="mb-6 md:mb-8 relative">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-wider">
                  Challengers League
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-mint/50 to-transparent" />
              </div>
              <p className="text-sm md:text-base text-gray-400 mt-2 font-semibold">
                {challengersTeams.length}개 팀
              </p>
            </div>
            <div className={gridClassName}>
              {challengersTeams.map((team) => (
                <div key={team.id} className="w-full flex justify-center">
                  <TeamCard
                    team={team}
                    selected={selectedTeam === team.name_abbr}
                    onClick={() => onSelectTeam(team.name_abbr)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Other Teams */}
        {otherTeams.length > 0 && (
          <section role="group" aria-label="기타 팀">
            <div className="mb-6 md:mb-8 relative">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-wider">
                  Other
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-600/50 to-transparent" />
              </div>
              <p className="text-sm md:text-base text-gray-400 mt-2 font-semibold">
                {otherTeams.length}개 팀
              </p>
            </div>
            <div className={gridClassName}>
              {otherTeams.map((team) => (
                <div key={team.id} className="w-full flex justify-center">
                  <TeamCard
                    team={team}
                    selected={selectedTeam === team.name_abbr}
                    onClick={() => onSelectTeam(team.name_abbr)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
