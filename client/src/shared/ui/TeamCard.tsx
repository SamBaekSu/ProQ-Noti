import { Team } from '@/shared/types';
import { cn } from '@/shared/lib/utils';

interface TeamCardProps {
  team: Team;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
}

/**
 * TeamCard Component - 팀 선택 카드
 * 반응형 디자인 적용
 */
export function TeamCard({
  team,
  onClick,
  selected = false,
  disabled = false
}: TeamCardProps) {
  const team_name = [team.name_prefix, team.name_suffix];
  const teamLabel = team_name.filter(Boolean).join(' ');

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`${teamLabel} 팀 선택`}
      className={cn(
        // Gaming card layout
        'group relative overflow-hidden',
        'flex flex-col items-center justify-between',
        'w-full aspect-square',
        'p-5 md:p-6 lg:p-7',
        'bg-dark-card/80 backdrop-blur-sm',
        'border-2',
        'rounded-lg',
        'transition-all duration-300 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral',

        // 기본 상태
        !selected && !disabled && [
          'border-dark-border',
          'hover:bg-dark-hover',
          'hover:border-opgg-blue',
          'hover:shadow-[0_0_20px_rgba(83,131,232,0.3)]',
          'hover:-translate-y-2',
          'hover:scale-105',
          'active:translate-y-0',
          'active:scale-100'
        ],

        // 선택 상태 - OP.GG Blue glow
        selected && [
          'bg-opgg-blue/10',
          'border-opgg-blue',
          'shadow-[0_0_30px_rgba(83,131,232,0.5)]',
          'scale-105'
        ],

        // 비활성 상태
        disabled && [
          'opacity-30',
          'cursor-not-allowed',
          'border-dark-border'
        ],

        // 활성 상태 커서
        !disabled && 'cursor-pointer'
      )}
    >
      {/* 상단: Selected Badge */}
      <div className="w-full flex justify-end">
        {selected && (
          <div className="px-2 py-1 bg-opgg-blue border border-opgg-blue shadow-[0_0_15px_rgba(83,131,232,0.6)] animate-scale-in rounded">
            <span className="text-xs font-black text-white uppercase tracking-wider">Selected</span>
          </div>
        )}
      </div>

      {/* 중앙: Team Name */}
      <div className="flex-1 flex flex-col items-center justify-center gap-1 md:gap-1.5">
        {team_name.map((name, index) =>
          name && (
            <span
              key={index}
              className={cn(
                'font-display font-black',
                'text-xl md:text-2xl lg:text-3xl',
                'leading-tight text-center uppercase tracking-wider',
                'transition-all duration-300',
                selected
                  ? 'text-white drop-shadow-[0_0_10px_rgba(83,131,232,0.8)]'
                  : 'text-gray-300',
                !selected && !disabled && 'group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(83,131,232,0.6)]'
              )}
            >
              {name}
            </span>
          )
        )}
      </div>

      {/* 하단: Placeholder for balance */}
      <div className="w-full" />
    </button>
  );
}
